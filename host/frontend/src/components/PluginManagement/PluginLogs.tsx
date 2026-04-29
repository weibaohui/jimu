import { useEffect, useState } from 'react'
import { List, Tag, Space, Button, Empty, Typography, Card, Popconfirm } from 'antd'
import {
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import type { PluginLog } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'

const { Text, Paragraph } = Typography

interface PluginLogsProps {
  pluginName: string
  logs: PluginLog[]
  loading: boolean
  onRefresh: () => void
}

const logLevelConfig = {
  debug: { color: 'default', icon: <InfoCircleOutlined />, label: 'DEBUG' },
  info: { color: 'blue', icon: <CheckCircleOutlined />, label: 'INFO' },
  warn: { color: 'orange', icon: <ExclamationCircleOutlined />, label: 'WARN' },
  error: { color: 'red', icon: <CloseCircleOutlined />, label: 'ERROR' },
}

export function PluginLogs({ pluginName, logs, loading, onRefresh }: PluginLogsProps) {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        onRefresh()
      }, 3000) // 每3秒刷新一次
      setRefreshInterval(interval)
    } else if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [autoRefresh])

  const handleClearLogs = async () => {
    try {
      await pluginApi.clearPluginLogs(pluginName)
      onRefresh()
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  const formatLogEntry = (log: PluginLog) => {
    const config = logLevelConfig[log.level]

    return (
      <List.Item key={log.id}>
        <Card
          size="small"
          style={{ width: '100%' }}
          bodyStyle={{ padding: '12px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Space>
              <Tag color={config.color} icon={config.icon}>
                {config.label}
              </Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(log.timestamp).toLocaleString()}
              </Text>
            </Space>
            <Paragraph code style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {log.message}
            </Paragraph>
            {log.context && Object.keys(log.context).length > 0 && (
              <Card
                size="small"
                title="上下文信息"
                style={{ marginTop: '8px' }}
                bodyStyle={{ padding: '8px' }}
              >
                <pre style={{ fontSize: '12px', margin: 0 }}>
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              </Card>
            )}
          </Space>
        </Card>
      </List.Item>
    )
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
        >
          刷新日志
        </Button>
        <Button
          icon={<ReloadOutlined />}
          type={autoRefresh ? 'primary' : 'default'}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
        </Button>
        <Popconfirm
          title="确定要清空所有日志吗？"
          onConfirm={handleClearLogs}
          okText="确定"
          cancelText="取消"
        >
          <Button danger icon={<DeleteOutlined />}>
            清空日志
          </Button>
        </Popconfirm>
      </Space>

      {logs.length === 0 ? (
        <Empty description="暂无日志" />
      ) : (
        <List
          loading={loading}
          dataSource={logs}
          renderItem={formatLogEntry}
          style={{ maxHeight: 500, overflowY: 'auto' }}
        />
      )}
    </div>
  )
}
