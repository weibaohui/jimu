//! Jimu 插件系统接口定义
//!
//! 这个包提供了宿主系统和插件之间共享的接口定义

use std::collections::HashMap;
use std::error::Error;
use std::sync::Arc;

// ===== 数据库服务接口 =====

/// 数据库服务接口
#[async_trait::async_trait]
pub trait DatabaseService: Send + Sync {
    /// 执行查询
    async fn query(&self, sql: &str, params: Vec<serde_json::Value>)
        -> std::result::Result<Vec<Row>, Box<dyn Error + Send + Sync>>;

    /// 执行更新
    async fn execute(&self, sql: &str, params: Vec<serde_json::Value>)
        -> std::result::Result<u64, Box<dyn Error + Send + Sync>>;
}

// ===== 消息总线接口 =====

/// 消息总线服务接口（简化版，暂时使用同步）
pub trait MessageBus: Send + Sync {
    /// 发布消息
    fn publish(&self, topic: &str, payload: &[u8])
        -> std::result::Result<(), Box<dyn Error + Send + Sync>>;

    /// 订阅消息
    fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send + Sync>)
        -> std::result::Result<String, Box<dyn Error + Send + Sync>>;

    /// 取消订阅
    fn unsubscribe(&self, subscription_id: &str)
        -> std::result::Result<(), Box<dyn Error + Send + Sync>>;
}

// ===== 插件接口 =====

/// 插件核心接口
#[async_trait::async_trait]
pub trait Plugin: Send + Sync {
    /// 插件名称
    fn name(&self) -> &str;

    /// 插件版本
    fn version(&self) -> &str;

    /// 插件描述
    fn description(&self) -> &str;

    /// 插件加载时的回调
    async fn on_load(&self, ctx: &PluginContext)
        -> std::result::Result<(), Box<dyn Error + Send + Sync>>;

    /// 插件卸载时的回调
    async fn on_unload(&self) -> std::result::Result<(), Box<dyn Error + Send + Sync>>;

    /// 插件启用时的回调（在 on_load 之后、状态变为 Enabled 之前调用）
    /// 默认实现为空操作
    async fn on_enable(&self) -> std::result::Result<(), Box<dyn Error + Send + Sync>> {
        Ok(())
    }

    /// 插件禁用时的回调（在 on_unload 之前、状态变为 Disabled 之前调用）
    /// 默认实现为空操作
    async fn on_disable(&self) -> std::result::Result<(), Box<dyn Error + Send + Sync>> {
        Ok(())
    }

    /// 执行插件业务逻辑
    async fn execute(&self, input: &str)
        -> std::result::Result<String, Box<dyn Error + Send + Sync>>;

    /// 获取插件 API 路由定义
    fn get_routes(&self) -> Vec<RouteDeclaration>;

    /// 获取前端资源清单
    fn get_frontend_manifest(&self) -> FrontendManifest;

    /// 获取菜单配置
    fn get_menu(&self) -> Option<MenuConfig>;
}

// ===== 插件上下文 =====

/// 插件上下文 - 主程序注入给插件的所有服务
#[derive(Clone)]
pub struct PluginContext {
    pub db: Arc<dyn DatabaseService>,
    pub msgbus: Arc<dyn MessageBus>,
    pub config: Arc<Config>,
}

// ===== 配置 =====

/// 配置
#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub plugins_dir: String,
    pub log_level: String,
}

// ===== 路由相关 =====

/// 路由声明
#[derive(Clone)]
pub struct RouteDeclaration {
    pub path: String,
    pub method: Method,
    pub handler: RouteHandler,
}

/// 路由处理器类型
pub type RouteHandler = Arc<dyn Fn(PluginRequest) -> PluginResult + Send + Sync>;

/// 插件请求
pub struct PluginRequest {
    pub method: Method,
    pub path: String,
    pub headers: HashMap<String, String>,
    pub body: Option<Vec<u8>>,
}

/// 插件响应
pub struct PluginResponse {
    pub status: u16,
    pub headers: HashMap<String, String>,
    pub body: Vec<u8>,
}

/// 插件执行结果
pub type PluginResult = std::result::Result<PluginResponse, Box<dyn Error + Send + Sync>>;

/// HTTP 方法
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Method {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
}

impl From<&str> for Method {
    fn from(s: &str) -> Self {
        match s.to_uppercase().as_str() {
            "GET" => Method::GET,
            "POST" => Method::POST,
            "PUT" => Method::PUT,
            "DELETE" => Method::DELETE,
            "PATCH" => Method::PATCH,
            _ => panic!("不支持的 HTTP 方法: {}", s),
        }
    }
}

// ===== 前端相关 =====

/// 前端资源清单
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct FrontendManifest {
    pub entry: String,
    pub style: Option<String>,
    pub chunks: Vec<String>,
    pub assets: Vec<String>,
}

/// 菜单配置
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct MenuConfig {
    pub title: String,
    pub icon: String,
    pub path: String,
    pub order: Option<i32>,
    pub children: Option<Vec<MenuConfig>>,
}

// ===== 数据库相关 =====

/// 数据库行
#[derive(Debug, Clone, serde::Serialize)]
pub struct Row {
    pub columns: HashMap<String, serde_json::Value>,
}

impl Row {
    pub fn new() -> Self {
        Self {
            columns: HashMap::new(),
        }
    }

    pub fn set(&mut self, column: &str, value: serde_json::Value) {
        self.columns.insert(column.to_string(), value);
    }

    pub fn get(&self, column: &str) -> Option<&serde_json::Value> {
        self.columns.get(column)
    }
}

// ===== 错误类型 =====

/// 插件错误
#[derive(Debug)]
pub enum PluginError {
    /// 插件加载失败
    LoadFailed(String),
    /// 插件卸载失败
    UnloadFailed(String),
    /// 插件执行失败
    ExecutionFailed(String),
    /// 数据库错误
    Database(String),
    /// 网络错误
    Network(String),
    /// 其他错误
    Other(String),
}

impl std::fmt::Display for PluginError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PluginError::LoadFailed(msg) => write!(f, "插件加载失败: {}", msg),
            PluginError::UnloadFailed(msg) => write!(f, "插件卸载失败: {}", msg),
            PluginError::ExecutionFailed(msg) => write!(f, "插件执行失败: {}", msg),
            PluginError::Database(msg) => write!(f, "数据库错误: {}", msg),
            PluginError::Network(msg) => write!(f, "网络错误: {}", msg),
            PluginError::Other(msg) => write!(f, "错误: {}", msg),
        }
    }
}

impl std::error::Error for PluginError {}

// ===== 辅助宏 =====

/// 简化的异步结果类型
pub type AsyncResult<T> = std::result::Result<T, Box<dyn Error + Send + Sync>>;
