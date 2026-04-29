# 宿主系统 - 插件化框架

一个基于 Rust + Axum 后端和 React + Ant Design 前端的插件化框架。

## ✨ 特性

- 🔌 **动态插件加载** - 运行时加载/卸载插件，无需重启
- 🔥 **插件热更新** - 无需重启即可更新插件
- 🎨 **统一 UI 框架** - 基于 Ant Design 的现代化界面
- 📦 **完整插件包** - 插件包含后端逻辑和前端界面
- 🌉 **消息总线** - 插件间通信机制
- 🛡️ **沙箱机制** - 安全的插件运行环境
- 💾 **多数据库支持** - SQLite/PostgreSQL/MySQL
- 📊 **企业级日志** - 详细的请求/性能/插件日志
- 🚀 **开发友好** - 提供打包工具和测试脚本

## 📚 文档

- [快速开始](./QUICKSTART.md) - 5分钟快速上手
- [插件系统架构](./docs/PLUGIN_SYSTEM_ARCHITECTURE.md) - 完整的架构设计文档
- [插件开发指南](./docs/PLUGIN_DEVELOPMENT.md) - 插件开发教程
- [插件打包工具](./build-tools/README.md) - 打包工具使用说明
- [API 参考](./docs/API_REFERENCE.md) - API 文档

## 🚀 快速开始

### 方式一：一键启动（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd jimu

# 一键启动开发环境
./dev.sh
```

这将自动：
- ✅ 检查依赖
- ✅ 安装后端和前端依赖
- ✅ 编译示例插件
- ✅ 启动后端服务 (http://localhost:3000)
- ✅ 启动前端服务 (http://localhost:5173)

### 方式二：手动启动

详细步骤请查看 [快速开始指南](./QUICKSTART.md)

## 🧪 测试

```bash
# 运行自动化测试
./test.sh
```

测试脚本会检查：
- 服务是否正常运行
- 基础端点是否响应
- 插件功能是否正常
- 错误处理是否正确

## 🔌 插件开发

### 插件清单 (manifest.json)

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "我的插件",
  "backend": {
    "main": "backend/plugin.so",
    "permissions": ["db:read", "db:write"]
  },
  "frontend": {
    "entry": "frontend/assets/main.js",
    "style": "frontend/assets/main.css"
  },
  "menu": {
    "title": "我的插件",
    "icon": "AppstoreOutlined",
    "path": "/my-plugin"
  }
}
```

### 后端插件接口

```rust
use host::plugin::traits::*;

#[no_mangle]
pub unsafe extern "C" fn create_plugin() -> *mut dyn Plugin {
    Box::into_raw(Box::new(MyPlugin))
}

pub struct MyPlugin;

#[async_trait::async_trait]
impl Plugin for MyPlugin {
    fn name(&self) -> &str { "my-plugin" }
    fn version(&self) -> &str { "1.0.0" }
    fn description(&self) -> &str { "我的插件" }

    async fn on_load(&self, ctx: &PluginContext) -> Result<()> {
        Ok(())
    }

    async fn on_unload(&self) -> Result<()> {
        Ok(())
    }

    async fn execute(&self, input: &str) -> Result<String> {
        Ok(input.to_string())
    }

    fn get_routes(&self) -> Vec<RouteDeclaration> {
        vec![]
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
            title: "我的插件".to_string(),
            icon: "AppstoreOutlined".to_string(),
            path: "/my-plugin".to_string(),
            order: None,
            children: None,
        })
    }
}
```

### 前端插件组件

```typescript
import React from 'react'

export default function MyPlugin() {
  return (
    <div>
      <h1>我的插件</h1>
      <p>这是插件的主页面</p>
    </div>
  )
}
```

## 🏗 核心特性

### 后端
- ✅ 插件动态加载（libloading）
- ✅ 插件依赖注入（数据库、消息总线、配置）
- ✅ 插件生命周期管理
- ✅ 后端插件间消息总线
- ✅ 动态 API 路由注册
- ✅ 静态资源服务

### 前端
- ✅ 插件组件动态加载
- ✅ 动态菜单管理
- ✅ React + Ant Design UI 框架
- ✅ 响应式布局
- ✅ 插件前端资源代理
- ✅ 插件管理界面
  - 插件列表查看
  - 插件上传（文件/路径/Base64）
  - 全生命周期管理（启用/禁用/启动/停止/重载/卸载）
  - 插件详情查看
  - 运行日志监控（支持自动刷新）
  - 沙盒资源统计
  - 违规记录查看
- ✅ 仪表盘界面

## 🏗 项目结构

```
jimu/
├── docs/                                    # 文档
│   └── PLUGIN_SYSTEM_ARCHITECTURE.md        # 插件系统架构文档
│
├── host/                                    # 宿主系统
│   ├── backend/                             # Rust 后端
│   │   ├── src/
│   │   │   ├── main.rs                     # 主程序入口
│   │   │   ├── plugin/                     # 插件系统
│   │   │   │   ├── traits.rs               # 插件接口定义
│   │   │   │   ├── loader.rs               # 插件加载器
│   │   │   │   ├── manager.rs              # 插件管理器
│   │   │   │   └── mod.rs
│   │   │   ├── message_bus/                # 消息总线
│   │   │   │   └── mod.rs
│   │   │   ├── database/                   # 数据库服务
│   │   │   │   └── mod.rs
│   │   │   ├── api/                        # API 路由
│   │   │   │   └── mod.rs
│   │   │   ├── config/                     # 配置管理
│   │   │   │   └── mod.rs
│   │   │   └── utils/                      # 工具函数
│   │   │       ├── mod.rs
│   │   │       └── logger.rs
│   │   └── Cargo.toml
│   │
│   └── frontend/                            # React 前端
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── components/
│       │   │   ├── Layout/
│       │   │   │   └── MainLayout.tsx      # 主布局
│       │   │   └── Plugin/
│       │   │       └── PluginLoader.tsx    # 插件加载器
│       │   ├── contexts/
│       │   │   └── MenuContext.tsx         # 菜单管理
│       │   ├── hooks/
│       │   │   └── usePlugin.ts            # 插件 Hook
│       │   └── styles/
│       │       └── index.css
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── index.html
│
├── plugins/                                 # 插件目录
│   └── user-management/                    # 用户管理插件示例
│       ├── manifest.json                   # 插件清单
│       ├── backend/                        # 插件后端
│       │   ├── Cargo.toml
│       │   └── src/
│       │       └── lib.rs
│       └── frontend/                       # 插件前端
│           ├── package.json
│           ├── vite.config.ts
│           └── src/
│               ├── index.tsx
│               └── components/
│                   └── UserManagement.tsx
│
├── build-tools/                             # 构建工具
│   ├── build-plugin.sh                     # 插件打包脚本
│   └── README.md
│
├── dev.sh                                  # 开发环境启动脚本
├── test.sh                                 # 测试脚本
├── .env.example                            # 环境变量示例
├── .gitignore                              # Git 忽略文件
└── README.md                               # 项目说明
```

## 📦 创建插件

```bash
# 使用插件打包工具
./build-tools/build-plugin.sh

# 指定插件目录
./build-tools/build-plugin.sh -p plugins/my-plugin

# 只编译后端
./build-tools/build-plugin.sh -b

# 只编译前端
./build-tools/build-plugin.sh -f
```

详细说明请查看 [插件打包工具文档](./build-tools/README.md)

## 🧩 API 端点

### 基础端点

- `GET /health` - 健康检查
- `GET /api/plugins` - 列出所有插件
- `GET /api/plugins/:name` - 获取插件详情
- `POST /api/plugins` - 从包加载插件
- `DELETE /api/plugins/:name` - 卸载插件
- `GET /api/plugins/menus` - 获取所有菜单
- `POST /api/plugins/check-route` - 检查路由属于哪个插件
- `GET /plugins/:name/frontend/*path` - 提供插件前端资源
- `ANY /api/plugins/:plugin_name/*path` - 插件 API 路由（通用处理器）

详细 API 文档请查看 [API 参考](./docs/API_REFERENCE.md)

## 📊 环境变量

支持以下环境变量（参考 `.env.example`）：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SERVER_ADDRESS` | 服务器地址 | `0.0.0.0:3000` |
| `DATABASE_URL` | 数据库连接字符串 | `sqlite:./host.db` |
| `PLUGINS_DIR` | 插件目录路径 | `./plugins` |
| `LOG_LEVEL` | 日志级别 | `info` |

## 🧪 测试和调试

### 运行测试

```bash
# 运行自动化测试
./test.sh
```

### 调试技巧

**后端调试：**
```bash
# 使用 RUST_LOG 设置详细日志
export RUST_LOG=debug
cargo run

# 使用 dbg! 宏打印调试信息
dbg!(variable_name);
```

**前端调试：**
- 使用浏览器开发者工具 (F12)
- 查看 Console 和 Network 标签
- 在代码中使用 `console.log()` 或 `debugger`

## ✅ 已完成功能

- [x] 插件动态加载（libloading）
- [x] 插件依赖注入（数据库、消息总线、配置）
- [x] 插件生命周期管理
- [x] 后端插件间消息总线
- [x] 动态 API 路由注册
- [x] 静态资源服务
- [x] 插件组件动态加载
- [x] 动态菜单管理
- [x] React + Ant Design UI 框架
- [x] 响应式布局
- [x] 插件前端资源代理
- [x] 插件打包工具
- [x] 开发环境启动脚本
- [x] 自动化测试脚本

## 🔄 待实现功能

- [ ] 插件权限控制（UI）
- [ ] 插件依赖管理（UI）
- [ ] 插件脚手架
- [ ] WebSocket 支持（可选）
- [ ] 插件市场
- [ ] 插件配置编辑器
- [ ] 插件性能监控图表
- [ ] 插件日志搜索和过滤
- [ ] 批量操作插件

## 🛠 开发说明

### 添加新依赖

**后端：**
```bash
cd host/backend
cargo add dependency_name
```

**前端：**
```bash
cd host/frontend
npm install dependency_name
```

### 构建生产版本

**后端：**
```bash
cd host/backend
cargo build --release
```

**前端：**
```bash
cd host/frontend
npm run build
```

## ❓ 常见问题

### 1. 插件加载失败

检查：
- 动态库文件路径是否正确
- Rust 版本是否匹配
- manifest.json 格式是否正确

### 2. 前端插件组件无法加载

检查：
- 插件前端资源是否正确编译
- 资源路径是否正确
- 浏览器控制台是否有错误

### 3. 数据库连接失败

检查：
- DATABASE_URL 环境变量是否正确设置
- 数据库服务是否正在运行
- 数据库权限是否足够

## 🛠 技术栈

**后端：**
- Rust 2021
- Axum (Web 框架)
- Tokio (异步运行时)
- SQLx (数据库)
- libloading (动态库加载)
- Serde (序列化)

**前端：**
- React 18
- TypeScript 5
- Ant Design 5
- React Router 6
- Vite 5

## 🤝 洡献

欢迎提交 Issue 和 Pull Request！

## 🔄 最新更新

### v0.2.0 - 短期和中期功能增强（当前版本）

**新增功能：**
- ✅ **共享接口包** - 创建独立的 `jimu-plugin-interface` 包
  - 统一的接口定义
  - 避免依赖重复
  - 保证类型一致性

- ✅ **插件文件加载** - 支持从 .plugin (tar.gz) 文件加载
  - 自动解压和验证
  - Base64 编码支持
  - 版本兼容性检查

- ✅ **真实数据库支持** - 完整的数据库系统集成
  - 支持 SQLite/PostgreSQL/MySQL
  - 连接池管理
  - 自动表初始化
  - 健康检查端点

- ✅ **增强日志系统** - 企业级日志记录
  - 多级日志（TRACE/DEBUG/INFO/WARN/ERROR）
  - 请求/响应追踪
  - 性能监控
  - 插件生命周期日志

- ✅ **插件热更新** - 无需重启即可更新插件
  - 运行时重新加载
  - 版本检查
  - 平滑过渡
  - 并发控制

- ✅ **插件沙箱机制** - 安全的插件运行环境
  - 内存使用限制
  - CPU 时间限制
  - 系统调用控制
  - 文件/网络访问控制
  - 资源使用统计

**改进：**
- 🔧 优化插件加载流程
- 🛠️ 增强错误处理和恢复
- 📝 改进日志输出和格式
- 🔒 提升系统安全性
- ⚡ 优化性能和资源使用

**API 更新：**
```bash
# 从 .plugin 文件加载插件
POST /api/plugins
Body: { "path": "/path/to/plugin.plugin" }
      or: { "data": "base64_encoded_data" }

# 重新加载插件（热更新）
POST /api/plugins/:name/reload

# 健康检查（包含数据库状态）
GET /health
Response: {
  "status": "ok",
  "database": {
    "status": "healthy",
    "database_connected": true
  }
}
```

**文档更新：**
- 📚 [完成总结](./COMPLETION_SUMMARY.md)
- 📝 [增强总结](./ADVANCEMENT_SUMMARY.md)
- 🎯 [快速开始指南](./QUICKSTART.md)

---

### v0.3.0 - 插件管理前端界面（当前版本）

**新增功能：**
- ✅ **完整的前端插件管理界面**
  - 插件列表视图（支持分页、搜索）
  - 实时统计（总插件数、运行中、已启用、已禁用）
  - 插件状态标签（9种状态）
  - 智能控制按钮（根据状态动态显示）

- ✅ **插件上传功能**
  - 文件上传（.plugin 文件）
  - 服务器路径上传
  - Base64 数据上传
  - 上传验证和错误处理

- ✅ **插件详情查看**
  - 基本信息（名称、版本、描述、作者）
  - 状态信息（当前状态、是否启用）
  - 时间信息（创建时间、更新时间）
  - 依赖信息（最小主机版本、依赖项）

- ✅ **运行日志监控**
  - 实时日志查看
  - 日志级别分类（DEBUG/INFO/WARN/ERROR）
  - 自动刷新功能（每3秒）
  - 日志上下文信息展示
  - 清空日志功能

- ✅ **沙盒资源统计**
  - 内存使用监控（实时显示使用量和限制）
  - CPU 时间监控
  - 操作次数统计
  - 违规记录查看
    - 内存超限
    - CPU 超限
    - 非法文件访问
    - 非法网络访问
    - 非法系统调用
  - 资源使用进度条
  - 自动刷新功能

- ✅ **插件全生命周期管理**
  - 安装 → 启用 → 启动 → 运行
  - 停止 → 禁用 → 卸载
  - 热重载（无需重启）
  - 状态转换规则
  - 操作确认提示

- ✅ **仪表盘界面**
  - 插件统计概览
  - 最近更新的插件列表
  - 快速访问功能

- ✅ **系统设置界面**
  - 自动重载配置
  - 资源限制设置
  - 日志管理配置
  - 系统信息查看

**新增组件：**
- `PluginManagement` - 插件管理主页面
- `PluginList` - 插件列表组件
- `PluginUploadModal` - 插件上传对话框
- `PluginDetailDrawer` - 插件详情抽屉
- `PluginControlButtons` - 插件控制按钮组
- `PluginStatusBadge` - 插件状态标签
- `PluginLogs` - 插件日志查看组件
- `PluginSandboxStats` - 沙盒统计组件
- `PluginSettings` - 系统设置组件
- `Dashboard` - 仪表盘组件

**新增类型定义：**
- `PluginStatus` - 插件状态枚举（9种状态）
- `PluginTransition` - 插件状态转换枚举
- `Plugin` - 插件基础信息
- `PluginDetail` - 插件详细信息
- `PluginLog` - 插件日志
- `SandboxStats` - 沙盒统计
- `SandboxViolation` - 沙盒违规记录
- `PluginUploadRequest` - 插件上传请求

**新增 API 服务：**
- `pluginApi.listPlugins()` - 获取插件列表
- `pluginApi.getPluginDetail()` - 获取插件详情
- `pluginApi.uploadPlugin()` - 上传插件
- `pluginApi.enablePlugin()` - 启用插件
- `pluginApi.disablePlugin()` - 禁用插件
- `pluginApi.startPlugin()` - 启动插件
- `pluginApi.stopPlugin()` - 停止插件
- `pluginApi.reloadPlugin()` - 重载插件
- `pluginApi.uninstallPlugin()` - 卸载插件
- `pluginApi.getPluginLogs()` - 获取插件日志
- `pluginApi.clearPluginLogs()` - 清空插件日志
- `pluginApi.getSandboxStats()` - 获取沙盒统计
- `pluginApi.resetSandboxStats()` - 重置沙盒统计
- `pluginApi.getPluginMenus()` - 获取插件菜单

**路由更新：**
- `/` - 重定向到 `/dashboard`
- `/dashboard` - 仪表盘页面
- `/plugins` - 插件管理页面

**菜单更新：**
- 仪表盘（默认页面）
- 插件管理（新增）

**文档更新：**
- 📚 [前端使用说明](./host/frontend/README.md)

---

### v0.1.0 - 基础框架（初始版本）

**核心功能：**
- ✅ 插件动态加载（libloading）
- ✅ 插件依赖注入
- ✅ 插件生命周期管理
- ✅ 后端插件间消息总线
- ✅ 动态 API 路由注册
- ✅ 静态资源服务

**前端：**
- ✅ 插件组件动态加载
- ✅ 动态菜单管理
- ✅ React + Ant Design UI 框架
- ✅ 响应式布局

**开发工具：**
- ✅ 插件打包工具
- ✅ 开发环境启动脚本
- ✅ 自动化测试脚本

## 📜 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
