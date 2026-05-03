import { Tag } from 'antd'
import { PluginStatus } from '../../types/plugin'

interface PluginStatusBadgeProps {
  status: PluginStatus
}

const statusConfig: Record<PluginStatus, { color: string; text: string }> = {
  [PluginStatus.Uninstalled]: { color: 'default', text: '未安装' },
  [PluginStatus.Installed]: { color: 'default', text: '已安装' },
  [PluginStatus.Enabled]: { color: 'blue', text: '已启用' },
  [PluginStatus.Disabled]: { color: 'orange', text: '已禁用' },
  [PluginStatus.Running]: { color: 'green', text: '运行中' },
  [PluginStatus.Stopped]: { color: 'red', text: '已停止' },
  [PluginStatus.Loading]: { color: 'blue', text: '加载中' },
  [PluginStatus.Unloading]: { color: 'orange', text: '卸载中' },
  [PluginStatus.Error]: { color: 'error', text: '错误' },
}

export function PluginStatusBadge({ status }: PluginStatusBadgeProps) {
  const config = statusConfig[status]
  if (!config) {
    return <Tag color="default">{String(status || 'unknown')}</Tag>
  }
  return <Tag color={config.color}>{config.text}</Tag>
}
