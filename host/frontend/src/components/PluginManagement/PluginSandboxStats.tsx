import { useEffect, useState } from 'react'
import { Card, Statistic, Row, Col, Progress, Space, Button, List, Tag, Empty, Typography, Alert } from 'antd'
import {
  ReloadOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { SandboxStats, SandboxViolation } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'

const { Text } = Typography

interface PluginSandboxStatsProps {
  pluginName: string
  stats: SandboxStats | null
  loading: boolean
  onRefresh: () => void
}

export function PluginSandboxStats({
  pluginName,
  stats,
  loading,
  onRefresh,
}: PluginSandboxStatsProps) {
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

  const handleResetStats = async () => {
    try {
      await pluginApi.resetSandboxStats(pluginName)
      onRefresh()
    } catch (error) {
      console.error('Failed to reset stats:', error)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const formatSeconds = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(2)}秒`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = (seconds % 60).toFixed(2)
    return `${minutes}分 ${remainingSeconds}秒`
  }

  const violationTypeConfig = {
    memory_limit: { color: 'red', label: '内存超限' },
    cpu_limit: { color: 'red', label: 'CPU超限' },
    forbidden_file: { color: 'orange', label: '非法文件访问' },
    forbidden_network: { color: 'orange', label: '非法网络访问' },
    forbidden_syscall: { color: 'orange', label: '非法系统调用' },
  }

  const renderViolation = (violation: SandboxViolation) => {
    const config = violationTypeConfig[violation.type]

    return (
      <List.Item key={violation.id}>
        <Card
          size="small"
          style={{ width: '100%' }}
          bodyStyle={{ padding: '12px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Space>
              <Tag color={config.color} icon={<WarningOutlined />}>
                {config.label}
              </Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(violation.timestamp).toLocaleString()}
              </Text>
            </Space>
            <Text>{violation.message}</Text>
            {violation.context && Object.keys(violation.context).length > 0 && (
              <Card
                size="small"
                title="上下文信息"
                style={{ marginTop: '8px' }}
                bodyStyle={{ padding: '8px' }}
              >
                <pre style={{ fontSize: '12px', margin: 0 }}>
                  {JSON.stringify(violation.context, null, 2)}
                </pre>
              </Card>
            )}
          </Space>
        </Card>
      </List.Item>
    )
  }

  if (!stats) {
    return <Empty description="暂无统计数据" />
  }

  const memoryPercent = (stats.memory_usage / stats.memory_limit) * 100
  const cpuPercent = (stats.cpu_time / stats.cpu_limit) * 100

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
        >
          刷新统计
        </Button>
        <Button
          icon={<ReloadOutlined />}
          type={autoRefresh ? 'primary' : 'default'}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={handleResetStats}
          danger
        >
          重置统计
        </Button>
      </Space>

      {stats.violations && stats.violations.length > 0 && (
        <Alert
          message="检测到沙盒违规"
          description={`共 ${stats.violations.length} 次违规记录`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <Statistic
              title="内存使用"
              value={stats.memory_usage}
              formatter={(value) => formatBytes(Number(value))}
              suffix={`/ ${formatBytes(stats.memory_limit)}`}
            />
            <Progress
              percent={memoryPercent}
              status={memoryPercent > 90 ? 'exception' : memoryPercent > 70 ? 'active' : 'success'}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Statistic
              title="CPU 时间"
              value={stats.cpu_time}
              formatter={(value) => formatSeconds(Number(value))}
              suffix={`/ ${formatSeconds(stats.cpu_limit)}`}
            />
            <Progress
              percent={cpuPercent}
              status={cpuPercent > 90 ? 'exception' : cpuPercent > 70 ? 'active' : 'success'}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Statistic
              title="操作次数"
              value={stats.operation_count}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="违规记录" style={{ marginTop: 16 }}>
        {!stats.violations || stats.violations.length === 0 ? (
          <Empty description="暂无违规记录" />
        ) : (
          <List
            dataSource={stats.violations}
            renderItem={renderViolation}
            style={{ maxHeight: 400, overflowY: 'auto' }}
          />
        )}
      </Card>
    </div>
  )
}
