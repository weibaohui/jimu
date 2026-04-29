import { useState, useEffect } from 'react'
import { Drawer, Descriptions, Tabs, Spin, Space, Button } from 'antd'
import {
  InfoCircleOutlined,
  FileTextOutlined,
  DashboardOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { Plugin, PluginLog, SandboxStats } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'
import { PluginLogs } from './PluginLogs'
import { PluginSandboxStats } from './PluginSandboxStats'

interface PluginDetailDrawerProps {
  visible: boolean
  plugin: Plugin | null
  onClose: () => void
  onActionComplete: () => void
}

export function PluginDetailDrawer({
  visible,
  plugin,
  onClose,
  onActionComplete,
}: PluginDetailDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<PluginLog[]>([])
  const [sandboxStats, setSandboxStats] = useState<SandboxStats | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  const loadData = async () => {
    if (!plugin) return

    try {
      setLoading(true)

      const [logsData, statsData] = await Promise.all([
        pluginApi.getPluginLogs(plugin.name),
        pluginApi.getSandboxStats(plugin.name),
      ])

      setLogs(logsData)
      setSandboxStats(statsData)
    } catch (error) {
      console.error('Failed to load plugin details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible && plugin) {
      loadData()
    }
  }, [visible, plugin])

  const handleRefresh = () => {
    loadData()
    onActionComplete()
  }

  if (!plugin) return null

  return (
    <Drawer
      title={`插件详情 - ${plugin.name}`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={800}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            刷新
          </Button>
        </Space>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: (
              <span>
                <InfoCircleOutlined />
                基本信息
              </span>
            ),
            children: (
              <Spin spinning={loading}>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="插件名称">{plugin.name}</Descriptions.Item>
                  <Descriptions.Item label="版本">{plugin.version}</Descriptions.Item>
                  <Descriptions.Item label="描述">
                    {plugin.description || '暂无描述'}
                  </Descriptions.Item>
                  <Descriptions.Item label="作者">{plugin.author}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <PluginStatusBadge status={plugin.status} />
                  </Descriptions.Item>
                  <Descriptions.Item label="是否启用">
                    {plugin.enabled ? '是' : '否'}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {new Date(plugin.created_at).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="更新时间">
                    {new Date(plugin.updated_at).toLocaleString()}
                  </Descriptions.Item>
                  {plugin.manifest && (
                    <>
                      <Descriptions.Item label="最小主机版本">
                        {plugin.manifest.min_host_version || '未指定'}
                      </Descriptions.Item>
                      <Descriptions.Item label="依赖">
                        {plugin.manifest.dependencies?.length
                          ? plugin.manifest.dependencies.join(', ')
                          : '无'}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </Spin>
            ),
          },
          {
            key: 'logs',
            label: (
              <span>
                <FileTextOutlined />
                运行日志
              </span>
            ),
            children: (
              <PluginLogs
                pluginName={plugin.name}
                logs={logs}
                loading={loading}
                onRefresh={handleRefresh}
              />
            ),
          },
          {
            key: 'sandbox',
            label: (
              <span>
                <DashboardOutlined />
                沙盒统计
              </span>
            ),
            children: (
              <PluginSandboxStats
                pluginName={plugin.name}
                stats={sandboxStats}
                loading={loading}
                onRefresh={handleRefresh}
              />
            ),
          },
        ]}
      />
    </Drawer>
  )
}

// 导入状态标签组件
import { PluginStatusBadge } from './PluginStatusBadge'
