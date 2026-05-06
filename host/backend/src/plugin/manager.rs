//! 插件管理器

use super::{traits::*, loader::{LoadedPlugin, PluginState}};
use std::collections::HashMap;
use std::sync::{Arc, RwLock, atomic::{AtomicBool, Ordering}};
use std::path::{Path, PathBuf};
use anyhow::{Context, Result};

/// 插件管理器
pub struct PluginManager {
    plugins: Arc<RwLock<HashMap<String, Arc<LoadedPlugin>>>>,
    loader: super::loader::PluginLoader,
    reloading: Arc<RwLock<HashMap<String, AtomicBool>>>,
}

impl PluginManager {
    pub fn new(context: PluginContext) -> Self {
        let plugins_dir = PathBuf::from(&context.config.plugins_dir);
        Self {
            plugins: Arc::new(RwLock::new(HashMap::new())),
            loader: super::loader::PluginLoader::new(context, plugins_dir),
            reloading: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// 从目录加载所有插件
    pub async fn load_from_directory(&self, plugins_dir: &str) -> Result<()> {
        let dir = PathBuf::from(plugins_dir);

        if !dir.exists() {
            log::warn!("插件目录不存在: {:?}", dir);
            return Ok(());
        }

        log::info!("从目录加载插件: {:?}", dir);

        let entries = std::fs::read_dir(&dir)
            .with_context(|| format!("无法读取插件目录: {:?}", dir))?;

        for entry in entries {
            let entry = entry?;
            let path = entry.path();

            if !path.is_dir() || path.file_name().unwrap().to_string_lossy().starts_with('.') {
                continue;
            }

            let plugin_name = path.file_name().unwrap().to_string_lossy().to_string();

            if self.is_reloading(&plugin_name) {
                log::warn!("插件 {} 正在重新加载中，跳过", plugin_name);
                continue;
            }

            // 跳过没有 manifest.json 的非插件目录
            if !path.join("manifest.json").exists() {
                log::warn!("跳过非插件目录: {} (缺少 manifest.json)", plugin_name);
                continue;
            }

            match self.loader.load_from_directory(path.clone()).await {
                Ok(loaded) => {
                    let mut plugins = self.plugins.write().unwrap();
                    plugins.insert(plugin_name.clone(), Arc::new(loaded));
                }
                Err(e) => {
                    log::error!("加载插件 {} 失败: {:?}", plugin_name, e);
                }
            }
        }

        Ok(())
    }

    /// 从 .plugin 文件加载插件
    pub async fn load_from_package(&self, package_path: &str) -> Result<()> {
        let path = PathBuf::from(package_path);

        if !path.exists() {
            anyhow::bail!("插件包不存在: {:?}", path);
        }

        log::info!("从插件包加载: {:?}", path);

        match self.loader.load_from_package(&path).await {
            Ok(loaded) => {
                let name = loaded.name.clone();
                let mut plugins = self.plugins.write().unwrap();
                plugins.insert(name.clone(), Arc::new(loaded));
                log::info!("插件 '{}' 加载成功", name);
                Ok(())
            }
            Err(e) => {
                log::error!("加载插件失败: {:?}", e);
                Err(e)
            }
        }
    }

    /// 卸载插件
    pub async fn unload_plugin(&self, name: &str) -> Result<()> {
        let loaded = {
            let mut plugins = self.plugins.write().unwrap();
            plugins.remove(name)
        };

        if let Some(loaded) = loaded {
            loaded.plugin.on_unload().await
                .map_err(|e| anyhow::anyhow!("插件卸载失败: {}", e))?;
            log::info!("插件 '{}' 卸载成功", name);

            // 记录到插件日志
            let log_store = super::log_store::get_log_store();
            log_store.add_log(name, super::log_store::PluginLogLevel::Info, "插件已卸载");

            Ok(())
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 启用插件（调用 on_load）
    pub async fn enable_plugin(&self, name: &str) -> Result<()> {
        // 克隆 Arc 并释放锁，避免跨 await 持有 RwLockReadGuard
        let loaded = {
            let plugins = self.plugins.read().unwrap();
            plugins.get(name).cloned()
        };

        if let Some(loaded) = loaded {
            let current_state = loaded.state.read().unwrap().clone();
            if current_state == PluginState::Disabled {
                let ctx = self.loader.context.clone();
                loaded.plugin.on_load(&ctx).await
                    .map_err(|e| anyhow::anyhow!("插件启用失败: {}", e))?;
                loaded.plugin.on_enable().await
                    .map_err(|e| anyhow::anyhow!("插件启用回调失败: {}", e))?;
                *loaded.state.write().unwrap() = PluginState::Enabled;
                log::info!("插件 '{}' 已启用", name);
                Ok(())
            } else {
                log::warn!("插件 '{}' 当前状态 {:?}，无法启用", name, current_state);
                Ok(())
            }
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 禁用插件（调用 on_unload）
    pub async fn disable_plugin(&self, name: &str) -> Result<()> {
        let loaded = {
            let plugins = self.plugins.read().unwrap();
            plugins.get(name).cloned()
        };

        if let Some(loaded) = loaded {
            let current_state = loaded.state.read().unwrap().clone();
            if current_state == PluginState::Enabled || current_state == PluginState::Running {
                loaded.plugin.on_disable().await
                    .map_err(|e| anyhow::anyhow!("插件禁用回调失败: {}", e))?;
                loaded.plugin.on_unload().await
                    .map_err(|e| anyhow::anyhow!("插件禁用失败: {}", e))?;
                *loaded.state.write().unwrap() = PluginState::Disabled;
                log::info!("插件 '{}' 已禁用", name);
                Ok(())
            } else {
                log::warn!("插件 '{}' 当前状态 {:?}，无法禁用", name, current_state);
                Ok(())
            }
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 启动插件（设置为 Running 状态）
    pub async fn start_plugin(&self, name: &str) -> Result<()> {
        let loaded = {
            let plugins = self.plugins.read().unwrap();
            plugins.get(name).cloned()
        };

        if let Some(loaded) = loaded {
            let current_state = loaded.state.read().unwrap().clone();
            if current_state == PluginState::Enabled || current_state == PluginState::Stopped {
                *loaded.state.write().unwrap() = PluginState::Running;
                log::info!("插件 '{}' 已启动", name);
                Ok(())
            } else {
                log::warn!("插件 '{}' 当前状态 {:?}，无法启动", name, current_state);
                Ok(())
            }
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 停止插件（设置为 Stopped 状态）
    pub async fn stop_plugin(&self, name: &str) -> Result<()> {
        let loaded = {
            let plugins = self.plugins.read().unwrap();
            plugins.get(name).cloned()
        };

        if let Some(loaded) = loaded {
            let current_state = loaded.state.read().unwrap().clone();
            if current_state == PluginState::Running {
                *loaded.state.write().unwrap() = PluginState::Stopped;
                log::info!("插件 '{}' 已停止", name);
                Ok(())
            } else {
                log::warn!("插件 '{}' 当前状态 {:?}，无法停止", name, current_state);
                Ok(())
            }
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 重新加载插件（热更新）
    pub async fn reload_plugin(&self, name: &str) -> Result<()> {
        log::info!("开始重新加载插件: {}", name);

        if self.is_reloading(name) {
            anyhow::bail!("插件 {} 正在重新加载中", name);
        }

        self.set_reloading(name, true);

        let plugin_info = {
            let plugins = self.plugins.read().unwrap();
            if let Some(loaded) = plugins.get(name) {
                Some((
                    loaded.plugin_dir.clone(),
                    loaded.manifest.version.clone(),
                ))
            } else {
                None
            }
        };

        if let Some((plugin_dir, current_version)) = plugin_info {
            let manifest_path = plugin_dir.join("manifest.json");
            if let Ok(manifest) = self.read_manifest(&manifest_path) {
                if manifest.version == current_version {
                    log::warn!("插件 {} 版本未变化: {}", name, current_version);
                    self.set_reloading(name, false);
                    return Ok(());
                }
                log::info!("插件版本变化: {} -> {}", current_version, manifest.version);
            }

            self.unload_plugin(name).await?;

            match self.loader.load_from_directory(plugin_dir).await {
                Ok(loaded) => {
                    let new_version = loaded.manifest.version.clone();
                    let mut plugins = self.plugins.write().unwrap();
                    plugins.insert(name.to_string(), Arc::new(loaded));
                    log::info!("插件 '{}' 重新加载成功 (版本: {})", name, new_version);

                    // 记录到插件日志
                    let log_store = super::log_store::get_log_store();
                    log_store.add_log(
                        name,
                        super::log_store::PluginLogLevel::Info,
                        &format!("插件重新加载成功 (v{})", new_version),
                    );

                    self.set_reloading(name, false);
                    Ok(())
                }
                Err(e) => {
                    log::error!("插件 '{}' 重新加载失败: {:?}", name, e);

                    // 记录错误到插件日志
                    let log_store = super::log_store::get_log_store();
                    log_store.add_log(
                        name,
                        super::log_store::PluginLogLevel::Error,
                        &format!("插件重新加载失败: {}", e),
                    );

                    self.set_reloading(name, false);
                    Err(e)
                }
            }
        } else {
            anyhow::bail!("插件 '{}' 未找到", name);
        }
    }

    /// 批量重新加载所有插件
    pub async fn reload_all_plugins(&self) -> Result<Vec<String>> {
        log::info!("开始批量重新加载所有插件");

        let plugin_names: Vec<String> = {
            let plugins = self.plugins.read().unwrap();
            plugins.keys().cloned().collect()
        };

        let mut success = Vec::new();
        let mut failed = Vec::new();

        for name in plugin_names {
            match self.reload_plugin(&name).await {
                Ok(_) => success.push(name),
                Err(e) => {
                    log::error!("重新加载插件 {} 失败: {:?}", name, e);
                    failed.push(name);
                }
            }
        }

        log::info!("批量重新加载完成: 成功 {}, 失败 {}", success.len(), failed.len());

        if failed.is_empty() {
            Ok(success)
        } else {
            Err(anyhow::anyhow!("部分插件重新加载失败: {:?}", failed))
        }
    }

    /// 获取插件
    pub fn get_plugin(&self, name: &str) -> Option<Arc<LoadedPlugin>> {
        let plugins = self.plugins.read().unwrap();
        plugins.get(name).cloned()
    }

    /// 获取所有插件
    pub fn get_all_plugins(&self) -> Vec<Arc<LoadedPlugin>> {
        let plugins = self.plugins.read().unwrap();
        plugins.values().cloned().collect()
    }

    /// 获取所有插件信息
    pub fn get_plugin_infos(&self) -> Vec<PluginInfo> {
        let plugins = self.plugins.read().unwrap();
        plugins.values().map(|loaded| PluginInfo {
            name: loaded.name.clone(),
            version: loaded.manifest.version.clone(),
            description: loaded.manifest.description.clone(),
            author: loaded.manifest.author.clone(),
            state: loaded.state.read().unwrap().clone(),
        }).collect()
    }

    /// 获取插件详情
    pub fn get_plugin_detail(&self, name: &str) -> Option<PluginDetail> {
        let plugins = self.plugins.read().unwrap();
        plugins.get(name).map(|loaded| {
            let routes = loaded.plugin.get_routes();
            let route_paths: Vec<String> = routes.iter().map(|r| {
                format!("{} {}", match r.method {
                    jimu_plugin_interface::Method::GET => "GET",
                    jimu_plugin_interface::Method::POST => "POST",
                    jimu_plugin_interface::Method::PUT => "PUT",
                    jimu_plugin_interface::Method::DELETE => "DELETE",
                    jimu_plugin_interface::Method::PATCH => "PATCH",
                }, r.path)
            }).collect();

            PluginDetail {
                name: loaded.name.clone(),
                version: loaded.manifest.version.clone(),
                description: loaded.manifest.description.clone(),
                author: loaded.manifest.author.clone(),
                state: loaded.state.read().unwrap().clone(),
                routes: route_paths,
                permissions: loaded.manifest.backend.permissions.clone(),
            }
        })
    }

    /// 检查插件是否存在
    pub fn plugin_exists(&self, name: &str) -> bool {
        let plugins = self.plugins.read().unwrap();
        plugins.contains_key(name)
    }

    /// 获取插件数量
    pub fn plugin_count(&self) -> usize {
        let plugins = self.plugins.read().unwrap();
        plugins.len()
    }

    /// 检查是否正在重新加载
    fn is_reloading(&self, name: &str) -> bool {
        let reloading = self.reloading.read().unwrap();
        if let Some(flag) = reloading.get(name) {
            flag.load(Ordering::SeqCst)
        } else {
            false
        }
    }

    /// 设置重新加载标记
    fn set_reloading(&self, name: &str, value: bool) {
        let mut reloading = self.reloading.write().unwrap();
        reloading.entry(name.to_string())
            .or_insert_with(|| AtomicBool::new(false))
            .store(value, Ordering::SeqCst);
    }

    /// 读取插件清单
    fn read_manifest(&self, manifest_path: &Path) -> Result<super::loader::PluginManifest> {
        let content = std::fs::read_to_string(manifest_path)?;
        let manifest: super::loader::PluginManifest = serde_json::from_str(&content)?;
        Ok(manifest)
    }
}

/// 插件信息（列表用）
#[derive(Debug, serde::Serialize)]
pub struct PluginInfo {
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: Option<String>,
    #[serde(rename = "status")]
    pub state: PluginState,
}

/// 插件详情
#[derive(Debug, serde::Serialize)]
pub struct PluginDetail {
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: Option<String>,
    #[serde(rename = "status")]
    pub state: PluginState,
    pub routes: Vec<String>,
    pub permissions: Vec<String>,
}
