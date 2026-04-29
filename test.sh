#!/bin/bash

# 测试脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 统计变量
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 函数：打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

# 函数：运行测试
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local expected_status="$4"

    print_test "$name"

    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url")

    if [ "$status_code" = "$expected_status" ]; then
        print_success "$name (预期: $expected_status, 实际: $status_code)"
    else
        print_fail "$name (预期: $expected_status, 实际: $status_code)"
    fi
}

# 函数：显示测试结果
show_results() {
    echo ""
    echo "===================================="
    echo "  测试结果"
    echo "===================================="
    echo "  总测试数: $TOTAL_TESTS"
    echo -e "${GREEN}  通过: $PASSED_TESTS${NC}"
    if [ $FAILED_TESTS -gt 0 ]; then
        echo -e "${RED}  失败: $FAILED_TESTS${NC}"
    fi
    echo "===================================="
    echo ""

    if [ $FAILED_TESTS -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# 主函数
main() {
    BASE_URL="${BASE_URL:-http://localhost:3000}"

    echo ""
    echo "===================================="
    echo "  宿主系统测试"
    echo "===================================="
    echo ""
    print_info "基础 URL: $BASE_URL"
    echo ""

    # 检查服务是否运行
    print_test "检查服务是否运行"
    if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
        print_success "服务正在运行"
    else
        print_fail "服务未运行"
        show_results
    fi

    echo ""

    # 测试基础端点
    print_info "测试基础端点..."

    test_endpoint "健康检查" "GET" "$BASE_URL/health" "200"
    test_endpoint "列出所有插件" "GET" "$BASE_URL/api/plugins" "200"
    test_endpoint "获取所有菜单" "GET" "$BASE_URL/api/plugins/menus" "200"

    echo ""

    # 测试插件端点
    print_info "测试插件端点..."

    test_endpoint "获取用户管理插件" "GET" "$BASE_URL/api/plugins/user-management" "200"
    test_endpoint "获取用户列表" "GET" "$BASE_URL/api/plugins/user-management/users" "200"

    echo ""

    # 测试插件前端资源
    print_info "测试插件前端资源..."

    test_endpoint "获取插件 manifest" "GET" "$BASE_URL/plugins/user-management/manifest.json" "200"

    echo ""

    # 测试错误处理
    print_info "测试错误处理..."

    test_endpoint "获取不存在的插件" "GET" "$BASE_URL/api/plugins/non-existent" "200"
    test_endpoint "获取不存在的前端资源" "GET" "$BASE_URL/plugins/non-existent/test.js" "404"

    echo ""

    # 显示结果
    show_results
}

# 运行测试
main
