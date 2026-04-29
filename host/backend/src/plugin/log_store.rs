//! 插件日志收集系统

use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use chrono::{DateTime, Utc};
use serde::Serialize;

/// 日志级别
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub enum PluginLogLevel {
    Debug,
    Info,
    Warn,
    Error,
}

impl PluginLogLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            PluginLogLevel::Debug => "DEBUG",
            PluginLogLevel::Info => "INFO",
            PluginLogLevel::Warn => "WARN",
            PluginLogLevel::Error => "ERROR",
        }
    }
}

/// 插件日志条目
#[derive(Debug, Clone, Serialize)]
pub struct PluginLogEntry {
    pub timestamp: DateTime<Utc>,
    pub level: PluginLogLevel,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
}

/// 插件日志存储
pub struct PluginLogStore {
    /// 每个插件的日志缓冲区
    logs: Arc<RwLock<HashMap<String, Vec<PluginLogEntry>>>>,
    /// 每个插件的最大日志条数
    max_entries_per_plugin: usize,
}

impl PluginLogStore {
    pub fn new(max_entries_per_plugin: usize) -> Self {
        Self {
            logs: Arc::new(RwLock::new(HashMap::new())),
            max_entries_per_plugin,
        }
    }

    /// 添加日志条目
    pub fn add_log(&self, plugin_name: &str, level: PluginLogLevel, message: &str) {
        let entry = PluginLogEntry {
            timestamp: Utc::now(),
            level,
            message: message.to_string(),
            source: None,
        };

        let mut logs = self.logs.write().unwrap();
        let plugin_logs = logs.entry(plugin_name.to_string()).or_insert_with(Vec::new);

        // 超过最大条数时移除最旧的日志
        if plugin_logs.len() >= self.max_entries_per_plugin {
            plugin_logs.remove(0);
        }

        plugin_logs.push(entry);
    }

    /// 添加带来源的日志条目
    pub fn add_log_with_source(
        &self,
        plugin_name: &str,
        level: PluginLogLevel,
        message: &str,
        source: &str,
    ) {
        let entry = PluginLogEntry {
            timestamp: Utc::now(),
            level,
            message: message.to_string(),
            source: Some(source.to_string()),
        };

        let mut logs = self.logs.write().unwrap();
        let plugin_logs = logs.entry(plugin_name.to_string()).or_insert_with(Vec::new);

        if plugin_logs.len() >= self.max_entries_per_plugin {
            plugin_logs.remove(0);
        }

        plugin_logs.push(entry);
    }

    /// 获取插件的日志
    pub fn get_logs(&self, plugin_name: &str) -> Vec<PluginLogEntry> {
        let logs = self.logs.read().unwrap();
        logs.get(plugin_name).cloned().unwrap_or_default()
    }

    /// 获取插件的最近 N 条日志
    pub fn get_recent_logs(&self, plugin_name: &str, count: usize) -> Vec<PluginLogEntry> {
        let logs = self.logs.read().unwrap();
        match logs.get(plugin_name) {
            Some(entries) => {
                let start = if entries.len() > count {
                    entries.len() - count
                } else {
                    0
                };
                entries[start..].to_vec()
            }
            None => Vec::new(),
        }
    }

    /// 清空插件的日志
    pub fn clear_logs(&self, plugin_name: &str) {
        let mut logs = self.logs.write().unwrap();
        logs.remove(plugin_name);
    }

    /// 获取所有插件的日志数量
    pub fn get_log_counts(&self) -> HashMap<String, usize> {
        let logs = self.logs.read().unwrap();
        logs.iter().map(|(k, v)| (k.clone(), v.len())).collect()
    }
}

/// 全局插件日志存储实例
static PLUGIN_LOG_STORE: once_cell::sync::Lazy<Arc<PluginLogStore>> =
    once_cell::sync::Lazy::new(|| Arc::new(PluginLogStore::new(1000)));

/// 获取全局插件日志存储
pub fn get_log_store() -> Arc<PluginLogStore> {
    PLUGIN_LOG_STORE.clone()
}
