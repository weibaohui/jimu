import { useState } from 'react'
import { Tabs } from 'antd'
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons'
import { PluginList } from './PluginList'
import { PluginSettings } from './PluginSettings'

export function PluginManagement() {
  const [activeTab, setActiveTab] = useState('list')

  const tabs = [
    {
      key: 'list',
      label: (
        <span>
          <AppstoreOutlined />
          插件列表
        </span>
      ),
      children: <PluginList onActionComplete={() => {}} />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          系统设置
        </span>
      ),
      children: <PluginSettings />,
    },
  ]

  return (
    <div style={{ padding: '0' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
        size="large"
      />
    </div>
  )
}
