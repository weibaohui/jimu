//! 插件加载器

use super::traits::*;
use libloading::{Library, Symbol};
use std::path::{Path, PathBuf};
use anyhow::{Context, Result};
use flate2::read::GzDecoder;
use tar::Archive;
use std::fs::{self, File};
use std::io::BufReader;

/// 插件状态
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
#[serde(rename_all = "lowercase")]
pub enum PluginState {
    /// 已加载，on_load 已调用
    Enabled,
    /// 已停止，仍加载但不服务请求
    Stopped,
    /// 运行中，正在服务请求
    Running,
    /// 已禁用，on_unload 已调用
    Disabled,
    /// 出错
    Error(String),
}

/// 已加载的插件
pub struct LoadedPlugin {
    pub name: String,
    pub library: Library,
    pub plugin: Box<dyn Plugin>,
    pub manifest: PluginManifest,
    pub plugin_dir: PathBuf,
    pub state: PluginState,
}

/// 插件清单
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct PluginManifest {
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: Option<String>,
    pub min_host_version: Option<String>,
    pub backend: BackendConfig,
    pub frontend: FrontendConfig,
    pub menu: Option<MenuConfig>,
    pub api: Option<ApiConfig>,
    pub permissions: Option<PermissionsConfig>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct BackendConfig {
    pub main: String,
    pub permissions: Vec<String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct FrontendConfig {
    pub entry: String,
    pub style: Option<String>,
    pub chunks: Vec<String>,
    pub assets: Vec<String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ApiConfig {
    pub prefix: String,
    pub routes: Vec<ApiRoute>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ApiRoute {
    pub path: String,
    pub method: String,
    pub handler: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct PermissionsConfig {
    pub database: Option<DatabasePermissions>,
    pub api: Option<ApiPermissions>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct DatabasePermissions {
    pub tables: Vec<String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ApiPermissions {
    pub external_urls: Vec<String>,
}

/// 插件加载器
pub struct PluginLoader {
    pub context: PluginContext,
    pub plugins_dir: PathBuf,
}

impl PluginLoader {
    pub fn new(context: PluginContext, plugins_dir: PathBuf) -> Self {
        Self {
            context,
            plugins_dir,
        }
    }

    /// 从 .plugin 文件加载插件
    pub async fn load_from_package(&self, package_path: &Path) -> Result<LoadedPlugin> {
        log::info!("开始加载插件包: {:?}", package_path);

        // 1. 解压插件包
        let plugin_dir = self.extract_plugin_package(package_path)?;

        // 2. 读取并验证 manifest.json
        let manifest = self.read_and_validate_manifest(&plugin_dir)?;

        // 3. 加载动态库
        let lib_path = self.get_library_path(&plugin_dir, &manifest)?;
        let library = self.load_library(&lib_path)?;

        // 4. 调用插件工厂函数
        let plugin = self.create_plugin_instance(&library)?;

        // 5. 调用插件的 on_load 钩子
        self.initialize_plugin(&plugin).await?;

        // 6. 保存插件信息
        let loaded = LoadedPlugin {
            name: manifest.name.clone(),
            library,
            plugin,
            manifest,
            plugin_dir,
            state: PluginState::Enabled,
        };

        log::info!("插件 '{}' (v{}) 加载成功", loaded.name, loaded.manifest.version);

        // 记录到插件日志
        let log_store = super::log_store::get_log_store();
        log_store.add_log(
            &loaded.name,
            super::log_store::PluginLogLevel::Info,
            &format!("插件加载成功 (v{})", loaded.manifest.version),
        );

        Ok(loaded)
    }

    /// 从目录加载插件
    pub async fn load_from_directory(&self, plugin_dir: PathBuf) -> Result<LoadedPlugin> {
        log::info!("从目录加载插件: {:?}", plugin_dir);

        // 1. 读取并验证 manifest.json
        let manifest = self.read_and_validate_manifest(&plugin_dir)?;

        // 2. 加载动态库
        let lib_path = self.get_library_path(&plugin_dir, &manifest)?;
        let library = self.load_library(&lib_path)?;

        // 3. 调用插件工厂函数
        let plugin = self.create_plugin_instance(&library)?;

        // 4. 调用插件的 on_load 钩子
        self.initialize_plugin(&plugin).await?;

        // 5. 保存插件信息
        let loaded = LoadedPlugin {
            name: manifest.name.clone(),
            library,
            plugin,
            manifest,
            plugin_dir,
            state: PluginState::Enabled,
        };

        log::info!("插件 '{}' (v{}) 加载成功", loaded.name, loaded.manifest.version);

        // 记录到插件日志
        let log_store = super::log_store::get_log_store();
        log_store.add_log(
            &loaded.name,
            super::log_store::PluginLogLevel::Info,
            &format!("插件加载成功 (v{})", loaded.manifest.version),
        );

        Ok(loaded)
    }

    /// 解压插件包
    fn extract_plugin_package(&self, package_path: &Path) -> Result<PathBuf> {
        log::info!("解压插件包: {:?}", package_path);

        // 读取 .plugin 文件
        let file = File::open(package_path)
            .with_context(|| "无法打开插件包")?;

        let reader = BufReader::new(file);
        let decoder = GzDecoder::new(reader);
        let mut archive = Archive::new(decoder);

        // 创建临时解压目录
        let temp_dir = std::env::temp_dir()
            .join(format!("jimu-plugin-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&temp_dir)?;

        // 解压所有文件
        for entry in archive.entries()? {
            let mut entry = entry?;
            let path = temp_dir.join(entry.path()?);

            // 确保父目录存在
            if let Some(parent) = path.parent() {
                fs::create_dir_all(parent)?;
            }

            entry.unpack(&path)?;
        }

        log::info!("插件包解压到: {:?}", temp_dir);
        Ok(temp_dir)
    }

    /// 读取并验证 manifest.json
    fn read_and_validate_manifest(&self, plugin_dir: &Path) -> Result<PluginManifest> {
        let manifest_path = plugin_dir.join("manifest.json");

        if !manifest_path.exists() {
            anyhow::bail!("manifest.json 不存在: {:?}", manifest_path);
        }

        let content = fs::read_to_string(&manifest_path)?;
        let manifest: PluginManifest = serde_json::from_str(&content)
            .with_context(|| "解析 manifest.json 失败")?;

        self.validate_manifest(&manifest)?;

        Ok(manifest)
    }

    /// 验证插件清单
    fn validate_manifest(&self, manifest: &PluginManifest) -> Result<()> {
        if manifest.name.is_empty() {
            anyhow::bail!("插件名称不能为空");
        }

        if manifest.version.is_empty() {
            anyhow::bail!("插件版本不能为空");
        }

        if manifest.backend.main.is_empty() {
            anyhow::bail!("后端入口文件不能为空");
        }

        if manifest.frontend.entry.is_empty() {
            anyhow::bail!("前端入口文件不能为空");
        }

        // 检查最小宿主版本
        if let Some(min_version) = &manifest.min_host_version {
            let current_version = env!("CARGO_PKG_VERSION");
            if !self.check_version(current_version, min_version) {
                log::warn!(
                    "插件 {} 要求最小宿主版本 {}, 当前版本 {}",
                    manifest.name,
                    min_version,
                    current_version
                );
            }
        }

        Ok(())
    }

    /// 检查版本号
    fn check_version(&self, current: &str, min: &str) -> bool {
        // 简单的版本比较（实际应该使用 semver 包）
        let current_parts: Vec<u32> = current.split('.')
            .map(|s| s.parse().unwrap_or(0))
            .collect();
        let min_parts: Vec<u32> = min.split('.')
            .map(|s| s.parse().unwrap_or(0))
            .collect();

        for i in 0..3 {
            let current = current_parts.get(i).unwrap_or(&0);
            let min = min_parts.get(i).unwrap_or(&0);
            if current < min {
                return false;
            } else if current > min {
                return true;
            }
        }
        true
    }

    /// 获取动态库路径
    fn get_library_path(&self, plugin_dir: &Path, manifest: &PluginManifest) -> Result<PathBuf> {
        let mut lib_path = plugin_dir.join(&manifest.backend.main);

        // 如果路径不存在，尝试自动检测平台特定的动态库
        if !lib_path.exists() {
            let os = std::env::consts::OS;
            let ext = match os {
                "linux" => "so",
                "macos" => "dylib",
                "windows" => "dll",
                _ => return Err(anyhow::anyhow!("不支持的操作系统: {}", os)),
            };

            let alt_path = plugin_dir.join(format!("backend/plugin.{}", ext));
            if alt_path.exists() {
                lib_path = alt_path;
            }
        }

        if !lib_path.exists() {
            anyhow::bail!("插件动态库不存在: {:?}", lib_path);
        }

        Ok(lib_path)
    }

    /// 加载动态库
    fn load_library(&self, lib_path: &Path) -> Result<Library> {
        log::info!("加载动态库: {:?}", lib_path);

        unsafe {
            Library::new(lib_path)
                .with_context(|| format!("无法加载动态库: {:?}", lib_path))
        }
    }

    /// 创建插件实例
    fn create_plugin_instance(&self, library: &Library) -> Result<Box<dyn Plugin>> {
        log::info!("创建插件实例");

        unsafe {
            let create: Symbol<unsafe extern "C" fn() -> *mut dyn Plugin> =
                library.get(b"create_plugin")
                    .with_context(|| "无法找到 create_plugin 函数")?;

            let raw = create();
            let plugin = Box::from_raw(raw);
            Ok(plugin)
        }
    }

    /// 初始化插件
    async fn initialize_plugin(&self, plugin: &Box<dyn Plugin>) -> Result<()> {
        log::info!("初始化插件: {}", plugin.name());

        plugin.on_load(&self.context).await
            .map_err(|e| anyhow::anyhow!("插件初始化失败: {}", e))?;

        Ok(())
    }
}
