# 插件管理前端界面使用说明

## 概述

插件管理前端界面提供了完整的插件生命周期管理功能，包括插件列表查看、上传、启用/禁用、启动/停止、重载、卸载等操作，以及插件详情查看、日志监控、沙盒统计等功能。

## 功能特性

### 1. 插件列表 (`/plugins`)

- 显示所有已安装的插件
- 实时统计：总插件数、运行中、已启用、已禁用
- 插件状态显示（未安装、已安装、已启用、已禁用、运行中、已停止、加载中、卸载中、错误）
- 插件操作：启用、禁用、启动、停止、重载、卸载
- 查看插件详情

### 2. 插件上传

支持三种上传方式：
- **文件上传**：直接上传 .plugin 文件
- **服务器路径**：提供服务器上的 .plugin 文件路径
- **Base64 数据**：粘贴 Base64 编码的插件数据

### 3. 插件详情

#### 基本信息
- 插件名称、版本、描述、作者
- 状态、是否启用
- 创建时间、更新时间
- 最小主机版本、依赖项

#### 运行日志
- 实时查看插件日志
- 日志级别：DEBUG、INFO、WARN、ERROR
- 支持自动刷新（每3秒）
- 清空日志功能
- 日志上下文信息展示

#### 沙盒统计
- **内存使用**：实时内存使用量和限制
- **CPU 时间**：实时 CPU 时间使用和限制
- **操作次数**：插件执行的操作计数
- **违规记录**：沙盒违规事件列表
  - 内存超限
  - CPU 超限
  - 非法文件访问
  - 非法网络访问
  - 非法系统调用

### 4. 系统设置

- 自动重载配置
- 资源限制设置
  - 内存限制（MB）
  - CPU 时间限制（秒）
- 日志管理
  - 日志保留天数
- 系统信息查看

### 5. 仪表盘 (`/dashboard`)

- 插件统计概览
- 最近更新的插件列表

## 插件生命周期

插件状态流转：

```
未安装 → 已安装 → 已启用 → 运行中
   ↓        ↓        ↓
  卸载    禁用     停止
            ↓        ↓
         已禁用   已停止
            ↓        ↓
         (可以启用) (可以启动)

错误状态：可以通过重载恢复，或卸载
```

### 状态说明

- **未安装 (uninstalled)**：插件未安装
- **已安装 (installed)**：插件已安装但未启用
- **已启用 (enabled)**：插件已启用但未启动
- **已禁用 (disabled)**：插件已被禁用
- **运行中 (running)**：插件正在运行
- **已停止 (stopped)**：插件已停止
- **加载中 (loading)**：插件正在加载
- **卸载中 (unloading)**：插件正在卸载
- **错误 (error)**：插件发生错误

### 状态转换规则

| 当前状态 | 可执行操作 |
|---------|-----------|
| 未安装 | - |
| 已安装 | 启用、卸载 |
| 已启用 | 启动、禁用、卸载 |
| 已禁用 | 启用、卸载 |
| 运行中 | 停止、重载、禁用 |
| 已停止 | 启动、禁用、卸载 |
| 加载中 | - |
| 卸载中 | - |
| 错误 | 重载、卸载 |

## 使用方法

### 启动前端

```bash
cd host/frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 访问界面

1. **仪表盘**：`http://localhost:5173/dashboard`
2. **插件管理**：`http://localhost:5173/plugins`

### 上传插件

1. 点击"上传插件"按钮
2. 选择上传方式：
   - 文件上传：选择本地的 .plugin 文件
   - 服务器路径：输入服务器上的文件路径
   - Base64 数据：粘贴编码后的数据
3. 点击"上传"

### 管理插件

1. **查看详情**：点击插件的"详情"按钮
2. **启用/禁用**：点击"启用"或"禁用"按钮
3. **启动/停止**：点击"启动"或"停止"按钮
4. **重载**：点击"重载"按钮进行热重载
5. **卸载**：点击"卸载"按钮（需确认）

### 查看日志

1. 进入插件详情
2. 切换到"运行日志"标签
3. 点击"刷新日志"手动刷新
4. 或点击"开启自动刷新"实时查看

### 查看沙盒统计

1. 进入插件详情
2. 切换到"沙盒统计"标签
3. 查看资源使用情况
4. 查看违规记录

## API 端点

前端调用的后端 API：

- `GET /api/plugins` - 获取插件列表
- `GET /api/plugins/:name` - 获取插件详情
- `POST /api/plugins` - 上传插件
- `POST /api/plugins/:name/enable` - 启用插件
- `POST /api/plugins/:name/disable` - 禁用插件
- `POST /api/plugins/:name/start` - 启动插件
- `POST /api/plugins/:name/stop` - 停止插件
- `POST /api/plugins/:name/reload` - 重载插件
- `POST /api/plugins/:name/uninstall` - 卸载插件
- `GET /api/plugins/:name/logs` - 获取插件日志
- `DELETE /api/plugins/:name/logs` - 清空插件日志
- `GET /api/plugins/:name/sandbox` - 获取沙盒统计
- `POST /api/plugins/:name/sandbox/reset` - 重置沙盒统计
- `GET /api/plugins/menus` - 获取插件菜单

## 技术栈

- React 18
- TypeScript 5
- Ant Design 5
- React Router 6
- Axios

## 项目结构

```
host/frontend/src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── index.ts
│   ├── Layout/
│   │   └── MainLayout.tsx
│   └── PluginManagement/
│       ├── PluginManagement.tsx      # 主页面
│       ├── PluginList.tsx            # 插件列表
│       ├── PluginUploadModal.tsx     # 上传对话框
│       ├── PluginDetailDrawer.tsx    # 详情抽屉
│       ├── PluginControlButtons.tsx  # 控制按钮
│       ├── PluginStatusBadge.tsx     # 状态标签
│       ├── PluginLogs.tsx            # 日志查看
│       ├── PluginSandboxStats.tsx    # 沙盒统计
│       ├── PluginSettings.tsx        # 系统设置
│       └── index.ts
├── contexts/
│   └── MenuContext.tsx
├── router/
│   └── index.tsx
├── services/
│   └── pluginApi.ts
├── types/
│   └── plugin.ts
├── App.tsx
└── main.tsx
```

## 注意事项

1. **后端依赖**：前端需要后端服务运行在 `http://localhost:3000`
2. **CORS 配置**：确保后端已配置 CORS 允许前端访问
3. **权限控制**：当前版本未实现用户认证，所有用户都有完全访问权限
4. **日志大小**：大量日志可能影响性能，建议定期清理
5. **沙盒违规**：频繁的沙盒违规可能导致插件被强制停止

## 后续计划

- [ ] 添加用户认证和权限控制
- [ ] 实现插件依赖管理界面
- [ ] 添加插件市场功能
- [ ] 支持插件版本回滚
- [ ] 添加插件性能监控图表
- [ ] 实现插件配置编辑器
- [ ] 添加插件日志搜索和过滤
- [ ] 支持批量操作插件
