# ─────────────────────────────────────────────────────
#  Jimu 插件编译系统
#  用法:
#    make list                              列出所有已安装插件
#    make build-plugin NAME=<插件名>        编译指定插件，输出到 dist/
#    make build-plugin NAME=user-management FRONTEND_ONLY=true   只编译前端
#    make build-all                         编译全部插件
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
