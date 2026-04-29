# 插件系统架构设计文档

## 1. 系统概述

### 1.1 目标
构建一个可扩展的插件系统，实现：
- **宿主系统**：提供核心功能、基础设施和共用组件
- **插件系统**：业务逻辑以插件形式动态加载，无需重新编译主程序
- **前后端一体化**：插件包含完整的前后端功能，由宿主统一管理

### 1.2 技术栈
- **后端**：Rust + Axum
- **前端**：React + Ant Design
- **插件加载**：libloading 动态库加载
- **前端构建**：Vite 库模式打包
- **消息系统**：后端内部消息总线实现跨插件通信

## 2. 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        宿主系统 (Host)                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Rust 主进程 (Axum)                         │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │ Plugin Loader│  │Plugin Manager│  │Message Bus   │      │ │
│  │  │  (libloading)│  │  (注册/卸载)  │  │  (插件通信)   │      │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │ │
│  │         │                  │                  │             │ │
│  │  ┌──────▼──────────────────▼──────────────────▼───────┐    │ │
│  │  │               PluginContext (依赖注入)              │    │ │
│  │  │  - db: Arc<dyn DatabaseService>                    │    │ │
│  │  │  - msgbus: Arc<dyn MessageBus>                     │    │ │
│  │  │  - router: Arc<dyn RouterService>                  │    │ │
│  │  │  - config: Arc<Config>                             │    │ │
│  │  └────────────────────────────────────────────────────┘    │ │
│  │                           │                                   │ │
│  │         ┌─────────────────┼─────────────────┐                │ │
│  │         │                 │                 │                │ │
│  │  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐        │ │
│  │  │ API Router  │  │File Server  │  │WebSocket    │        │ │
│  │  │  (动态注册)  │  │ (静态资源)  │  │  Handler    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │                 插件注册表                                │ │
│  │  HashMap<plugin_name, LoadedPlugin>                       │ │
│  │  - API 路由已合并到主路由                                  │ │
│  │  - 静态资源已映射到 /plugins/{name}/*                     │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP / WebSocket
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                    React 前端框架                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   主应用 (Main App)                      │   │
│  │  - Layout (侧边栏、顶部栏、内容区)                       │   │
│  │  - Menu Manager (菜单管理)                              │   │
│  │  - Plugin Loader (插件组件加载器)                       │   │
│  │  - Common Components (Ant Design 组件库)                │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                  │
│         │                 │                 │                  │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐          │
│  │ Menu System │  │ Page Router │  │Common Utils  │          │
│  │  (动态菜单)  │  │ (页面路由)  │  │  (共用工具)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              插件页面容器 (Plugin Pages)                │   │
│  │  - 通过动态 import() 加载插件组件                       │   │
│  │  - 统一的错误处理和加载状态                             │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 插件包格式

### 3.1 插件包结构
插件采用 `.plugin` 格式（Tar + Gzip）：

```
my-plugin-1.0.0.plugin
├── manifest.json           # 插件元信息
├── backend/
│   ├── plugin.so           # Linux 动态库
│   ├── plugin.dylib        # macOS 动态库
│   └── plugin.dll          # Windows 动态库
├── frontend/
│   ├── manifest.json       # 前端资源清单
│   ├── index.html          # 可选入口
│   └── assets/
│       ├── main.js         # 主入口 chunk
│       ├── main.css        # 样式文件
│       └── chunks/         # 代码分割块
│           ├── vendor.js
│           └── utils.js
└── assets/                  # 插件静态资源（图片、图标等）
    ├── logo.png
    └── icons/
```

### 3.2 manifest.json 格式

```json
{
  "name": "user-management",
  "version": "1.0.0",
  "description": "用户管理插件",
  "author": "Your Name",
  "min_host_version": "1.0.0",

  "backend": {
    "main": "backend/plugin.so",
    "permissions": [
      "db:read",
      "db:write",
      "msgbus:publish",
      "msgbus:subscribe"
    ]
  },

  "frontend": {
    "entry": "frontend/assets/main.js",
    "style": "frontend/assets/main.css",
    "chunks": [
      "frontend/assets/chunks/vendor.js",
      "frontend/assets/chunks/utils.js"
    ],
    "assets": [
      "assets/logo.png"
    ]
  },

  "menu": {
    "title": "用户管理",
    "icon": "UserOutlined",
    "path": "/user-management",
    "order": 1,
    "children": [
      {
        "title": "用户列表",
        "path": "/user-management/list",
        "icon": "UnorderedListOutlined"
      },
      {
        "title": "角色管理",
        "path": "/user-management/roles",
        "icon": "TeamOutlined"
      }
    ]
  },

  "api": {
    "prefix": "/api/plugins/user-management",
    "routes": [
      {
        "path": "/users",
        "method": "GET",
        "handler": "list_users"
      },
      {
        "path": "/users",
        "method": "POST",
        "handler": "create_user"
      },
      {
        "path": "/users/:id",
        "method": "PUT",
        "handler": "update_user"
      },
      {
        "path": "/users/:id",
        "method": "DELETE",
        "handler": "delete_user"
      }
    ]
  },

  "permissions": {
    "database": {
      "tables": ["users", "roles"]
    },
    "api": {
      "external_urls": []
    }
  }
}
```

## 4. 插件接口定义

### 4.1 核心接口定义（主程序）

```rust
// host/src/plugin/traits.rs

use std::error::Error;
use std::sync::Arc;

/// 插件上下文 - 主程序注入给插件的所有服务
pub struct PluginContext {
    pub db: Arc<dyn DatabaseService>,
    pub msgbus: Arc<dyn MessageBus>,
    pub router: Arc<dyn RouterService>,
    pub config: Arc<Config>,
}

/// 数据库服务接口
pub trait DatabaseService: Send + Sync {
    fn query(&self, sql: &str, params: Vec<Value>)
        -> Result<Vec<Row>, Box<dyn Error + Send + Sync>>;

    fn execute(&self, sql: &str, params: Vec<Value>)
        -> Result<u64, Box<dyn Error + Send + Sync>>;

    fn transaction<F, R>(&self, f: F) -> Result<R, Box<dyn Error + Send + Sync>>
    where
        F: FnOnce(&dyn DatabaseService) -> Result<R, Box<dyn Error + Send + Sync>>;
}

/// 消息总线服务接口
pub trait MessageBus: Send + Sync {
    fn publish(&self, topic: &str, payload: &[u8])
        -> Result<(), Box<dyn Error + Send + Sync>>;

    fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send>)
        -> Result<String, Box<dyn Error + Send + Sync>>;

    fn unsubscribe(&self, subscription_id: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>;
}

/// 路由服务接口
pub trait RouterService: Send + Sync {
    fn register_route(&self, path: &str, method: Method, handler: RouteHandler)
        -> Result<(), Box<dyn Error + Send + Sync>>;

    fn unregister_route(&self, path: &str, method: Method)
        -> Result<(), Box<dyn Error + Send + Sync>>;
}

/// 插件核心接口
pub trait Plugin: Send + Sync {
    /// 插件名称
    fn name(&self) -> &str;

    /// 插件版本
    fn version(&self) -> &str;

    /// 插件加载时的回调
    fn on_load(&self, ctx: &PluginContext)
        -> Result<(), Box<dyn Error + Send + Sync>>;

    /// 插件卸载时的回调
    fn on_unload(&self) -> Result<(), Box<dyn Error + Send + Sync>>;

    /// 执行插件业务逻辑
    fn execute(&self, input: &str)
        -> Result<String, Box<dyn Error + Send + Sync>>;

    /// 获取插件 API 路由定义
    fn get_routes(&self) -> Vec<RouteDeclaration>;

    /// 获取前端资源清单
    fn get_frontend_manifest(&self) -> FrontendManifest;
}

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
pub type PluginResult = Result<PluginResponse, Box<dyn Error + Send + Sync>>;

/// HTTP 方法
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum Method {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
}

/// 前端资源清单
#[derive(Clone)]
pub struct FrontendManifest {
    pub entry: String,
    pub style: Option<String>,
    pub chunks: Vec<String>,
    pub assets: Vec<String>,
}
```

### 4.2 插件实现示例

```rust
// plugin/src/lib.rs

use host::plugin::traits::*;
use std::sync::Arc;
use std::error::Error;

#[no_mangle]
pub unsafe extern "C" fn create_plugin() -> *mut dyn Plugin {
    Box::into_raw(Box::new(UserManagementPlugin {
        ctx: None,
    }))
}

pub struct UserManagementPlugin {
    ctx: Option<Arc<PluginContext>>,
}

impl Plugin for UserManagementPlugin {
    fn name(&self) -> &str {
        "user-management"
    }

    fn version(&self) -> &str {
        "1.0.0"
    }

    fn on_load(&self, ctx: &PluginContext)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        // 保存上下文引用
        let mut ctx_ref = self.ctx.clone();
        ctx_ref = Some(Arc::new(ctx.clone()));

        // 验证数据库连接
        let result = ctx.db.query("SELECT 1", vec![])?;
        log::info!("UserManagement plugin loaded, DB OK: {:?}", result);

        // 订阅相关消息
        ctx.msgbus.subscribe("user.created", Box::new(|payload| {
            log::info!("User created event: {:?}", payload);
        }))?;

        Ok(())
    }

    fn on_unload(&self) -> Result<(), Box<dyn Error + Send + Sync>> {
        log::info!("UserManagement plugin unloaded");
        Ok(())
    }

    fn execute(&self, input: &str)
        -> Result<String, Box<dyn Error + Send + Sync>>
    {
        Ok(format!("UserManagement plugin processed: {}", input))
    }

    fn get_routes(&self) -> Vec<RouteDeclaration> {
        vec![
            RouteDeclaration {
                path: "/users".to_string(),
                method: Method::GET,
                handler: Arc::new(|req| list_users(req)),
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
            chunks: vec![
                "frontend/assets/chunks/vendor.js".to_string(),
                "frontend/assets/chunks/utils.js".to_string(),
            ],
            assets: vec![
                "assets/logo.png".to_string(),
            ],
        }
    }
}

// 具体的处理器函数
fn list_users(_req: PluginRequest) -> PluginResult {
    let response = PluginResponse {
        status: 200,
        headers: HashMap::new(),
        body: r#"{"users": []}"#.as_bytes().to_vec(),
    };
    Ok(response)
}

fn create_user(_req: PluginRequest) -> PluginResult {
    let response = PluginResponse {
        status: 201,
        headers: HashMap::new(),
        body: r#"{"id": 1, "name": "John Doe"}"#.as_bytes().to_vec(),
    };
    Ok(response)
}

fn update_user(_req: PluginRequest) -> PluginResult {
    let response = PluginResponse {
        status: 200,
        headers: HashMap::new(),
        body: r#"{"success": true}"#.as_bytes().to_vec(),
    };
    Ok(response)
}

fn delete_user(_req: PluginRequest) -> PluginResult {
    let response = PluginResponse {
        status: 204,
        headers: HashMap::new(),
        body: vec![],
    };
    Ok(response)
}
```

## 5. 主程序核心功能

### 5.1 插件加载器

```rust
// host/src/plugin/loader.rs

use libloading::{Library, Symbol};
use std::sync::{Arc, RwLock};
use std::collections::HashMap;

pub struct PluginLoader {
    plugins: Arc<RwLock<HashMap<String, LoadedPlugin>>>,
    context: PluginContext,
}

pub struct LoadedPlugin {
    name: String,
    library: Library,
    plugin: Box<dyn Plugin>,
    manifest: PluginManifest,
}

impl PluginLoader {
    pub fn new(context: PluginContext) -> Self {
        Self {
            plugins: Arc::new(RwLock::new(HashMap::new())),
            context,
        }
    }

    pub fn load_from_package(&self, package_path: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        // 1. 解压插件包
        let plugin_dir = self.extract_plugin(package_path)?;

        // 2. 解析 manifest.json
        let manifest = self.read_manifest(&plugin_dir)?;

        // 3. 加载动态库
        let lib_path = plugin_dir.join(&manifest.backend.main);
        let library = unsafe { Library::new(lib_path)? };

        // 4. 调用插件工厂函数
        let create: Symbol<unsafe extern "C" fn() -> *mut dyn Plugin> =
            unsafe { library.get(b"create_plugin")? };

        let plugin = unsafe { Box::from_raw(create()) };

        // 5. 调用插件的 on_load 钩子
        plugin.on_load(&self.context)?;

        // 6. 注册 API 路由
        self.register_plugin_routes(&manifest, &plugin)?;

        // 7. 注册前端资源服务
        self.register_frontend_assets(&manifest, &plugin_dir)?;

        // 8. 注册菜单
        self.register_menu(&manifest)?;

        // 9. 保存到插件注册表
        let loaded = LoadedPlugin {
            name: manifest.name.clone(),
            library,
            plugin,
            manifest,
        };

        self.plugins.write().unwrap()
            .insert(loaded.name.clone(), loaded);

        log::info!("Plugin '{}' loaded successfully", manifest.name);
        Ok(())
    }

    pub fn unload_plugin(&self, name: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        let mut plugins = self.plugins.write().unwrap();

        if let Some(loaded) = plugins.remove(name) {
            // 调用插件的 on_unload 钩子
            loaded.plugin.on_unload()?;

            // 动态库会在 LoadedPlugin drop 时自动卸载
            log::info!("Plugin '{}' unloaded successfully", name);
            Ok(())
        } else {
            Err(format!("Plugin '{}' not found", name).into())
        }
    }

    fn extract_plugin(&self, package_path: &str)
        -> Result<std::path::PathBuf, Box<dyn Error + Send + Sync>>
    {
        // 实现 .plugin 包的解压逻辑
        // ...
        todo!()
    }

    fn read_manifest(&self, plugin_dir: &std::path::Path)
        -> Result<PluginManifest, Box<dyn Error + Send + Sync>>
    {
        // 读取并解析 manifest.json
        // ...
        todo!()
    }

    fn register_plugin_routes(&self, manifest: &PluginManifest, plugin: &Box<dyn Plugin>)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        // 将插件的 API 路由注册到主路由
        // ...
        todo!()
    }

    fn register_frontend_assets(&self, manifest: &PluginManifest, plugin_dir: &std::path::Path)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        // 将插件的静态资源映射到 /plugins/{name}/*
        // ...
        todo!()
    }

    fn register_menu(&self, manifest: &PluginManifest)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        // 注册插件菜单
        // ...
        todo!()
    }
}
```

### 5.2 消息总线

```rust
// host/src/message_bus/mod.rs

use std::sync::{Arc, RwLock};
use std::collections::HashMap;
use std::error::Error;

pub struct MessageBus {
    subscribers: Arc<RwLock<HashMap<String, Vec<Subscription>>>>,
}

pub struct Subscription {
    id: String,
    callback: Box<dyn Fn(&[u8]) + Send>,
}

impl MessageBus {
    pub fn new() -> Self {
        Self {
            subscribers: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub fn publish(&self, topic: &str, payload: &[u8])
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        let subscribers = self.subscribers.read().unwrap();

        if let Some(subs) = subscribers.get(topic) {
            for sub in subs {
                (sub.callback)(payload);
            }
        }

        Ok(())
    }

    pub fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send>)
        -> Result<String, Box<dyn Error + Send + Sync>>
    {
        let subscription_id = uuid::Uuid::new_v4().to_string();
        let subscription = Subscription {
            id: subscription_id.clone(),
            callback,
        };

        self.subscribers.write().unwrap()
            .entry(topic.to_string())
            .or_insert_with(Vec::new)
            .push(subscription);

        Ok(subscription_id)
    }

    pub fn unsubscribe(&self, subscription_id: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        let mut subscribers = self.subscribers.write().unwrap();

        for (_, subs) in subscribers.iter_mut() {
            subs.retain(|s| s.id != subscription_id);
        }

        Ok(())
    }
}

impl DatabaseService for MessageBus {
    fn publish(&self, topic: &str, payload: &[u8])
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        self.publish(topic, payload)
    }

    fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send>)
        -> Result<String, Box<dyn Error + Send + Sync>>
    {
        self.subscribe(topic, callback)
    }

    fn unsubscribe(&self, subscription_id: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        self.unsubscribe(subscription_id)
    }
}
```

## 6. 前端框架设计

### 6.1 主应用结构

```typescript
// host/frontend/src/App.tsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { MainLayout } from './components/Layout/MainLayout';
import { PluginLoader } from './components/Plugin/PluginLoader';
import { MenuProvider } from './contexts/MenuContext';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <MenuProvider>
        <BrowserRouter>
          <MainLayout>
            <PluginLoader />
          </MainLayout>
        </BrowserRouter>
      </MenuProvider>
    </ConfigProvider>
  );
}

export default App;
```

### 6.2 主布局组件

```typescript
// host/frontend/src/components/Layout/MainLayout.tsx

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MenuOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useMenu } from '../../contexts/MenuContext';

const { Header, Sider, Content } = Layout;

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { menuItems } = useMenu();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const selectedKeys = [location.pathname];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>
            {collapsed ? '宿主' : '宿主系统'}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <MenuOutlined
              style={{ fontSize: '18px', cursor: 'pointer' }}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <Dropdown menu={{
            items: [
              { key: 'profile', label: '个人中心', icon: <UserOutlined /> },
              { key: 'settings', label: '系统设置', icon: <SettingOutlined /> },
            ]
          }}>
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
```

### 6.3 菜单管理上下文

```typescript
// host/frontend/src/contexts/MenuContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuProps } from 'antd';
import * as antdIcons from '@ant-design/icons';

export interface MenuItem {
  key: string;
  icon?: string;
  label: string;
  children?: MenuItem[];
  path?: string;
}

interface MenuContextType {
  menuItems: MenuProps['items'];
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (key: string) => void;
  updateMenuItem: (key: string, item: Partial<MenuItem>) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([
    {
      key: '/dashboard',
      icon: React.createElement(antdIcons.DashboardOutlined),
      label: '仪表盘',
    },
  ]);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, convertMenuItem(item)]);
  };

  const removeMenuItem = (key: string) => {
    setMenuItems(prev => prev.filter(item => item.key !== key));
  };

  const updateMenuItem = (key: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(menuItem => {
      if (menuItem.key === key) {
        return { ...menuItem, ...item };
      }
      return menuItem;
    }));
  };

  useEffect(() => {
    // 从后端加载已安装插件的菜单
    loadPluginMenus();
  }, []);

  const loadPluginMenus = async () => {
    try {
      const response = await fetch('/api/plugins/menus');
      const plugins = await response.json();

      plugins.forEach((plugin: any) => {
        if (plugin.menu) {
          addMenuItem(plugin.menu);
        }
      });
    } catch (error) {
      console.error('Failed to load plugin menus:', error);
    }
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, removeMenuItem, updateMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

function convertMenuItem(item: MenuItem): MenuProps['items'][number] {
  const iconComponent = item.icon ? React.createElement((antdIcons as any)[item.icon]) : undefined;

  const menuItem: MenuProps['items'][number] = {
    key: item.key,
    icon: iconComponent,
    label: item.label,
    children: item.children?.map(convertMenuItem),
  };

  return menuItem;
}
```

### 6.4 插件加载器

```typescript
// host/frontend/src/components/Plugin/PluginLoader.tsx

import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spin, Result } from 'antd';
import { PluginComponent } from './PluginComponent';

export function PluginLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPlugin, setCurrentPlugin] = useState<string | null>(null);

  useEffect(() => {
    // 检查当前路径是否属于某个插件
    checkCurrentRoute();
  }, [location.pathname]);

  const checkCurrentRoute = async () => {
    try {
      const response = await fetch('/api/plugins/check-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: location.pathname }),
      });

      const data = await response.json();
      if (data.pluginName) {
        setCurrentPlugin(data.pluginName);
      } else {
        setCurrentPlugin(null);
      }
    } catch (error) {
      console.error('Failed to check route:', error);
      setCurrentPlugin(null);
    }
  };

  if (!currentPlugin) {
    return <div className="dashboard">欢迎使用宿主系统</div>;
  }

  return (
    <Suspense fallback={<Spin size="large" />}>
      <PluginComponent pluginName={currentPlugin} />
    </Suspense>
  );
}
```

### 6.5 插件组件容器

```typescript
// host/frontend/src/components/Plugin/PluginComponent.tsx

import React, { useState, useEffect } from 'react';
import { Spin, Result, Alert } from 'antd';
import { usePlugin } from '../../hooks/usePlugin';

interface PluginComponentProps {
  pluginName: string;
}

export function PluginComponent({ pluginName }: PluginComponentProps) {
  const { component: PluginComponent, loading, error } = usePlugin(pluginName);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return (
      <Result
        status="error"
        title="插件加载失败"
        subTitle={`无法加载插件: ${pluginName}`}
        extra={<Alert message={error.message} type="error" />}
      />
    );
  }

  if (!PluginComponent) {
    return (
      <Result
        status="warning"
        title="插件未找到"
        subTitle={`插件 ${pluginName} 不存在`}
      />
    );
  }

  return <PluginComponent />;
}
```

### 6.6 插件 Hook

```typescript
// host/frontend/src/hooks/usePlugin.ts

import { useState, useEffect } from 'react';

export function usePlugin(pluginName: string) {
  const [component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPlugin = async () => {
      try {
        setLoading(true);
        setError(null);

        // 动态导入插件的 JS 文件
        const module = await import(
          /* @vite-ignore */
          `/api/plugins/${pluginName}/frontend/assets/main.js`
        );

        // 获取插件导出的默认组件
        if (module.default) {
          setComponent(() => module.default);
        } else {
          throw new Error('Plugin does not export a default component');
        }

        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadPlugin();
  }, [pluginName]);

  return { component, loading, error };
}
```

## 7. 消息系统设计（仅后端）

### 7.1 后端消息总线

后端消息总线用于插件之间的通信，已经在前面定义，这里补充更多功能：

```rust
// host/src/message_bus/event_types.rs

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginEvent {
    pub source: String,
    pub topic: String,
    pub payload: Vec<u8>,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginMessage {
    pub plugin_name: String,
    pub message_type: String,
    pub data: serde_json::Value,
    pub timestamp: i64,
}
```

注意：消息总线仅用于后端插件之间的通信，前端不参与消息系统。

## 8. 插件前端实现

### 8.1 插件前端入口

```typescript
// plugin/frontend/src/index.tsx

import React from 'react';
import { UserManagement } from './components/UserManagement';

export default UserManagement;
```

### 8.2 插件前端组件

```typescript
// plugin/frontend/src/components/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plugins/user-management/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/plugins/user-management/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(prev => prev.filter(u => u.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const url = editingUser
        ? `/api/plugins/user-management/users/${editingUser.id}`
        : '/api/plugins/user-management/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (editingUser) {
        setUsers(prev => prev.map(u => (u.id === data.id ? data : u)));
        message.success('更新成功');
      } else {
        setUsers(prev => [...prev, data]);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadUsers();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请输入角色' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

### 8.3 插件前端 Vite 配置

```typescript
// plugin/frontend/vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'UserManagementPlugin',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});
```

## 9. 安全性考虑

### 9.1 插件权限控制

```rust
// host/src/plugin/permissions.rs

use std::collections::HashSet;

pub struct PermissionChecker {
    allowed_permissions: HashSet<String>,
}

impl PermissionChecker {
    pub fn new(allowed_permissions: Vec<String>) -> Self {
        Self {
            allowed_permissions: allowed_permissions.into_iter().collect(),
        }
    }

    pub fn check(&self, required_permission: &str) -> bool {
        self.allowed_permissions.contains(required_permission)
    }

    pub fn check_database_access(&self, table: &str) -> bool {
        self.allowed_permissions.contains(&format!("db:table:{}", table))
    }

    pub fn check_api_access(&self, url: &str) -> bool {
        self.allowed_permissions.contains(&format!("api:{}", url))
    }
}
```

### 9.2 插件沙箱

```rust
// host/src/plugin/sandbox.rs

use std::sync::Arc;
use std::time::Duration;

pub struct PluginSandbox {
    max_memory: usize,
    max_cpu_time: Duration,
    allowed_syscalls: Vec<String>,
}

impl PluginSandbox {
    pub fn new() -> Self {
        Self {
            max_memory: 1024 * 1024 * 1024, // 1GB
            max_cpu_time: Duration::from_secs(30),
            allowed_syscalls: vec![
                "read".to_string(),
                "write".to_string(),
                "open".to_string(),
            ],
        }
    }

    pub fn execute_plugin(&self, plugin: &dyn Plugin) -> PluginResult {
        // 执行插件时监控资源使用
        // ...
        todo!()
    }
}
```

## 10. 项目目录结构

```
project/
├── host/                          # 宿主系统
│   ├── backend/                   # Rust 后端
│   │   ├── src/
│   │   │   ├── main.rs           # 主程序入口
│   │   │   ├── plugin/           # 插件系统
│   │   │   │   ├── mod.rs
│   │   │   │   ├── traits.rs     # 插件接口定义
│   │   │   │   ├── loader.rs     # 插件加载器
│   │   │   │   ├── manager.rs    # 插件管理器
│   │   │   │   ├── permissions.rs # 权限控制
│   │   │   │   └── sandbox.rs    # 沙箱机制
│   │   │   ├── message_bus/      # 消息系统
│   │   │   │   ├── mod.rs
│   │   │   │   └── event_types.rs
│   │   │   ├── database/         # 数据库服务
│   │   │   │   ├── mod.rs
│   │   │   │   └── pool.rs
│   │   │   ├── api/              # API 路由
│   │   │   │   ├── mod.rs
│   │   │   │   └── routes.rs
│   │   │   └── config/           # 配置管理
│   │   ├── Cargo.toml
│   │   └── build.rs
│   │
│   └── frontend/                  # React 前端
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── components/
│       │   │   ├── Layout/
│       │   │   │   └── MainLayout.tsx
│       │   │   └── Plugin/
│       │   │       ├── PluginLoader.tsx
│       │   │       └── PluginComponent.tsx
│       │   ├── contexts/
│       │   │   └── MenuContext.tsx
│       │   ├── hooks/
│       │   │   └── usePlugin.ts
│       │   └── styles/
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── plugins/                       # 插件目录
│   ├── user-management/          # 用户管理插件示例
│   │   ├── backend/
│   │   │   ├── Cargo.toml
│   │   │   └── src/
│   │   │       └── lib.rs
│   │   ├── frontend/
│   │   │   ├── package.json
│   │   │   ├── vite.config.ts
│   │   │   └── src/
│   │   │       ├── index.tsx
│   │   │       └── components/
│   │   │           └── UserManagement.tsx
│   │   ├── manifest.json
│   │   └── build.sh              # 构建脚本
│   │
│   └── another-plugin/
│
├── build-tools/                   # 构建工具
│   ├── plugin-builder.rs         # 插件打包工具
│   └── scripts/
│
└── docs/                          # 文档
    ├── architecture.md
    ├── plugin-development-guide.md
    └── api-reference.md
```

## 11. 实施步骤

### 阶段一：基础框架搭建
1. 创建宿主后端项目（Rust + Axum）
2. 创建宿主前端项目（React + Ant Design）
3. 实现基本的插件接口定义
4. 实现插件加载器基础功能

### 阶段二：插件系统核心
1. 实现动态库加载（libloading）
2. 实现插件注册表管理
3. 实现插件生命周期管理
4. 实现插件包解析

### 阶段三：API 和前端集成
1. 实现 API 路由动态注册
2. 实现前端静态资源服务
3. 实现前端动态加载机制
4. 实现菜单系统集成

### 阶段四：消息系统
1. 实现后端消息总线
2. 实现跨插件消息传递

### 阶段五：安全和沙箱
1. 实现权限控制系统
2. 实现插件沙箱机制
3. 实现资源监控
4. 实现插件签名验证

### 阶段六：插件开发工具
1. 开发插件打包工具
2. 创建插件脚手架
3. 编写插件开发文档
4. 创建示例插件

### 阶段七：测试和优化
1. 单元测试
2. 集成测试
3. 性能优化
4. 文档完善

## 12. 关键技术点

### 12.1 ABI 兼容性
- 插件和宿主必须使用相同的 Rust 版本编译
- 建议在 manifest.json 中注明支持的 Rust 版本
- 跨平台需要分别编译不同平台的动态库

### 12.2 前端资源嵌入
- 使用 include_bytes! 宏将前端资源嵌入到二进制文件中
- 或者作为插件包的一部分，由宿主文件服务器提供

### 12.3 热更新
- 插件更新时先卸载旧版本
- 再加载新版本
- 使用 Arc<RwLock<>> 支持并发访问

### 12.4 错误处理
- 插件加载失败不应影响宿主启动
- 插件运行时错误应该隔离
- 提供详细的错误日志

## 13. 总结

这个插件系统架构提供了：
- ✅ 完整的前后端一体化解决方案
- ✅ 动态加载能力，无需重新编译主程序
- ✅ 插件独立的业务逻辑和 UI
- ✅ 统一的消息系统
- ✅ 菜单和路由的动态注册
- ✅ 安全的权限控制
- ✅ 良好的扩展性

通过这个架构，可以实现功能丰富、易于扩展的插件生态系统。
