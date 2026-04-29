# 快速开始

本指南将帮助你快速启动宿主系统并测试插件功能。

## 前置要求

在开始之前，确保你的系统已安装以下软件：

- **Rust** 1.70 或更高版本
  - 检查: `rustc --version`
  - 安装: https://www.rust-lang.org/tools/install

- **Node.js** 18 或更高版本
  - 检查: `node --version`
  - 安装: https://nodejs.org/

- **npm** (随 Node.js 一起安装)
  - 检查: `npm --version`

- **Git** (可选，用于克隆仓库）

## 快速启动

### 1. 克隆或下载项目

```bash
# 如果你还没有项目，可以使用以下命令创建
git clone <repository-url>
cd jimu
```

### 2. 一键启动开发环境

我们提供了一个便捷的启动脚本：

```bash
# 给脚本添加执行权限
chmod +x dev.sh

# 启动开发环境
./dev.sh
```

这个脚本会自动：
- ✅ 检查所有依赖
- ✅ 安装后端依赖
- ✅ 安装前端依赖
- ✅ 编译示例插件
- ✅ 启动后端服务 (http://localhost:3000)
- ✅ 启动前端服务 (http://localhost:5173)

### 3. 访问应用

启动成功后，你可以在浏览器中访问：

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000

### 4. 测试插件功能

#### 方法 1: 通过 Web 界面

1. 打开 http://localhost:5173
2. 点击左侧菜单中的 "用户管理"
3. 你应该看到用户列表界面

#### 方法 2: 通过 API

```bash
# 健康检查
curl http://localhost:3000/health

# 列出所有插件
curl http://localhost:3000/api/plugins

# 获取所有菜单
curl http://localhost:3000/api/plugins/menus

# 获取用户列表
curl http://localhost:3000/api/plugins/user-management/users
```

## 手动启动（高级）

如果你想手动控制启动过程：

### 启动后端

```bash
cd host/backend

# 设置环境变量（可选）
export SERVER_ADDRESS=0.0.0.0:3000
export DATABASE_URL=sqlite:./host.db
export PLUGINS_DIR=../../plugins
export LOG_LEVEL=info

# 安装依赖
cargo build

# 运行
cargo run
```

### 启动前端（新终端）

```bash
cd host/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 测试

我们提供了测试脚本来自动化测试：

```bash
# 给脚本添加执行权限
chmod +x test.sh

# 运行测试
./test.sh
```

测试脚本会检查：
- 后端服务是否正常运行
- 基础端点是否响应正确
- 插件端点是否工作正常
- 插件前端资源是否可以访问

## 停止服务

- 如果使用 `./dev.sh` 启动，按 `Ctrl+C` 停止
- 如果手动启动，分别在各自终端按 `Ctrl+C`

## 常见问题

### Q: 后端启动失败？

**A:** 检查以下几点：
1. Rust 版本是否足够新 (`rustc --version`)
2. 是否有足够的磁盘空间
3. 端口 3000 是否被占用 (`lsof -i :3000`)

### Q: 前端启动失败？

**A:** 检查以下几点：
1. Node.js 版本是否足够新 (`node --version`)
2. 是否已运行 `npm install`
3. 端口 5173 是否被占用 (`lsof -i :5173`)

### Q: 插件无法加载？

**A:** 检查以下几点：
1. 插件目录结构是否正确
2. manifest.json 格式是否正确
3. 动态库是否编译成功
4. Rust 版本是否匹配

### Q: 浏览器无法访问前端？

**A:** 检查以下几点：
1. 前端服务是否正在运行
2. 浏览器控制台是否有错误
3. 是否需要清除浏览器缓存

### Q: API 请求失败？

**A:** 检查以下几点：
1. 后端服务是否正在运行
2. API 路径是否正确
3. 后端日志中是否有错误信息

## 开发工作流

### 1. 开发宿主系统

```bash
# 启动开发环境
./dev.sh

# 修改代码后，后端会自动重新编译（使用 cargo watch）
cargo install cargo-watch
cargo watch -x run
```

### 2. 开发插件

```bash
# 进入插件目录
cd plugins/user-management

# 修改后端代码后重新编译
cd backend
cargo build --release

# 修改前端代码后重新编译
cd ../frontend
npm run build

# 或使用打包工具
../../build-tools/build-plugin.sh
```

### 3. 调试技巧

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

## 下一步

- 查看 [插件开发指南](./PLUGIN_DEVELOPMENT.md)
- 了解 [API 文档](./API_REFERENCE.md)
- 学习如何 [创建自定义插件](./docs/PLUGIN_SYSTEM_ARCHITECTURE.md)

## 获取帮助

如果遇到问题：

1. 查看项目文档
2. 检查 GitHub Issues
3. 提交新的 Issue 描述你的问题

祝你使用愉快！🎉
