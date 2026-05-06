#!/bin/bash

# 插件打包脚本
# 用于将前端资源和后端动态库打包成 .plugin 文件

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 函数：显示帮助
show_help() {
    cat << EOF
插件打包工具

用法: ./build-plugin.sh [选项]

选项:
    -p, --plugin-dir <目录>    插件目录 (默认: 当前目录)
    -o, --output <文件>        输出文件 (默认: plugin-name-version.plugin)
    -b, --backend-only         只编译后端
    -f, --frontend-only        只编译前端
    -h, --help                 显示此帮助信息

示例:
    # 打包当前目录的插件
    ./build-plugin.sh

    # 打包指定目录的插件
    ./build-plugin.sh -p /path/to/plugin

    # 指定输出文件名
    ./build-plugin.sh -o my-plugin.plugin

EOF
}

# 解析命令行参数
PLUGIN_DIR=""
OUTPUT_FILE=""
BACKEND_ONLY=false
FRONTEND_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--plugin-dir)
            PLUGIN_DIR="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -b|--backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        -f|--frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 设置插件目录
if [ -z "$PLUGIN_DIR" ]; then
    PLUGIN_DIR=$(pwd)
fi

# 检查插件目录是否存在
if [ ! -d "$PLUGIN_DIR" ]; then
    print_error "插件目录不存在: $PLUGIN_DIR"
    exit 1
fi

# 进入插件目录
cd "$PLUGIN_DIR"

# 检查 manifest.json 是否存在
if [ ! -f "manifest.json" ]; then
    print_error "manifest.json 不存在"
    exit 1
fi

# 读取插件名称和版本
PLUGIN_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4)
PLUGIN_VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4)

if [ -z "$PLUGIN_NAME" ] || [ -z "$PLUGIN_VERSION" ]; then
    print_error "无法从 manifest.json 读取插件名称或版本"
    exit 1
fi

print_info "插件名称: $PLUGIN_NAME"
print_info "插件版本: $PLUGIN_VERSION"

# 设置输出文件名
if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="${PLUGIN_NAME}-${PLUGIN_VERSION}.plugin"
fi

# 创建临时构建目录
BUILD_DIR=".plugin-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# 编译后端
if [ "$FRONTEND_ONLY" = false ]; then
    print_info "编译后端..."

    if [ ! -d "backend" ]; then
        print_error "backend 目录不存在"
        exit 1
    fi

    cd backend

    # 检查 Cargo.toml 是否存在
    if [ ! -f "Cargo.toml" ]; then
        print_error "backend/Cargo.toml 不存在"
        exit 1
    fi

    # 编译动态库
    cargo build --release

    # 确定系统类型和动态库扩展名
    OS=$(uname -s)
    case $OS in
        Linux*)
            LIB_EXT="so"
            ;;
        Darwin*)
            LIB_EXT="dylib"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            LIB_EXT="dll"
            ;;
        *)
            print_error "不支持的操作系统: $OS"
            exit 1
            ;;
    esac

    # 查找编译后的动态库（Rust crate 名中的 - 会被转为 _）
    # 先精确匹配 crate 名，避免误取 deps/ 下的 proc-macro dylib
    CRATE_NAME=$(grep -m1 '^name[[:space:]]*=' Cargo.toml | sed 's/.*"\(.*\)".*/\1/' | tr '-' '_')
    LIB_FILE="target/release/lib${CRATE_NAME}.${LIB_EXT}"
    if [ ! -f "$LIB_FILE" ]; then
        # 回退：在 target/release/（不含子目录）查找
        LIB_FILE=$(find "target/release" -maxdepth 1 -name "lib*.${LIB_EXT}" -type f 2>/dev/null | head -1)
    fi

    if [ -n "$LIB_FILE" ] && [ -f "$LIB_FILE" ]; then
        mkdir -p "../$BUILD_DIR/backend"
        cp "$LIB_FILE" "../$BUILD_DIR/backend/plugin.${LIB_EXT}"
        # macOS 代码签名，避免 dlopen 时被 SIGKILL
        codesign --force --sign - "../$BUILD_DIR/backend/plugin.${LIB_EXT}" 2>/dev/null || true
        print_info "后端编译完成: plugin.${LIB_EXT} (from $(basename "$LIB_FILE"))"
    else
        print_error "无法找到编译后的动态库"
        exit 1
    fi

    # 回到插件根目录
    cd ..
fi

# 编译前端
if [ "$BACKEND_ONLY" = false ]; then
    print_info "编译前端..."

    if [ ! -d "frontend" ]; then
        print_error "frontend 目录不存在"
        exit 1
    fi

    cd frontend

    # 检查 package.json 是否存在
    if [ ! -f "package.json" ]; then
        print_error "frontend/package.json 不存在"
        exit 1
    fi

    # 安装依赖（如果 node_modules 不存在）
    if [ ! -d "node_modules" ]; then
        print_info "安装前端依赖..."
        npm install
    fi

    # 构建前端
    npm run build

    # 复制构建产物 — 检查常见输出目录
    BUILD_OUTPUT_DIR=""
    for d in "dist" "assets" "build"; do
        if [ -d "$d" ]; then
            BUILD_OUTPUT_DIR="$d"
            break
        fi
    done

    if [ -n "$BUILD_OUTPUT_DIR" ]; then
        mkdir -p "../$BUILD_DIR/frontend"
        cp -r "$BUILD_OUTPUT_DIR"/* "../$BUILD_DIR/frontend/"
        print_info "前端编译完成 (from $BUILD_OUTPUT_DIR)"
    else
        print_error "无法找到前端构建产物（dist/assets/build 目录都不存在）"
        exit 1
    fi

    cd ..
fi

# 复制其他文件（仅复制 assets 中不是前端构建产物的内容）
# 注意：如果前端 outDir 不是 assets，此处的 assets 复制逻辑需要保留

if [ -f "README.md" ]; then
    cp README.md "$BUILD_DIR/"
fi

# 复制 manifest.json
cp manifest.json "$BUILD_DIR/"

# 打包
print_info "打包插件: $OUTPUT_FILE"

# 创建 tar.gz 包
cd "$BUILD_DIR"
tar -czf "../$OUTPUT_FILE" .

# 清理临时目录
cd ..
rm -rf "$BUILD_DIR"

print_info "插件打包完成: $OUTPUT_FILE"

# 显示插件信息
echo ""
echo "===================================="
echo "  插件信息"
echo "===================================="
echo "  名称: $PLUGIN_NAME"
echo "  版本: $PLUGIN_VERSION"
echo "  文件: $OUTPUT_FILE"
echo "  大小: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "===================================="
