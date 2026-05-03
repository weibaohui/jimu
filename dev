#!/bin/bash

# 开发环境启动脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

# 函数：清理进程
cleanup() {
    print_info "清理进程..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# 捕获退出信号
trap cleanup EXIT INT TERM

# 检查依赖
check_dependencies() {
    print_step "检查依赖..."

    if ! command -v cargo &> /dev/null; then
        print_error "Rust/Cargo 未安装"
        print_info "请访问 https://www.rust-lang.org/tools/install 安装"
        exit 1
    fi

    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        print_info "请访问 https://nodejs.org/ 安装"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi

    print_info "依赖检查通过"
}

# 安装后端依赖
install_backend() {
    print_step "安装后端依赖..."
    cd host/backend
    cargo check --quiet 2>/dev/null || cargo build
    cd ../..
    print_info "后端依赖安装完成"
}

# 安装前端依赖
install_frontend() {
    print_step "安装前端依赖..."
    cd host/frontend
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    cd ../..
    print_info "前端依赖安装完成"
}

# 编译示例插件
build_plugin() {
    print_step "编译用户管理插件..."
    cd plugins/user-management/backend
    cargo build --release
    cd ../..

    # 复制动态库到正确的位置
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

    # 确保后端目录存在
    mkdir -p backend/target/release
    cp plugins/user-management/backend/target/release/libuser_management.${LIB_EXT} \
       plugins/user-management/backend/plugin.${LIB_EXT} 2>/dev/null || true

    cd ../..
    print_info "插件编译完成"
}

# 启动后端服务
start_backend() {
    print_step "启动后端服务..."

    cd host/backend

    # 设置环境变量
    export SERVER_ADDRESS=0.0.0.0:3000
    export DATABASE_URL=sqlite:./host.db
    export PLUGINS_DIR=../../plugins
    export LOG_LEVEL=info

    # 启动后端
    cargo run &
    BACKEND_PID=$!

    cd ../..

    # 等待后端启动
    print_info "等待后端启动..."
    sleep 5

    # 检查后端是否启动成功
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_info "后端服务启动成功 (PID: $BACKEND_PID)"
    else
        print_error "后端服务启动失败"
        exit 1
    fi
}

# 启动前端服务
start_frontend() {
    print_step "启动前端服务..."

    cd host/frontend

    # 检查 node_modules 是否存在
    if [ ! -d "node_modules" ]; then
        print_info "安装前端依赖..."
        npm install
    fi

    # 启动前端
    npm run dev &
    FRONTEND_PID=$!

    cd ../..

    # 等待前端启动
    print_info "等待前端启动..."
    sleep 5

    # 检查前端是否启动成功
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        print_info "前端服务启动成功 (PID: $FRONTEND_PID)"
    else
        print_warning "前端可能还在启动中"
    fi
}

# 显示访问信息
show_info() {
    echo ""
    echo "===================================="
    echo "  服务已启动"
    echo "===================================="
    echo ""
    echo -e "${GREEN}后端服务:${NC}  http://localhost:3000"
    echo -e "${GREEN}前端服务:${NC}  http://localhost:5173"
    echo ""
    echo "可用端点:"
    echo "  GET  /health                 - 健康检查"
    echo "  GET  /api/plugins            - 列出所有插件"
    echo "  GET  /api/plugins/menus      - 获取所有菜单"
    echo ""
    echo "按 Ctrl+C 停止所有服务"
    echo "===================================="
    echo ""
}

# 主函数
main() {
    echo ""
    echo "===================================="
    echo "  宿主系统开发环境"
    echo "===================================="
    echo ""

    check_dependencies
    install_backend
    install_frontend
    build_plugin
    start_backend
    start_frontend
    show_info

    # 等待进程
    wait
}

# 运行主函数
main
