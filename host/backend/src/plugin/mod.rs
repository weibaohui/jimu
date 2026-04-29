//! 插件系统 - 接口定义
//!
//! 现在使用共享接口包 jimu-plugin-interface

pub mod traits;
pub mod loader;
pub mod manager;
pub mod sandbox;
pub mod log_store;

pub use manager::PluginManager;
pub use loader::PluginState;
