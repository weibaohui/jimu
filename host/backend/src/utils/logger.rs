//! 增强的日志模块

use std::sync::Arc;
use std::time::Instant;
use chrono::{DateTime, Utc};

/// 日志级别
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
}

impl LogLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Trace => "TRACE",
            LogLevel::Debug => "DEBUG",
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
        }
    }
}

/// 日志上下文
#[derive(Debug, Clone)]
pub struct LogContext {
    pub request_id: Option<String>,
    pub user_id: Option<String>,
    pub plugin_name: Option<String>,
    pub extra: Vec<(String, String)>,
}

impl LogContext {
    pub fn new() -> Self {
        Self {
            request_id: None,
            user_id: None,
            plugin_name: None,
            extra: vec![],
        }
    }

    pub fn with_request_id(mut self, request_id: String) -> Self {
        self.request_id = Some(request_id);
        self
    }

    pub fn with_user_id(mut self, user_id: String) -> Self {
        self.user_id = Some(user_id);
        self
    }

    pub fn with_plugin_name(mut self, plugin_name: String) -> Self {
        self.plugin_name = Some(plugin_name);
        self
    }

    pub fn with_extra(mut self, key: String, value: String) -> Self {
        self.extra.push((key, value));
        self
    }
}

/// 日志条目
#[derive(Debug, Clone)]
pub struct LogEntry {
    pub timestamp: DateTime<Utc>,
    pub level: LogLevel,
    pub message: String,
    pub context: LogContext,
    pub error: Option<String>,
    pub duration_ms: Option<u64>,
}

impl LogEntry {
    pub fn new(level: LogLevel, message: &str, context: LogContext) -> Self {
        Self {
            timestamp: Utc::now(),
            level,
            message: message.to_string(),
            context,
            error: None,
            duration_ms: None,
        }
    }

    pub fn with_error(mut self, error: &str) -> Self {
        self.error = Some(error.to_string());
        self
    }

    pub fn with_duration(mut self, duration_ms: u64) -> Self {
        self.duration_ms = Some(duration_ms);
        self
    }

    pub fn format(&self) -> String {
        let timestamp = self.timestamp.format("%Y-%m-%d %H:%M:%S%.3f");
        let level = self.level.as_str();
        let context = self.format_context();
        let error_msg = if let Some(err) = &self.error {
            format!(" | 错误: {}", err)
        } else {
            String::new()
        };
        let duration_msg = if let Some(duration) = self.duration_ms {
            format!(" | 耗时: {}ms", duration)
        } else {
            String::new()
        };

        format!("[{} {}] {}{}{}{}", timestamp, level, self.message, context, error_msg, duration_msg)
    }

    fn format_context(&self) -> String {
        let mut parts = Vec::new();

        if let Some(request_id) = &self.context.request_id {
            parts.push(format!("request_id={}", request_id));
        }

        if let Some(user_id) = &self.context.user_id {
            parts.push(format!("user_id={}", user_id));
        }

        if let Some(plugin_name) = &self.context.plugin_name {
            parts.push(format!("plugin={}", plugin_name));
        }

        for (key, value) in &self.context.extra {
            parts.push(format!("{}={}", key, value));
        }

        if parts.is_empty() {
            String::new()
        } else {
            format!(" | {}", parts.join(", "))
        }
    }
}

/// 日志记录器
pub struct Logger {
    level: LogLevel,
}

impl Logger {
    pub fn new(level: LogLevel) -> Self {
        Self { level }
    }

    pub fn log(&self, level: LogLevel, message: &str, context: LogContext) {
        if level >= self.level {
            let entry = LogEntry::new(level, message, context);
            println!("{}", entry.format());
        }
    }

    pub fn trace(&self, message: &str, context: LogContext) {
        self.log(LogLevel::Trace, message, context);
    }

    pub fn debug(&self, message: &str, context: LogContext) {
        self.log(LogLevel::Debug, message, context);
    }

    pub fn info(&self, message: &str, context: LogContext) {
        self.log(LogLevel::Info, message, context);
    }

    pub fn warn(&self, message: &str, context: LogContext) {
        self.log(LogLevel::Warn, message, context);
    }

    pub fn error(&self, message: &str, error: &str, context: LogContext) {
        let entry = LogEntry::new(LogLevel::Error, message, context).with_error(error);
        println!("{}", entry.format());
    }
}

/// 请求日志记录器
pub struct RequestLogger {
    logger: Arc<Logger>,
}

impl RequestLogger {
    pub fn new(logger: Arc<Logger>) -> Self {
        Self { logger }
    }

    pub fn log_request(&self, method: &str, path: &str, request_id: &str) {
        let context = LogContext::new()
            .with_request_id(request_id.to_string())
            .with_extra("method".to_string(), method.to_string())
            .with_extra("path".to_string(), path.to_string());

        self.logger.info(&format!("请求: {} {}", method, path), context);
    }

    pub fn log_response(&self, request_id: &str, status: u16, duration_ms: u64) {
        let context = LogContext::new()
            .with_request_id(request_id.to_string());

        let message = format!("响应: HTTP {} ({}ms)", status, duration_ms);
        let mut entry = LogEntry::new(LogLevel::Info, &message, context);
        entry.duration_ms = Some(duration_ms);

        println!("{}", entry.format());
    }

    pub fn log_error(&self, request_id: &str, error: &str, duration_ms: Option<u64>) {
        let context = LogContext::new()
            .with_request_id(request_id.to_string());

        let mut entry = LogEntry::new(LogLevel::Error, "请求处理错误", context)
            .with_error(error);

        if let Some(duration) = duration_ms {
            entry.duration_ms = Some(duration);
        }

        println!("{}", entry.format());
    }
}

/// 插件日志记录器
pub struct PluginLogger {
    logger: Arc<Logger>,
}

impl PluginLogger {
    pub fn new(logger: Arc<Logger>) -> Self {
        Self { logger }
    }

    pub fn log_plugin_load(&self, plugin_name: &str, version: &str) {
        let context = LogContext::new()
            .with_plugin_name(plugin_name.to_string());

        self.logger.info(&format!("插件加载: {} (版本 {})", plugin_name, version), context);
    }

    pub fn log_plugin_unload(&self, plugin_name: &str) {
        let context = LogContext::new()
            .with_plugin_name(plugin_name.to_string());

        self.logger.info(&format!("插件卸载: {}", plugin_name), context);
    }

    pub fn log_plugin_error(&self, plugin_name: &str, error: &str) {
        let context = LogContext::new()
            .with_plugin_name(plugin_name.to_string());

        self.logger.error("插件执行错误", error, context);
    }

    pub fn log_plugin_reload(&self, plugin_name: &str, duration_ms: u64) {
        let context = LogContext::new()
            .with_plugin_name(plugin_name.to_string());

        let mut entry = LogEntry::new(LogLevel::Info, "插件重新加载", context);
        entry.duration_ms = Some(duration_ms);

        println!("{}", entry.format());
    }
}

/// 性能日志记录器
pub struct PerformanceLogger {
    logger: Arc<Logger>,
}

impl PerformanceLogger {
    pub fn new(logger: Arc<Logger>) -> Self {
        Self { logger }
    }

    pub fn measure<F, R>(&self, name: &str, context: LogContext, f: F) -> R
    where
        F: FnOnce() -> R,
    {
        let start = Instant::now();
        let result = f();
        let duration = start.elapsed().as_millis() as u64;

        let mut entry = LogEntry::new(LogLevel::Debug, name, context);
        entry.duration_ms = Some(duration);

        println!("{}", entry.format());
        result
    }
}

/// 初始化日志系统
pub fn init_logger(level: &str) {
    let _log_level = match level.to_uppercase().as_str() {
        "TRACE" => LogLevel::Trace,
        "DEBUG" => LogLevel::Debug,
        "INFO" => LogLevel::Info,
        "WARN" => LogLevel::Warn,
        "ERROR" => LogLevel::Error,
        _ => LogLevel::Info,
    };

    // 初始化 env_logger
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or(level))
        .format_timestamp_millis()
        .init();

    log::info!("日志系统初始化完成，级别: {}", level);
}

/// 创建全局日志记录器
pub fn create_logger(level: &str) -> Arc<Logger> {
    let log_level = match level.to_uppercase().as_str() {
        "TRACE" => LogLevel::Trace,
        "DEBUG" => LogLevel::Debug,
        "INFO" => LogLevel::Info,
        "WARN" => LogLevel::Warn,
        "ERROR" => LogLevel::Error,
        _ => LogLevel::Info,
    };

    Arc::new(Logger::new(log_level))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_log_entry_format() {
        let context = LogContext::new()
            .with_request_id("123".to_string())
            .with_user_id("user1".to_string());

        let entry = LogEntry::new(LogLevel::Info, "测试消息", context)
            .with_error("测试错误")
            .with_duration(123);

        let formatted = entry.format();
        assert!(formatted.contains("INFO"));
        assert!(formatted.contains("测试消息"));
        assert!(formatted.contains("request_id=123"));
        assert!(formatted.contains("user_id=user1"));
        assert!(formatted.contains("测试错误"));
        assert!(formatted.contains("123ms"));
    }
}
