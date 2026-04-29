//! 插件系统 - 接口定义
//!
//! 现在使用共享接口包 jimu-plugin-interface

pub use jimu_plugin_interface::*;
use jimu_plugin_interface::Plugin as BasePlugin;

/// 扩展插件接口，添加宿主特有的方法
#[async_trait::async_trait]
pub trait Plugin: BasePlugin {
    /// 获取插件状态（可选）
    async fn get_status(&self) -> PluginStatus {
        PluginStatus::Running
    }
}

/// 插件状态
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum PluginStatus {
    Loading,
    Running,
    Unloading,
    Error(String),
}
