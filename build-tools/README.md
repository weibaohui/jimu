# 插件打包工具

用于将插件的前端资源和后端动态库打包成 `.plugin` 文件。

## 使用方法

### 基本用法

```bash
# 在插件目录中运行
cd plugins/user-management
../../build-tools/build-plugin.sh
```

### 高级用法

```bash
# 指定插件目录
./build-plugin.sh -p /path/to/plugin

# 指定输出文件名
./build-plugin.sh -o my-plugin.plugin

# 只编译后端
./build-tools/build-plugin.sh -b

# 只编译前端
./build-tools/build-plugin.sh -f
```

## 命令行选项

| 选项 | 说明 |
|------|------|
| `-p, --plugin-dir <目录>` | 插件目录（默认：当前目录） |
| `-o, --output <文件>` | 输出文件（默认：plugin-name-version.plugin） |
| `-b, --backend-only` | 只编译后端 |
| `-f, --frontend-only` | 只编译前端 |
| `-h, --help` | 显示帮助信息 |

## 打包流程

1. **编译后端**
   - 进入 `backend/` 目录
   - 运行 `cargo build --release`
   - 复制编译后的动态库到 `build/backend/`

2. **编译前端**
   - 进入 `frontend/` 目录
   - 运行 `npm install`（如果需要）
   - 运行 `npm run build`
   - 复制构建产物到 `build/frontend/`

3. **打包**
   - 复制 `manifest.json`
   - 复制 `assets/`（如果存在）
   - 使用 `tar` 打包成 `.plugin` 文件

## 输出文件格式

```
plugin-name-version.plugin (tar.gz)
├── manifest.json
├── backend/
│   └── plugin.so (or .dylib, .dll)
├── frontend/
│   ├── assets/
│   │   └── main.js
│   └── ...
└── assets/
    └── ...
```

## 平台支持

脚本会自动检测操作系统并生成对应平台的动态库：

- **Linux**: `.so`
- **macOS**: `.dylib`
- **Windows**: `.dll`

## 注意事项

1. **Rust 版本一致性**
   - 确保插件和宿主使用相同的 Rust 版本
   - 使用 `rustc --version` 检查版本

2. **依赖安装**
   - 后端：确保已安装 Rust 和 Cargo
   - 前端：确保已安装 Node.js 和 npm

3. **编译时间**
   - 首次编译可能需要较长时间
   - 后续编译会更快

4. **清理**
   - 如果遇到问题，可以删除 `node_modules` 和 `target` 目录重新编译

## 示例

```bash
# 进入用户管理插件目录
cd plugins/user-management

# 打包插件（编译后端和前端）
../../build-tools/build-plugin.sh

# 输出：
# [INFO] 插件名称: user-management
# [INFO] 插件版本: 1.0.0
# [INFO] 编译后端...
# [INFO] 后端编译完成: plugin.so
# [INFO] 编译前端...
# [INFO] 前端编译完成
# [INFO] 复制资源文件
# [INFO] 打包插件: user-management-1.0.0.plugin
# [INFO] 插件打包完成: user-management-1.0.0.plugin
#
# ====================================
#   插件信息
# ====================================
#   名称: user-management
#   版本: 1.0.0
#   文件: user-management-1.0.0.plugin
#   大小: 1.2M
# ====================================
```

## 故障排除

### 后端编译失败

```bash
# 检查 Rust 版本
rustc --version

# 清理并重新编译
cd backend
cargo clean
cargo build --release
```

### 前端编译失败

```bash
# 清理并重新安装依赖
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 打包失败

```bash
# 检查 manifest.json 格式
cat manifest.json | jq .

# 手动检查文件结构
ls -la
```

## 开发建议

1. **开发阶段**
   - 使用 `-b` 或 `-f` 选项只编译需要修改的部分
   - 加快迭代速度

2. **测试打包**
   - 打包后先手动解压检查内容
   - 确保 `manifest.json` 正确

3. **版本管理**
   - 使用版本号命名输出文件
   - 方便追溯和回退

4. **自动化**
   - 可以集成到 CI/CD 流程
   - 自动打包和发布
