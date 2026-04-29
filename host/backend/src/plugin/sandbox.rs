//! 插件沙箱机制

use std::time::{Duration, Instant};
use std::sync::{Arc, atomic::{AtomicUsize, Ordering}};
use std::collections::HashSet;
use anyhow::Result;

/// 沙箱配置
#[derive(Debug, Clone)]
pub struct SandboxConfig {
    /// 最大内存使用（字节）
    pub max_memory: usize,
    /// 最大 CPU 时间（毫秒）
    pub max_cpu_time: u64,
    /// 允许的系统调用
    pub allowed_syscalls: HashSet<String>,
    /// 禁止的文件操作
    pub forbidden_files: Vec<String>,
    /// 禁止的网络地址
    pub forbidden_networks: Vec<String>,
}

impl Default for SandboxConfig {
    fn default() -> Self {
        let mut allowed_syscalls = HashSet::new();
        allowed_syscalls.insert("read".to_string());
        allowed_syscalls.insert("write".to_string());
        allowed_syscalls.insert("open".to_string());

        Self {
            max_memory: 1024 * 1024 * 1024, // 1GB
            max_cpu_time: 30 * 1000,      // 30秒
            allowed_syscalls,
            forbidden_files: vec![
                "/etc/passwd".to_string(),
                "/etc/shadow".to_string(),
            ],
            forbidden_networks: vec![
                "127.0.0.1".to_string(),  // 本地回环
            ],
        }
    }
}

/// 插件沙箱
pub struct PluginSandbox {
    config: SandboxConfig,
    memory_usage: Arc<AtomicUsize>,
    cpu_time: Arc<AtomicUsize>,
    operation_count: Arc<AtomicUsize>,
    start_time: Instant,
}

impl PluginSandbox {
    pub fn new(config: SandboxConfig) -> Self {
        Self {
            config,
            memory_usage: Arc::new(AtomicUsize::new(0)),
            cpu_time: Arc::new(AtomicUsize::new(0)),
            operation_count: Arc::new(AtomicUsize::new(0)),
            start_time: Instant::now(),
        }
    }

    /// 创建默认沙箱
    pub fn default() -> Self {
        Self::new(SandboxConfig::default())
    }

    /// 在沙箱中执行插件操作
    pub async fn execute<F, R>(
        &self,
        plugin_name: &str,
        operation: F,
    ) -> Result<R>
    where
        F: FnOnce() -> Result<R>,
    {
        let operation_start = Instant::now();
        self.operation_count.fetch_add(1, Ordering::SeqCst);

        log::debug!("沙箱执行插件 {} 操作 #{}", plugin_name,
            self.operation_count.load(Ordering::Relaxed));

        // 1. 检查内存使用
        self.check_memory_limit(plugin_name)?;

        // 2. 检查 CPU 时间限制
        self.check_cpu_time_limit(plugin_name)?;

        // 3. 执行操作
        let result = operation();

        // 4. 更新 CPU 时间
        let duration = operation_start.elapsed().as_millis() as usize;
        self.cpu_time.fetch_add(duration, Ordering::SeqCst);

        log::debug!("插件 {} 操作完成，耗时: {}ms", plugin_name, duration);

        result
    }

    /// 检查内存限制
    fn check_memory_limit(&self, plugin_name: &str) -> Result<()> {
        let current_memory = self.memory_usage.load(Ordering::Relaxed);

        if current_memory > self.config.max_memory {
            let error_msg = format!(
                "插件 {} 超出内存限制: {} / {}",
                plugin_name,
                current_memory,
                self.config.max_memory
            );
            log::error!("{}", error_msg);
            return Err(SandboxError::MemoryLimitExceeded {
                plugin_name: plugin_name.to_string(),
                current: current_memory,
                limit: self.config.max_memory,
            }.into());
        }

        Ok(())
    }

    /// 检查 CPU 时间限制
    fn check_cpu_time_limit(&self, plugin_name: &str) -> Result<()> {
        let current_cpu_time = self.cpu_time.load(Ordering::Relaxed) as u64;
        let total_time = self.start_time.elapsed().as_millis() as u64;

        if current_cpu_time > self.config.max_cpu_time {
            let error_msg = format!(
                "插件 {} 超出 CPU 时间限制: {}ms / {}ms",
                plugin_name,
                current_cpu_time,
                self.config.max_cpu_time
            );
            log::error!("{}", error_msg);
            return Err(SandboxError::CpuTimeExceeded {
                plugin_name: plugin_name.to_string(),
                current: current_cpu_time,
                limit: self.config.max_cpu_time,
            }.into());
        }

        if total_time > self.config.max_cpu_time {
            let error_msg = format!(
                "插件 {} 运行时间过长: {}ms / {}ms",
                plugin_name,
                total_time,
                self.config.max_cpu_time
            );
            log::error!("{}", error_msg);
            return Err(SandboxError::ExecutionTimeExceeded {
                plugin_name: plugin_name.to_string(),
                current: total_time,
                limit: self.config.max_cpu_time,
            }.into());
        }

        Ok(())
    }

    /// 检查系统调用是否允许
    pub fn check_syscall(&self, syscall: &str, plugin_name: &str) -> Result<()> {
        if !self.config.allowed_syscalls.contains(syscall) {
            let error_msg = format!(
                "插件 {} 尝试执行禁止的系统调用: {}",
                plugin_name, syscall
            );
            log::error!("{}", error_msg);
            return Err(SandboxError::SyscallNotAllowed {
                plugin_name: plugin_name.to_string(),
                syscall: syscall.to_string(),
            }.into());
        }

        Ok(())
    }

    /// 检查文件访问是否允许
    pub fn check_file_access(&self, file_path: &str, plugin_name: &str) -> Result<()> {
        for forbidden in &self.config.forbidden_files {
            if file_path.contains(forbidden) {
                let error_msg = format!(
                    "插件 {} 尝试访问禁止的文件: {}",
                    plugin_name, file_path
                );
                log::error!("{}", error_msg);
                return Err(SandboxError::FileAccessNotAllowed {
                    plugin_name: plugin_name.to_string(),
                    file_path: file_path.to_string(),
                }.into());
            }
        }

        Ok(())
    }

    /// 检查网络访问是否允许
    pub fn check_network_access(&self, address: &str, plugin_name: &str) -> Result<()> {
        for forbidden in &self.config.forbidden_networks {
            if address.contains(forbidden) {
                let error_msg = format!(
                    "插件 {} 尝试访问禁止的网络地址: {}",
                    plugin_name, address
                );
                log::error!("{}", error_msg);
                return Err(SandboxError::NetworkAccessNotAllowed {
                    plugin_name: plugin_name.to_string(),
                    address: address.to_string(),
                }.into());
            }
        }

        Ok(())
    }

    /// 模拟内存分配
    pub fn allocate_memory(&self, size: usize, plugin_name: &str) -> Result<()> {
        let new_memory = self.memory_usage.fetch_add(size, Ordering::SeqCst) + size;

        if new_memory > self.config.max_memory {
            // 回滚
            self.memory_usage.fetch_sub(size, Ordering::SeqCst);

            let error_msg = format!(
                "插件 {} 内存分配失败: {} / {}",
                plugin_name, new_memory, self.config.max_memory
            );
            log::error!("{}", error_msg);
            return Err(SandboxError::MemoryLimitExceeded {
                plugin_name: plugin_name.to_string(),
                current: new_memory,
                limit: self.config.max_memory,
            }.into());
        }

        log::debug!("插件 {} 分配内存: {} bytes (总计: {})",
            plugin_name, size, new_memory);

        Ok(())
    }

    /// 释放内存
    pub fn free_memory(&self, size: usize) {
        self.memory_usage.fetch_sub(size, Ordering::SeqCst);
    }

    /// 重置资源使用统计
    pub fn reset(&self) {
        self.memory_usage.store(0, Ordering::SeqCst);
        self.cpu_time.store(0, Ordering::SeqCst);
        self.operation_count.store(0, Ordering::SeqCst);
        log::debug!("沙箱资源统计已重置");
    }

    /// 获取资源使用统计
    pub fn get_stats(&self) -> SandboxStats {
        SandboxStats {
            memory_usage: self.memory_usage.load(Ordering::Relaxed),
            cpu_time: self.cpu_time.load(Ordering::Relaxed),
            operation_count: self.operation_count.load(Ordering::Relaxed),
            uptime: self.start_time.elapsed(),
        }
    }
}

/// 沙箱统计
#[derive(Debug, Clone)]
pub struct SandboxStats {
    pub memory_usage: usize,
    pub cpu_time: usize,
    pub operation_count: usize,
    pub uptime: Duration,
}

/// 沙箱错误
#[derive(Debug)]
pub enum SandboxError {
    MemoryLimitExceeded {
        plugin_name: String,
        current: usize,
        limit: usize,
    },
    CpuTimeExceeded {
        plugin_name: String,
        current: u64,
        limit: u64,
    },
    ExecutionTimeExceeded {
        plugin_name: String,
        current: u64,
        limit: u64,
    },
    SyscallNotAllowed {
        plugin_name: String,
        syscall: String,
    },
    FileAccessNotAllowed {
        plugin_name: String,
        file_path: String,
    },
    NetworkAccessNotAllowed {
        plugin_name: String,
        address: String,
    },
}

impl std::fmt::Display for SandboxError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SandboxError::MemoryLimitExceeded { plugin_name, current, limit } => {
                write!(f, "插件 {} 内存限制超出: {} / {}", plugin_name, current, limit)
            }
            SandboxError::CpuTimeExceeded { plugin_name, current, limit } => {
                write!(f, "插件 {} CPU 时间超出: {}ms / {}ms", plugin_name, current, limit)
            }
            SandboxError::ExecutionTimeExceeded { plugin_name, current, limit } => {
                write!(f, "插件 {} 执行时间过长: {}ms / {}ms", plugin_name, current, limit)
            }
            SandboxError::SyscallNotAllowed { plugin_name, syscall } => {
                write!(f, "插件 {} 系统调用不允许: {}", plugin_name, syscall)
            }
            SandboxError::FileAccessNotAllowed { plugin_name, file_path } => {
                write!(f, "插件 {} 文件访问不允许: {}", plugin_name, file_path)
            }
            SandboxError::NetworkAccessNotAllowed { plugin_name, address } => {
                write!(f, "插件 {} 网络访问不允许: {}", plugin_name, address)
            }
        }
    }
}

impl std::error::Error for SandboxError {}

/// 沙箱包装器
pub struct SandboxWrapper {
    sandbox: Arc<PluginSandbox>,
    plugin_name: String,
}

impl SandboxWrapper {
    pub fn new(sandbox: Arc<PluginSandbox>, plugin_name: String) -> Self {
        Self { sandbox, plugin_name }
    }

    /// 包装插件执行
    pub async fn execute_plugin<F, R>(&self, f: F) -> Result<R>
    where
        F: FnOnce() -> Result<R>,
    {
        self.sandbox.execute(&self.plugin_name, f).await
    }
}

/// 沙箱存储 - 管理每个插件的沙箱实例
pub struct SandboxStore {
    sandboxes: std::sync::RwLock<std::collections::HashMap<String, Arc<PluginSandbox>>>,
}

impl SandboxStore {
    pub fn new() -> Self {
        Self {
            sandboxes: std::sync::RwLock::new(std::collections::HashMap::new()),
        }
    }

    /// 获取或创建插件的沙箱
    pub fn get_or_create(&self, plugin_name: &str) -> Arc<PluginSandbox> {
        let mut sandboxes = self.sandboxes.write().unwrap();
        sandboxes.entry(plugin_name.to_string())
            .or_insert_with(|| Arc::new(PluginSandbox::default()))
            .clone()
    }

    /// 获取插件的沙箱统计
    pub fn get_stats(&self, plugin_name: &str) -> Option<SandboxStats> {
        let sandboxes = self.sandboxes.read().unwrap();
        sandboxes.get(plugin_name).map(|s| s.get_stats())
    }

    /// 重置插件的沙箱统计
    pub fn reset_stats(&self, plugin_name: &str) -> bool {
        let sandboxes = self.sandboxes.read().unwrap();
        match sandboxes.get(plugin_name) {
            Some(sandbox) => {
                sandbox.reset();
                true
            }
            None => false,
        }
    }
}

/// 全局沙箱存储实例
static SANDBOX_STORE: once_cell::sync::Lazy<Arc<SandboxStore>> =
    once_cell::sync::Lazy::new(|| Arc::new(SandboxStore::new()));

/// 获取全局沙箱存储
pub fn get_sandbox_store() -> Arc<SandboxStore> {
    SANDBOX_STORE.clone()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sandbox_config_default() {
        let config = SandboxConfig::default();
        assert_eq!(config.max_memory, 1024 * 1024 * 1024);
        assert_eq!(config.max_cpu_time, 30 * 1000);
        assert!(config.allowed_syscalls.contains("read"));
        assert!(config.allowed_syscalls.contains("write"));
    }

    #[test]
    fn test_sandbox_memory_limit() {
        let config = SandboxConfig {
            max_memory: 1024,  // 1KB
            ..Default::default()
        };
        let sandbox = PluginSandbox::new(config);

        // 正常分配
        assert!(sandbox.allocate_memory(512, "test").is_ok());

        // 超出限制
        assert!(sandbox.allocate_memory(1024, "test").is_err());

        // 释放后重新分配
        sandbox.free_memory(512);
        assert!(sandbox.allocate_memory(1024, "test").is_ok());
    }

    #[test]
    fn test_sandbox_syscall_check() {
        let sandbox = PluginSandbox::default();

        // 允许的系统调用
        assert!(sandbox.check_syscall("read", "test").is_ok());
        assert!(sandbox.check_syscall("write", "test").is_ok());

        // 禁止的系统调用
        assert!(sandbox.check_syscall("exec", "test").is_err());
        assert!(sandbox.check_syscall("fork", "test").is_err());
    }

    #[test]
    fn test_sandbox_stats() {
        let sandbox = PluginSandbox::default();
        sandbox.allocate_memory(1024, "test").unwrap();

        let stats = sandbox.get_stats();
        assert_eq!(stats.memory_usage, 1024);
        assert_eq!(stats.operation_count, 1);
    }

    #[test]
    fn test_sandbox_reset() {
        let sandbox = PluginSandbox::default();
        sandbox.allocate_memory(1024, "test").unwrap();

        sandbox.reset();

        let stats = sandbox.get_stats();
        assert_eq!(stats.memory_usage, 0);
        assert_eq!(stats.cpu_time, 0);
        assert_eq!(stats.operation_count, 0);
    }
}
