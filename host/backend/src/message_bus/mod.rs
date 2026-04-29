//! 消息总线 - 后端插件间通信

use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::error::Error;
use jimu_plugin_interface::MessageBus as MessageBusTrait;

/// 订阅信息
pub struct Subscription {
    pub id: String,
    pub callback: Box<dyn Fn(&[u8]) + Send + Sync>,
}

/// 消息总线
pub struct MessageBus {
    subscribers: Arc<RwLock<HashMap<String, Vec<Subscription>>>>,
}

impl MessageBus {
    pub fn new() -> Self {
        Self {
            subscribers: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// 发布消息
    pub fn publish_sync(&self, topic: &str, payload: &[u8])
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        let subscribers = self.subscribers.read().unwrap();

        if let Some(subs) = subscribers.get(topic) {
            for sub in subs {
                (sub.callback)(payload);
            }
        }

        Ok(())
    }

    /// 订阅消息
    pub fn subscribe_sync(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send + Sync>)
        -> Result<String, Box<dyn Error + Send + Sync>>
    {
        let subscription_id = uuid::Uuid::new_v4().to_string();
        let subscription = Subscription {
            id: subscription_id.clone(),
            callback,
        };

        self.subscribers.write().unwrap()
            .entry(topic.to_string())
            .or_insert_with(Vec::new)
            .push(subscription);

        Ok(subscription_id)
    }

    /// 取消订阅
    pub fn unsubscribe_sync(&self, subscription_id: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        let mut subscribers = self.subscribers.write().unwrap();

        for (_, subs) in subscribers.iter_mut() {
            subs.retain(|s| s.id != subscription_id);
        }

        Ok(())
    }

    pub async fn publish(&self, topic: &str, payload: &[u8])
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        self.publish_sync(topic, payload)
    }

    pub async fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send + Sync>)
        -> Result<String, Box<dyn Error + Send + Sync>>
    {
        self.subscribe_sync(topic, callback)
    }

    pub async fn unsubscribe(&self, subscription_id: &str)
        -> Result<(), Box<dyn Error + Send + Sync>>
    {
        self.unsubscribe_sync(subscription_id)
    }
}

impl Default for MessageBus {
    fn default() -> Self {
        Self::new()
    }
}

impl MessageBusTrait for MessageBus {
    fn publish(&self, topic: &str, payload: &[u8])
        -> std::result::Result<(), Box<dyn Error + Send + Sync>>
    {
        self.publish_sync(topic, payload)
    }

    fn subscribe(&self, topic: &str, callback: Box<dyn Fn(&[u8]) + Send + Sync>)
        -> std::result::Result<String, Box<dyn Error + Send + Sync>>
    {
        self.subscribe_sync(topic, callback)
    }

    fn unsubscribe(&self, subscription_id: &str)
        -> std::result::Result<(), Box<dyn Error + Send + Sync>>
    {
        self.unsubscribe_sync(subscription_id)
    }
}
