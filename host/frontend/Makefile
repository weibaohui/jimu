PID_DIR := $(HOME)/.jimu
BACKEND_DIR := $(shell cd .. && pwd)/backend
FRONTEND_DIR := $(shell pwd)
BACKEND_PID := $(PID_DIR)/server.pid
FRONTEND_PID := $(PID_DIR)/frontend.pid

# ── 安装依赖 ──────────────────────────────────────

.PHONY: setup
setup:
	@echo "=== 安装后端依赖 ==="
	cd $(BACKEND_DIR) && cargo fetch
	@echo "=== 安装前端依赖 ==="
	cd $(FRONTEND_DIR) && npm install

# ── 启动 ──────────────────────────────────────────

.PHONY: dev
dev: stop
	@mkdir -p $(PID_DIR)
	@echo "=== 启动后端 (Rust) ==="
	cd $(BACKEND_DIR) && nohup cargo run > /tmp/jimu-server.log 2>&1 &
	@echo $$! > $(BACKEND_PID)
	@echo "后端 PID: $$(cat $(BACKEND_PID))"
	@echo "=== 启动前端 (Vite) ==="
	cd $(FRONTEND_DIR) && nohup npm run dev -- --port 5188 > /tmp/jimu-frontend.log 2>&1 &
	@echo $$! > $(FRONTEND_PID)
	@echo "前端 PID: $$(cat $(FRONTEND_PID))"
	@echo "=== 启动完成 ==="
	@echo "后端日志: tail -f /tmp/jimu-server.log"
	@echo "前端日志: tail -f /tmp/jimu-frontend.log"

# ── 停止 ──────────────────────────────────────────

.PHONY: stop
stop:
	@echo "=== 停止后端 ==="
	@if [ -f $(BACKEND_PID) ]; then \
		kill "$$(cat $(BACKEND_PID))" 2>/dev/null && echo "后端已停止" || echo "后端进程不存在"; \
		rm -f $(BACKEND_PID); \
	else \
		echo "后端 PID 文件不存在"; \
	fi
	@echo "=== 停止前端 ==="
	@if [ -f $(FRONTEND_PID) ]; then \
		kill "$$(cat $(FRONTEND_PID))" 2>/dev/null && echo "前端已停止" || echo "前端进程不存在"; \
		rm -f $(FRONTEND_PID); \
	else \
		echo "前端 PID 文件不存在"; \
	fi
	@echo "=== 全部停止 ==="

# ── 仅后端 ────────────────────────────────────────

.PHONY: dev-server
dev-server: stop-server
	@mkdir -p $(PID_DIR)
	@echo "=== 启动后端 (Rust) ==="
	cd $(BACKEND_DIR) && nohup cargo run > /tmp/jimu-server.log 2>&1 &
	@echo $$! > $(BACKEND_PID)
	@echo "后端 PID: $$(cat $(BACKEND_PID))"

.PHONY: stop-server
stop-server:
	@echo "=== 停止后端 ==="
	@if [ -f $(BACKEND_PID) ]; then \
		kill "$$(cat $(BACKEND_PID))" 2>/dev/null && echo "后端已停止" || echo "后端进程不存在"; \
		rm -f $(BACKEND_PID); \
	else \
		echo "后端 PID 文件不存在"; \
	fi

# ── 仅前端 ────────────────────────────────────────

.PHONY: dev-frontend
dev-frontend: stop-frontend
	@mkdir -p $(PID_DIR)
	@echo "=== 启动前端 (Vite) ==="
	cd $(FRONTEND_DIR) && nohup npm run dev -- --port 5188 > /tmp/jimu-frontend.log 2>&1 &
	@echo $$! > $(FRONTEND_PID)
	@echo "前端 PID: $$(cat $(FRONTEND_PID))"

.PHONY: stop-frontend
stop-frontend:
	@echo "=== 停止前端 ==="
	@if [ -f $(FRONTEND_PID) ]; then \
		kill "$$(cat $(FRONTEND_PID))" 2>/dev/null && echo "前端已停止" || echo "前端进程不存在"; \
		rm -f $(FRONTEND_PID); \
	else \
		echo "前端 PID 文件不存在"; \
	fi

# ── 其它 ──────────────────────────────────────────

.PHONY: logs
logs:
	@echo "=== 后端日志 ==="
	@tail -20 /tmp/jimu-server.log 2>/dev/null || echo "暂无日志"
	@echo ""
	@echo "=== 前端日志 ==="
	@tail -20 /tmp/jimu-frontend.log 2>/dev/null || echo "暂无日志"

.PHONY: logs-follow
logs-follow:
	@echo "按 Ctrl+C 退出"
	tail -f /tmp/jimu-server.log /tmp/jimu-frontend.log

.PHONY: ps
ps:
	@echo "后端 PID: $$([ -f $(BACKEND_PID) ] && cat $(BACKEND_PID) || echo '未运行')"
	@echo "前端 PID: $$([ -f $(FRONTEND_PID) ] && cat $(FRONTEND_PID) || echo '未运行')"