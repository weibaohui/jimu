# ─────────────────────────────────────────────────────
#  Jimu 插件编译系统
#
#  环境:
#    make setup     安装 portless + 前后端依赖（首次运行）
#
#  开发:
#    make dev       启动开发环境（Portless HTTPS）
#                   自动编译插件 → dist/*.plugin → 后端从 dist/ 加载
#                   前端: https://jimu-app.localhost
#                   后端: https://jimu-api.localhost
#
#  插件构建:
#    make list                              列出所有已安装插件
#    make build-plugin NAME=<插件名>        编译指定插件，输出到 dist/
#    make build-plugin NAME=user-management FRONTEND_ONLY=true   只编译前端
#    make build-all                         编译全部插件
#
#  清理:
#    make clean                             清理构建产物
# ─────────────────────────────────────────────────────

PLUGINS_DIR    := plugins
DIST_DIR       := dist
BUILD_TOOL     := build-tools/build-plugin.sh

# ── 列出插件 ──────────────────────────────────────────

.PHONY: list
list:
	@echo "已安装的插件:"
	@for d in $(PLUGINS_DIR)/*/; do \
		if [ -f "$$d/manifest.json" ]; then \
			name=$$(cd "$$d" && grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4); \
			version=$$(cd "$$d" && grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4); \
			echo "  $$name v$$version"; \
		fi; \
	done

# ── 编译指定插件 ──────────────────────────────────────

.PHONY: build-plugin
build-plugin:
ifndef NAME
	@echo "❌ 请指定插件名: make build-plugin NAME=user-management"
	@echo "   可用插件:"
	@ls -1 $(PLUGINS_DIR)/
	@exit 1
endif
	@mkdir -p $(DIST_DIR)
	@echo "=== 编译插件: $(NAME) ==="
	@if [ ! -d "$(PLUGINS_DIR)/$(NAME)" ]; then \
		echo "❌ 插件目录不存在: $(PLUGINS_DIR)/$(NAME)"; \
		exit 1; \
	fi
	@cd $(PLUGINS_DIR)/$(NAME) && bash ../../$(BUILD_TOOL) $(if $(FRONTEND_ONLY),-f)
	@mv $(PLUGINS_DIR)/$(NAME)/*.plugin $(DIST_DIR)/ 2>/dev/null || true
	@echo ""
	@echo "✅ 完成: $(DIST_DIR)/$(NAME)-*.plugin"
	@ls -lh $(DIST_DIR)/$(NAME)-*.plugin 2>/dev/null || true

# ── 编译全部插件 ──────────────────────────────────────

.PHONY: build-all
build-all:
	@mkdir -p $(DIST_DIR)
	@echo "=== 编译所有插件 ==="
	@for d in $(PLUGINS_DIR)/*/; do \
		if [ -f "$$d/manifest.json" ]; then \
			name=$$(cd "$$d" && grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4); \
			echo ""; \
			echo "=== 编译: $$name ==="; \
			cd "$$d" && bash ../../$(BUILD_TOOL) $(if $(FRONTEND_ONLY),-f); \
			mv *.plugin ../../$(DIST_DIR)/ 2>/dev/null || true; \
			cd -; \
		fi; \
	done
	@echo ""
	@echo "=== 编译完成 ==="
	@echo "产物目录: $(DIST_DIR)/"
	@ls -lh $(DIST_DIR)/

# ── 清理 ──────────────────────────────────────────────

.PHONY: clean
clean:
	@echo "=== 清理构建产物 ==="
	@rm -rf $(DIST_DIR)
	@rm -rf $(PLUGINS_DIR)/*/.plugin-build
	@rm -f $(PLUGINS_DIR)/*.plugin
	@echo "✅ 已清理"

# ── 环境配置 ──────────────────────────────────────────

.PHONY: setup
setup:
	@echo "=== 安装 Portless（本地 HTTPS 开发代理）==="
	@if command -v portless &> /dev/null; then \
		echo "✅ portless 已安装"; \
	else \
		npm install -g portless; \
		echo "✅ portless 安装完成"; \
	fi
	@echo ""
	@echo "=== 安装前端依赖 ==="
	@cd host/frontend && npm install
	@echo ""
	@echo "=== 安装后端依赖 ==="
	@cd host/backend && cargo check
	@echo ""
	@echo "✅ 环境就绪。运行 make dev 启动开发服务器"

# ── 开发服务器 ────────────────────────────────────────

.PHONY: dev
dev: build-dev-plugins
	@echo "=== 启动 Jimu 开发环境（Portless）==="
	@echo ""
	@echo "  前端: https://jimu-app.localhost"
	@echo "  后端: https://jimu-api.localhost"
	@echo ""
	@echo "按 Ctrl+C 停止"
	@echo ""
	@echo "[1/5] 检查 Portless 代理..."
	@if curl -sf https://jimu-app.localhost/_portless/health > /dev/null 2>&1; then \
		echo "  ✅ portless 代理已运行"; \
	else \
		echo "  🚀 启动 portless 代理..."; \
		portless proxy start > /tmp/portless-proxy.log 2>&1 & \
		sleep 3; \
		if curl -sf https://jimu-app.localhost/_portless/health > /dev/null 2>&1; then \
			echo "  ✅ portless 代理已启动"; \
		else \
			echo "  ⚠️  代理启动中，继续..."; \
		fi; \
	fi
	@echo ""
	@echo "[2/5] 清理旧进程..."
	@lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
	@echo "  ✅ 端口已清理"
	@echo ""
	@echo "[3/5] 启动后端 (0.0.0.0:3000)..."
	@cd host/backend && export DATABASE_URL=sqlite:./host.db && export PLUGINS_DIR=../../dist && export LOG_LEVEL=info && cargo run &
	@sleep 8
	@if curl -sf http://localhost:3000/health > /dev/null 2>&1; then \
		echo "  ✅ 后端已启动"; \
	else \
		echo "  ⚠️  后端可能仍在编译中，稍后重试即可"; \
	fi
	@echo ""
	@echo "[4/5] 启动前端 (Vite + Portless)..."
	@portless alias jimu-api localhost:3000 2>/dev/null || true
	@cd host/frontend && portless --force jimu-app vite

# ── 编译开发用插件（打包为 .plugin 并输出到 dist/） ──

.PHONY: build-dev-plugins
build-dev-plugins:
	@mkdir -p $(DIST_DIR)
	@echo "=== 编译并打包插件 ==="
	@for d in $(PLUGINS_DIR)/*/; do \
		if [ -f "$$d/manifest.json" ]; then \
			name=$$(cd "$$d" && grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4); \
			version=$$(cd "$$d" && grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' manifest.json | cut -d'"' -f4); \
			echo "  编译: $$name v$$version ..."; \
			cd "$$d" && bash ../../$(BUILD_TOOL) -b > /dev/null && cd - > /dev/null; \
			pkg="$$d/$$name-$$version.plugin"; \
			if [ -f "$$pkg" ]; then \
				mv "$$pkg" $(DIST_DIR)/; \
				echo "    ✅ $(DIST_DIR)/$$name-$$version.plugin"; \
			else \
				echo "    ❌ 打包失败: $$name"; \
			fi; \
			os=$$(uname -s); \
			case $$os in \
				Linux) ext="so" ;; \
				Darwin) ext="dylib" ;; \
				*) ext="dll" ;; \
			esac; \
			src=$$(find "$$d/backend/target/release" -maxdepth 1 -name "lib*.$$ext" -type f 2>/dev/null | head -1); \
			if [ -n "$$src" ] && [ -f "$$src" ]; then \
				cp "$$src" "$$d/backend/plugin.$$ext"; \
				codesign --force --sign - "$$d/backend/plugin.$$ext" 2>/dev/null || true; \
			fi; \
		fi; \
	done
	@echo ""
	@echo "产物:"
	@ls -lh $(DIST_DIR)/ 2>/dev/null || echo "  (空)"
