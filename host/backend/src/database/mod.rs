//! 数据库服务

use jimu_plugin_interface::{DatabaseService, Row};
use anyhow::Result;
use serde_json::Value;
use sqlx::AnyPool;
use std::sync::Arc;

/// 数据库类型
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DatabaseType {
    Sqlite,
    Postgres,
    MySql,
}

impl DatabaseType {
    pub fn from_url(url: &str) -> Result<Self> {
        if url.starts_with("sqlite") {
            Ok(DatabaseType::Sqlite)
        } else if url.starts_with("postgresql") || url.starts_with("postgres") {
            Ok(DatabaseType::Postgres)
        } else if url.starts_with("mysql") {
            Ok(DatabaseType::MySql)
        } else {
            anyhow::bail!("不支持的数据库类型: {}", url);
        }
    }
}

/// 数据库连接池
pub struct Database {
    pool: AnyPool,
    db_type: DatabaseType,
}

impl Database {
    /// 创建数据库连接池
    pub async fn new(database_url: &str) -> Result<Self> {
        let db_type = DatabaseType::from_url(database_url)?;

        // 注册默认数据库驱动
        sqlx::any::install_default_drivers();

        // SQLite URL 格式处理
        let url = if db_type == DatabaseType::Sqlite {
            Self::normalize_sqlite_url(database_url)?
        } else {
            database_url.to_string()
        };

        // 对于 SQLite，使用单连接以确保 DDL 一致性
        let pool = if db_type == DatabaseType::Sqlite {
            use sqlx::any::AnyPoolOptions;
            AnyPoolOptions::new()
                .max_connections(1)
                .connect(&url)
                .await?
        } else {
            AnyPool::connect(&url).await?
        };

        log::info!("数据库连接成功: {} ({:?})", url, db_type);
        Ok(Self { pool, db_type })
    }

    /// 标准化 SQLite URL
    fn normalize_sqlite_url(url: &str) -> Result<String> {
        // 内存数据库
        if url == "sqlite::memory:" {
            return Ok(url.to_string());
        }

        // 提取路径部分（去掉 sqlite: 或 sqlite:// 或 sqlite:///）
        let path = if url.starts_with("sqlite:///") {
            &url[10..] // 去掉 "sqlite:///"
        } else if url.starts_with("sqlite://") {
            &url[9..] // 去掉 "sqlite://"
        } else if url.starts_with("sqlite:") {
            &url[7..] // 去掉 "sqlite:"
        } else {
            url
        };

        // 转换为绝对路径
        let abs_path = if path.starts_with('/') {
            path.to_string()
        } else {
            let base = std::env::current_dir()?;
            base.join(path).to_string_lossy().to_string()
        };

        // 添加 mode=rwc 参数（创建数据库文件）
        // sqlite:///path 格式，路径以 / 开头时只用两个斜杠
        let normalized = if abs_path.contains('?') {
            format!("sqlite://{}", abs_path)
        } else {
            format!("sqlite://{}?mode=rwc", abs_path)
        };

        Ok(normalized)
    }

    /// 执行 SQL 并返回结果
    async fn execute_sql(&self, sql: &str, _params: Vec<Value>) -> Result<Vec<Row>> {
        log::debug!("执行 SQL: {}", sql);

        let rows = sqlx::query(sql)
            .fetch_all(&self.pool)
            .await?;

        Ok(rows.into_iter().map(|_row| {
            let result_row = Row::new();
            // TODO: 实现列映射（需要通过 AnyRow 获取列信息）
            result_row
        }).collect())
    }
}

#[async_trait::async_trait]
impl DatabaseService for Database {
    async fn query(&self, sql: &str, params: Vec<Value>)
        -> std::result::Result<Vec<Row>, Box<dyn std::error::Error + Send + Sync>>
    {
        log::info!("执行查询: {}", sql);

        if !params.is_empty() {
            log::warn!("参数化查询暂未实现，使用字符串替换");
        }

        self.execute_sql(sql, params)
            .await
            .map_err(|e| -> Box<dyn std::error::Error + Send + Sync> {
                Box::new(jimu_plugin_interface::PluginError::Database(e.to_string()))
            })
    }

    async fn execute(&self, sql: &str, params: Vec<Value>)
        -> std::result::Result<u64, Box<dyn std::error::Error + Send + Sync>>
    {
        log::info!("执行更新: {}", sql);

        if !params.is_empty() {
            log::warn!("参数化查询暂未实现，使用字符串替换");
        }

        let result = sqlx::query(sql)
            .execute(&self.pool)
            .await
            .map_err(|e| -> Box<dyn std::error::Error + Send + Sync> {
                Box::new(jimu_plugin_interface::PluginError::Database(e.to_string()))
            })?;

        Ok(result.rows_affected())
    }
}

/// 数据库工具函数
pub mod utils {
    use super::*;

    /// 初始化数据库表
    pub async fn init_tables(db: &Database) -> Result<()> {
        log::info!("初始化数据库表");

        // 创建用户表示例
        let create_users_table = r#"
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                role TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        "#;

        db.execute(create_users_table, vec![]).await
            .map_err(|e| anyhow::anyhow!("创建用户表失败: {}", e))?;

        // 插入示例数据
        let insert_sample = r#"
            INSERT OR IGNORE INTO users (name, email, role, created_at, updated_at)
            VALUES
                ('张三', 'zhangsan@example.com', '管理员', datetime('now'), datetime('now')),
                ('李四', 'lisi@example.com', '用户', datetime('now'), datetime('now'))
        "#;

        db.execute(insert_sample, vec![]).await
            .map_err(|e| anyhow::anyhow!("插入示例数据失败: {}", e))?;

        log::info!("数据库表初始化完成");
        Ok(())
    }
}

/// 根据配置创建数据库连接池
pub async fn create_pool(config: &crate::config::Config) -> Result<Arc<dyn DatabaseService>> {
    let db = Database::new(&config.database_url).await?;

    // 初始化数据库表
    utils::init_tables(&db).await?;

    Ok(Arc::new(db))
}

/// 数据库健康检查
pub async fn health_check(db: &Arc<dyn DatabaseService>) -> Result<serde_json::Value> {
    let result = db.query("SELECT 1 as status", vec![]).await
        .map_err(|e| anyhow::anyhow!("{}", e))?;
    Ok(serde_json::json!({
        "status": "healthy",
        "database_connected": !result.is_empty(),
    }))
}
