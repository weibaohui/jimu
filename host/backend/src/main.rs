use std::sync::Arc;
use tokio::net::TcpListener;
use tower_http::cors::{CorsLayer, Any};

mod plugin;
mod message_bus;
mod database;
mod api;
mod config;
mod utils;

use plugin::PluginManager;
use message_bus::MessageBus;
use config::Config;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 加载配置
    let config = Config::load().await?;

    // 初始化日志
    utils::init_logger(&config.log_level);

    log::info!("宿主系统启动中...");
    log::info!("配置: {:?}", config);

    // 创建消息总线
    let msgbus = Arc::new(MessageBus::new());

    // 创建数据库连接池（根据配置选择数据库类型）
    let db = database::create_pool(&config).await?;

    // 创建插件上下文
    let plugin_context = jimu_plugin_interface::PluginContext {
        db: db.clone(),
        msgbus: msgbus.clone(),
        config: Arc::new(jimu_plugin_interface::Config {
            database_url: config.database_url.clone(),
            plugins_dir: config.plugins_dir.clone(),
            log_level: config.log_level.clone(),
        }),
    };

    // 创建插件管理器
    let plugin_manager = Arc::new(PluginManager::new(plugin_context));

    // 加载插件
    plugin_manager.load_from_directory(&config.plugins_dir).await?;

    // 构建路由
    let server_address = config.server_address.clone();
    let app = api::create_routes(plugin_manager, db, Arc::new(config)).await?;

    // 添加 CORS 中间件
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = app.layer(cors);

    // 启动服务器
    let listener = TcpListener::bind(&server_address).await?;
    log::info!("服务器启动，监听: {}", server_address);

    axum::serve(listener, app).await?;

    Ok(())
}
