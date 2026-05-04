import { useState, useEffect } from 'react'
import { Table, Button, Space, Card, Row, Col, Statistic } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { PluginStatus } from '../../types/plugin'
import type { Plugin } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'
import { useMenu } from '../../contexts/MenuContext'
import { PluginStatusBadge } from './PluginStatusBadge'
import { PluginControlButtons } from './PluginControlButtons'
import { PluginUploadModal } from './PluginUploadModal'
import { PluginDetailDrawer } from './PluginDetailDrawer'

interface PluginListProps {
  onActionComplete?: () => void
}

export function PluginList({ onActionComplete }: PluginListProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const { refreshPluginMenus } = useMenu()

  const loadPlugins = async () => {
    try {
      setLoading(true)
      const data = await pluginApi.listPlugins()
      setPlugins(data)
    } catch (error) {
      console.error('Failed to load plugins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlugins()
  }, [])

  const handleActionComplete = async () => {
    loadPlugins()
    await refreshPluginMenus()
    onActionComplete?.()
  }

  const handleShowDetail = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setDetailDrawerVisible(true)
  }

  const columns: ColumnsType<Plugin> = [
    {
      title: '插件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Plugin) => (
        <Space direction="vertical" size={0}>
          <strong>{text}</strong>
          <span style={{ fontSize: '12px', color: '#999' }}>{record.version}</span>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: PluginStatus) => <PluginStatusBadge status={status} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: Plugin) => (
        <Space size="small">
          <PluginControlButtons
            pluginName={record.name}
            status={record.status}
            onActionComplete={handleActionComplete}
          />
          <Button
            type="text"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => handleShowDetail(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: plugins.length,
    running: plugins.filter((p) => p.status === PluginStatus.Running).length,
    enabled: plugins.filter((p) => p.enabled).length,
    disabled: plugins.filter((p) => !p.enabled).length,
  }

  return (
    <div>
      <Card
        title="插件管理"
        extra={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setUploadModalVisible(true)}
            >
              上传插件
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadPlugins} loading={loading}>
              刷新
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总插件数" value={stats.total} />
          </Col>
          <Col span={6}>
            <Statistic
              title="运行中"
              value={stats.running}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已启用"
              value={stats.enabled}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已禁用"
              value={stats.disabled}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={plugins}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个插件`,
          }}
        />
      </Card>

      <PluginUploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onSuccess={handleActionComplete}
      />

      <PluginDetailDrawer
        visible={detailDrawerVisible}
        plugin={selectedPlugin}
        onClose={() => {
          setDetailDrawerVisible(false)
          setSelectedPlugin(null)
        }}
        onActionComplete={handleActionComplete}
      />
    </div>
  )
}
