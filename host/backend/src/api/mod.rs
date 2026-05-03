//! API 路由

use axum::{
    Router,
    routing::{get, post, delete, any},
    response::{Json, Response},
    extract::{Path, State, Multipart},
    http::{StatusCode, HeaderMap, Method},
};
use std::sync::Arc;
use std::collections::HashMap;
use std::path::PathBuf;
use anyhow::Result;
use crate::plugin::{PluginManager, traits::*};

/// 创建 API 路由
pub async fn create_routes(
    plugin_manager: Arc<PluginManager>,
    db: Arc<dyn crate::plugin::traits::DatabaseService>,
    config: Arc<crate::config::Config>,
) -> Result<Router> {
    let state = AppState {
        plugin_manager: plugin_manager.clone(),
        db,
        config,
    };

    let app = Router::new()
        // 基础路由
        .route("/health", get(health_check))
        // 插件管理
        .route("/api/plugins", get(list_plugins))
        .route("/api/plugins/:name", get(get_plugin_detail))
        .route("/api/plugins", post(upload_plugin))
        .route("/api/plugins/:name", delete(unload_plugin))
        .route("/api/plugins/:name/reload", post(reload_plugin))
        .route("/api/plugins/:name/enable", post(enable_plugin))
        .route("/api/plugins/:name/disable", post(disable_plugin))
        .route("/api/plugins/:name/start", post(start_plugin))
        .route("/api/plugins/:name/stop", post(stop_plugin))
        .route("/api/plugins/:name/uninstall", post(uninstall_plugin))
        // 插件日志
        .route("/api/plugins/:name/logs", get(get_plugin_logs))
        .route("/api/plugins/:name/logs", delete(clear_plugin_logs))
        // 沙箱
        .route("/api/plugins/:name/sandbox", get(get_sandbox_stats))
        .route("/api/plugins/:name/sandbox/reset", post(reset_sandbox_stats))
        // 菜单
        .route("/api/plugins/menus", get(list_menus))
        .route("/api/plugins/check-route", post(check_route))
        // 插件前端资源
        .route("/plugins/:name/frontend/*path", get(serve_frontend_asset))
        // 插件 API 路由（通用处理器）
        .route("/api/plugins/:plugin_name/*path", any(handle_plugin_request))
        .with_state(state);

    Ok(app)
}

/// 应用状态
#[derive(Clone)]
struct AppState {
    plugin_manager: Arc<PluginManager>,
    db: Arc<dyn DatabaseService>,
    config: Arc<crate::config::Config>,
}

/// 健康检查
async fn health_check(State(state): State<AppState>) -> Json<serde_json::Value> {
    let db_status = match crate::database::health_check(&state.db).await {
        Ok(status) => status,
        Err(e) => {
            log::error!("数据库健康检查失败: {:?}", e);
            serde_json::json!({
                "status": "unhealthy",
                "database_connected": false,
                "error": e.to_string(),
            })
        }
    };

    Json(serde_json::json!({
        "status": "ok",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "database": db_status,
    }))
}

/// 列出所有插件
async fn list_plugins(State(state): State<AppState>) -> Json<serde_json::Value> {
    let plugins = state.plugin_manager.get_plugin_infos();
    Json(serde_json::json!({
        "plugins": plugins,
    }))
}

/// 获取插件详情
async fn get_plugin_detail(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    match state.plugin_manager.get_plugin_detail(&name) {
        Some(detail) => Ok(Json(serde_json::json!(detail))),
        None => Err((StatusCode::NOT_FOUND, format!("Plugin '{}' not found", name))),
    }
}

/// 上传插件（支持 multipart 文件上传和 JSON body）
async fn upload_plugin(
    State(state): State<AppState>,
    multipart: Multipart,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let package_path = process_upload(multipart).await.map_err(|e| {
        (StatusCode::BAD_REQUEST, e)
    })?;

    match state.plugin_manager.load_from_package(&package_path.to_string_lossy()).await {
        Ok(_) => {
            log::info!("插件包加载成功: {:?}", package_path);
            Ok(Json(serde_json::json!({
                "success": true,
                "message": "Plugin loaded successfully",
            })))
        }
        Err(e) => {
            log::error!("插件包加载失败: {:?}", e);
            Ok(Json(serde_json::json!({
                "success": false,
                "message": e.to_string(),
            })))
        }
    }
}

/// 处理上传：支持 multipart 文件字段和 JSON 字段（向后兼容）
async fn process_upload(mut multipart: Multipart) -> Result<PathBuf, String> {
    let temp_dir = std::env::temp_dir();

    while let Some(field) = multipart.next_field().await.map_err(|e| e.to_string())? {
        let name = field.name().unwrap_or("").to_string();
        match name.as_str() {
            "file" => {
                // 文件上传 — 保存到临时目录
                let file_name = field.file_name().unwrap_or("plugin.plugin").to_string();
                let content = field.bytes().await.map_err(|e| e.to_string())?;
                let dest = temp_dir.join(&file_name);
                tokio::fs::write(&dest, &content).await.map_err(|e| e.to_string())?;
                return Ok(dest);
            }
            "path" => {
                let path_str = field.text().await.map_err(|e| e.to_string())?;
                let path = PathBuf::from(&path_str);
                if path.exists() {
                    return Ok(path);
                }
                return Err(format!("路径不存在: {}", path_str));
            }
            "data" => {
                // Base64 数据 — 解码并保存
                let data = field.text().await.map_err(|e| e.to_string())?;
                return base64_decode_and_save(&data).map_err(|e| e.to_string());
            }
            _ => {
                // 未知字段，跳过
                continue;
            }
        }
    }

    Err("Invalid request: missing 'file', 'path', or 'data' field".to_string())
}

/// 解码 Base64 并保存文件
fn base64_decode_and_save(data: &str) -> Result<PathBuf, Box<dyn std::error::Error>> {
    use base64::{Engine as _, engine::general_purpose::STANDARD};

    let decoded = STANDARD.decode(data)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;

    let temp_dir = std::env::temp_dir();
    let filename = format!("jimu-plugin-{}.plugin", uuid::Uuid::new_v4());
    let file_path = temp_dir.join(&filename);

    std::fs::write(&file_path, decoded)?;

    Ok(file_path)
}

/// 卸载插件
async fn unload_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    match state.plugin_manager.unload_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} unloaded successfully", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 重新加载插件（热更新）
async fn reload_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    log::info!("收到重新加载插件请求: {}", name);

    match state.plugin_manager.reload_plugin(&name).await {
        Ok(_) => {
            log::info!("插件 '{}' 重新加载成功", name);
            Json(serde_json::json!({
                "success": true,
                "message": format!("Plugin {} reloaded successfully", name),
            }))
        }
        Err(e) => {
            log::error!("插件 '{}' 重新加载失败: {:?}", name, e);
            Json(serde_json::json!({
                "success": false,
                "message": e.to_string(),
            }))
        }
    }
}

/// 启用插件
async fn enable_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    match state.plugin_manager.enable_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} enabled", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 禁用插件
async fn disable_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    match state.plugin_manager.disable_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} disabled", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 启动插件
async fn start_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    // 当前实现：插件加载即运行
    match state.plugin_manager.enable_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} started", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 停止插件
async fn stop_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    match state.plugin_manager.disable_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} stopped", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 卸载插件（别名）
async fn uninstall_plugin(
    State(state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    match state.plugin_manager.unload_plugin(&name).await {
        Ok(_) => Json(serde_json::json!({
            "success": true,
            "message": format!("Plugin {} uninstalled", name),
        })),
        Err(e) => Json(serde_json::json!({
            "success": false,
            "message": e.to_string(),
        })),
    }
}

/// 获取插件日志
async fn get_plugin_logs(
    State(_state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    let log_store = crate::plugin::log_store::get_log_store();
    let logs = log_store.get_logs(&name);
    Json(serde_json::json!({
        "logs": logs,
    }))
}

/// 清空插件日志
async fn clear_plugin_logs(
    State(_state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    let log_store = crate::plugin::log_store::get_log_store();
    log_store.clear_logs(&name);
    Json(serde_json::json!({
        "success": true,
        "message": "Logs cleared",
    }))
}

/// 获取沙箱统计
async fn get_sandbox_stats(
    State(_state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    let sandbox_store = crate::plugin::sandbox::get_sandbox_store();
    match sandbox_store.get_stats(&name) {
        Some(stats) => Json(serde_json::json!({
            "memory_usage": stats.memory_usage,
            "memory_limit": 1073741824u64,
            "cpu_time": stats.cpu_time,
            "cpu_limit": 30000,
            "operation_count": stats.operation_count,
            "uptime_ms": stats.uptime.as_millis(),
        })),
        None => Json(serde_json::json!({
            "memory_usage": 0,
            "memory_limit": 1073741824u64,
            "cpu_time": 0,
            "cpu_limit": 30000,
            "operation_count": 0,
            "uptime_ms": 0,
        })),
    }
}

/// 重置沙箱统计
async fn reset_sandbox_stats(
    State(_state): State<AppState>,
    Path(name): Path<String>,
) -> Json<serde_json::Value> {
    let sandbox_store = crate::plugin::sandbox::get_sandbox_store();
    if sandbox_store.reset_stats(&name) {
        Json(serde_json::json!({
            "success": true,
            "message": "Sandbox stats reset",
        }))
    } else {
        Json(serde_json::json!({
            "success": true,
            "message": "No sandbox found for plugin, nothing to reset",
        }))
    }
}

/// 列出所有菜单
async fn list_menus(State(state): State<AppState>) -> Json<serde_json::Value> {
    let plugins = state.plugin_manager.get_all_plugins();
    let menus: Vec<Option<MenuConfig>> = plugins.iter()
        .map(|p| p.plugin.get_menu())
        .collect();

    Json(serde_json::json!({
        "menus": menus,
    }))
}

/// 提供前端静态资源
async fn serve_frontend_asset(
    State(state): State<AppState>,
    Path((name, path)): Path<(String, String)>,
) -> Result<Response, (StatusCode, String)> {
    if let Some(plugin) = state.plugin_manager.get_plugin(&name) {
        let asset_path = plugin.plugin_dir.join("frontend").join(&path);

        if asset_path.exists() {
            let content = std::fs::read(&asset_path)
                .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

            let content_type = mime_guess::from_path(&path)
                .first_or_octet_stream()
                .to_string();

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", content_type)
                .body(axum::body::Body::from(content))
                .unwrap())
        } else {
            Err((StatusCode::NOT_FOUND, "Asset not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Plugin not found".to_string()))
    }
}

/// 检查路由属于哪个插件
async fn check_route(
    State(state): State<AppState>,
    Json(body): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    if let Some(path) = body.get("path").and_then(|p| p.as_str()) {
        for plugin in state.plugin_manager.get_all_plugins() {
            if let Some(menu) = plugin.plugin.get_menu() {
                if path.starts_with(&menu.path) {
                    return Json(serde_json::json!({
                        "pluginName": plugin.name,
                    }));
                }
            }
        }
    }

    Json(serde_json::json!({
        "pluginName": null,
    }))
}

/// 处理插件 API 请求
async fn handle_plugin_request(
    State(state): State<AppState>,
    Path((plugin_name, path)): Path<(String, String)>,
    method: Method,
    headers: HeaderMap,
    body: String,
) -> Response {
    if let Some(plugin) = state.plugin_manager.get_plugin(&plugin_name) {
        let routes = plugin.plugin.get_routes();

        for route in routes {
            if route_matches_path(&route.path, &path) && route_matches_method(route.method, method.clone()) {
                let plugin_method = match method.as_str() {
                    "GET" => jimu_plugin_interface::Method::GET,
                    "POST" => jimu_plugin_interface::Method::POST,
                    "PUT" => jimu_plugin_interface::Method::PUT,
                    "DELETE" => jimu_plugin_interface::Method::DELETE,
                    "PATCH" => jimu_plugin_interface::Method::PATCH,
                    _ => jimu_plugin_interface::Method::GET,
                };

                let plugin_request = PluginRequest {
                    method: plugin_method,
                    path: path.clone(),
                    headers: headers_to_map(headers),
                    body: if body.is_empty() {
                        None
                    } else {
                        Some(body.into_bytes())
                    },
                };

                match (route.handler)(plugin_request) {
                    Ok(plugin_response) => {
                        let mut builder = Response::builder()
                            .status(plugin_response.status);
                        for (key, value) in &plugin_response.headers {
                            builder = builder.header(key.as_str(), value.as_str());
                        }
                        return builder
                            .body(axum::body::Body::from(plugin_response.body))
                            .unwrap();
                    }
                    Err(e) => {
                        return Response::builder()
                            .status(StatusCode::INTERNAL_SERVER_ERROR)
                            .body(axum::body::Body::from(
                                serde_json::json!({"error": e.to_string()}).to_string()
                            ))
                            .unwrap();
                    }
                }
            }
        }

        Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(axum::body::Body::from(
                serde_json::json!({"error": "Route not found"}).to_string()
            ))
            .unwrap()
    } else {
        Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(axum::body::Body::from(
                serde_json::json!({"error": "Plugin not found"}).to_string()
            ))
            .unwrap()
    }
}

/// 检查路由路径是否匹配（支持路径参数 :param）
fn route_matches_path(route_path: &str, request_path: &str) -> bool {
    // 标准化路径：去除前导斜杠
    let route_path = route_path.trim_start_matches('/');
    let request_path = request_path.trim_start_matches('/');

    let route_parts: Vec<&str> = route_path.split('/').collect();
    let request_parts: Vec<&str> = request_path.split('/').collect();

    if route_parts.len() != request_parts.len() {
        return false;
    }

    for (route_part, request_part) in route_parts.iter().zip(request_parts.iter()) {
        if route_part.starts_with(':') {
            // 路径参数，匹配任意值
            continue;
        }
        if route_part != request_part {
            return false;
        }
    }

    true
}

/// 检查路由方法是否匹配
fn route_matches_method(route_method: jimu_plugin_interface::Method, request_method: Method) -> bool {
    let route_method_str = match route_method {
        jimu_plugin_interface::Method::GET => "GET",
        jimu_plugin_interface::Method::POST => "POST",
        jimu_plugin_interface::Method::PUT => "PUT",
        jimu_plugin_interface::Method::DELETE => "DELETE",
        jimu_plugin_interface::Method::PATCH => "PATCH",
    };

    route_method_str == request_method.as_str()
}

/// 将 Axum 的 HeaderMap 转换为 HashMap
fn headers_to_map(headers: HeaderMap) -> HashMap<String, String> {
    let mut map = HashMap::new();
    for (name, value) in headers {
        if let Some(name) = name {
            if let Ok(value_str) = value.to_str() {
                map.insert(name.to_string(), value_str.to_string());
            }
        }
    }
    map
}
