//! 用户管理插件后端

use jimu_plugin_interface::*;
use std::sync::Arc;
use std::collections::HashMap;
use std::error::Error;

// ===== 用户数据结构 =====

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub role: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct CreateUserRequest {
    pub name: String,
    pub email: String,
    pub role: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct UpdateUserRequest {
    pub name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
}

// ===== 用户管理插件 =====

pub struct UserManagementPlugin {
    ctx: Option<Arc<PluginContext>>,
}

impl UserManagementPlugin {
    pub fn new() -> Self {
        Self { ctx: None }
    }

    // 模拟用户存储（实际应该使用数据库）
    fn get_users(&self) -> Vec<User> {
        vec![
            User {
                id: 1,
                name: "张三".to_string(),
                email: "zhangsan@example.com".to_string(),
                role: "管理员".to_string(),
                created_at: "2024-01-01T00:00:00Z".to_string(),
                updated_at: "2024-01-01T00:00:00Z".to_string(),
            },
            User {
                id: 2,
                name: "李四".to_string(),
                email: "lisi@example.com".to_string(),
                role: "用户".to_string(),
                created_at: "2024-01-02T00:00:00Z".to_string(),
                updated_at: "2024-01-02T00:00:00Z".to_string(),
            },
        ]
    }
}

#[async_trait::async_trait]
impl Plugin for UserManagementPlugin {
    fn name(&self) -> &str {
        "user-management"
    }

    fn version(&self) -> &str {
        "1.0.0"
    }

    fn description(&self) -> &str {
        "用户管理插件"
    }

    async fn on_load(&self, ctx: &PluginContext) -> Result<(), Box<dyn Error + Send + Sync>> {
        log::info!("用户管理插件加载成功");
        log::info!("数据库 URL: {}", ctx.config.database_url);
        Ok(())
    }

    async fn on_unload(&self) -> Result<(), Box<dyn Error + Send + Sync>> {
        log::info!("用户管理插件卸载");
        Ok(())
    }

    async fn execute(&self, input: &str) -> Result<String, Box<dyn Error + Send + Sync>> {
        Ok(format!("用户管理插件处理: {}", input))
    }

    fn get_routes(&self) -> Vec<RouteDeclaration> {
        vec![
            RouteDeclaration {
                path: "/users".to_string(),
                method: Method::GET,
                handler: Arc::new(|_req| list_users()),
            },
            RouteDeclaration {
                path: "/users".to_string(),
                method: Method::POST,
                handler: Arc::new(|req| create_user(req)),
            },
            RouteDeclaration {
                path: "/users/:id".to_string(),
                method: Method::PUT,
                handler: Arc::new(|req| update_user(req)),
            },
            RouteDeclaration {
                path: "/users/:id".to_string(),
                method: Method::DELETE,
                handler: Arc::new(|req| delete_user(req)),
            },
        ]
    }

    fn get_frontend_manifest(&self) -> FrontendManifest {
        FrontendManifest {
            entry: "frontend/assets/main.js".to_string(),
            style: Some("frontend/assets/main.css".to_string()),
            chunks: vec![],
            assets: vec![],
        }
    }

    fn get_menu(&self) -> Option<MenuConfig> {
        Some(MenuConfig {
            title: "用户管理".to_string(),
            icon: "UserOutlined".to_string(),
            path: "/user-management".to_string(),
            order: Some(1),
            children: Some(vec![
                MenuConfig {
                    title: "用户列表".to_string(),
                    icon: "UnorderedListOutlined".to_string(),
                    path: "/user-management/list".to_string(),
                    order: None,
                    children: None,
                },
            ]),
        })
    }
}

// ===== API 处理器 =====

fn list_users() -> PluginResult {
    let plugin = UserManagementPlugin::new();
    let users = plugin.get_users();

    let response = PluginResponse {
        status: 200,
        headers: HashMap::new(),
        body: serde_json::to_vec(&serde_json::json!({ "users": users })).unwrap(),
    };

    Ok(response)
}

fn create_user(req: PluginRequest) -> PluginResult {
    if let Some(body) = req.body {
        if let Ok(create_req) = serde_json::from_slice::<CreateUserRequest>(&body) {
            let user = User {
                id: 3, // 模拟 ID
                name: create_req.name,
                email: create_req.email,
                role: create_req.role,
                created_at: chrono::Utc::now().to_rfc3339(),
                updated_at: chrono::Utc::now().to_rfc3339(),
            };

            let response = PluginResponse {
                status: 201,
                headers: HashMap::new(),
                body: serde_json::to_vec(&user).unwrap(),
            };

            return Ok(response);
        }
    }

    Err(Box::new(std::io::Error::new(
        std::io::ErrorKind::InvalidInput,
        "Invalid request body",
    )))
}

fn update_user(req: PluginRequest) -> PluginResult {
    if let Some(body) = req.body {
        if let Ok(update_req) = serde_json::from_slice::<UpdateUserRequest>(&body) {
            // 模拟更新用户
            let user = User {
                id: 1, // 模拟 ID
                name: update_req.name.unwrap_or("张三".to_string()),
                email: update_req.email.unwrap_or("zhangsan@example.com".to_string()),
                role: update_req.role.unwrap_or("管理员".to_string()),
                created_at: "2024-01-01T00:00:00Z".to_string(),
                updated_at: chrono::Utc::now().to_rfc3339(),
            };

            let response = PluginResponse {
                status: 200,
                headers: HashMap::new(),
                body: serde_json::to_vec(&user).unwrap(),
            };

            return Ok(response);
        }
    }

    Err(Box::new(std::io::Error::new(
        std::io::ErrorKind::InvalidInput,
        "Invalid request body",
    )))
}

fn delete_user(_req: PluginRequest) -> PluginResult {
    // 模拟删除用户
    let response = PluginResponse {
        status: 204,
        headers: HashMap::new(),
        body: vec![],
    };

    Ok(response)
}

// ===== 插件工厂函数 =====

#[no_mangle]
pub unsafe extern "C" fn create_plugin() -> *mut dyn Plugin {
    Box::into_raw(Box::new(UserManagementPlugin::new()))
}
