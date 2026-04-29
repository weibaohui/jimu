import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Space } from 'antd'
import {
  AppstoreOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { pluginApi } from '../../services/pluginApi'
import { PluginStatus } from '../../types/plugin'
import type { Plugin } from '../../types/plugin'

export function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    enabled: 0,
    disabled: 0,
  })
  const [recentPlugins, setRecentPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const plugins = await pluginApi.listPlugins()

      setStats({
        total: plugins.length,
        running: plugins.filter((p) => p.status === PluginStatus.Running).length,
        enabled: plugins.filter((p) => p.enabled).length,
        disabled: plugins.filter((p) => !p.enabled).length,
      })

      // 显示最近更新的5个插件
      const recent = [...plugins]
        .sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 5)
      setRecentPlugins(recent)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="总插件数"
              value={stats.total}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="运行中"
              value={stats.running}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="已启用"
              value={stats.enabled}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="已禁用"
              value={stats.disabled}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近更新" style={{ marginTop: 16 }}>
        <List
          dataSource={recentPlugins}
          renderItem={(plugin) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <strong>{plugin.name}</strong>
                    <Tag color={plugin.status === PluginStatus.Running ? 'green' : 'default'}>
                      {plugin.status}
                    </Tag>
                  </Space>
                }
                description={`${plugin.version} - ${plugin.description || '暂无描述'}`}
              />
              <div>{new Date(plugin.updated_at).toLocaleString()}</div>
            </List.Item>
          )}
          loading={loading}
        />
      </Card>
    </div>
  )
}
