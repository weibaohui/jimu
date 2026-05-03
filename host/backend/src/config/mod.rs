//! 配置管理

use anyhow::Result;
use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub server_address: String,
    pub database_url: String,
    pub plugins_dir: String,
    pub log_level: String,
}

impl Config {
    /// 加载配置
    pub async fn load() -> Result<Self> {
        // 从环境变量加载
        // 优先使用 SERVER_ADDRESS（兼容旧配置）
        // 其次使用 PORT + HOST（portless 标准约定）
        // 最后默认 0.0.0.0:3000
        let server_address = std::env::var("SERVER_ADDRESS")
            .unwrap_or_else(|_| {
                let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
                let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
                format!("{}:{}", host, port)
            });

        let database_url = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "sqlite:./host.db".to_string());

        let plugins_dir = std::env::var("PLUGINS_DIR")
            .unwrap_or_else(|_| "./plugins".to_string());

        let log_level = std::env::var("LOG_LEVEL")
            .unwrap_or_else(|_| "info".to_string());

        Ok(Self {
            server_address,
            database_url,
            plugins_dir,
            log_level,
        })
    }
}
