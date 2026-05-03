import { Button, Space, Popconfirm, Tooltip } from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { PluginStatus, PluginTransition } from '../../types/plugin'
import { pluginApi } from '../../services/pluginApi'

interface PluginControlButtonsProps {
  pluginName: string
  status: PluginStatus
  onActionComplete: () => void
}

// 定义状态转换规则
const transitionRules: Record<PluginStatus, PluginTransition[]> = {
  [PluginStatus.Uninstalled]: [], // 未安装的插件无法操作
  [PluginStatus.Installed]: [PluginTransition.Enable, PluginTransition.Uninstall],
  [PluginStatus.Enabled]: [PluginTransition.Start, PluginTransition.Disable, PluginTransition.Uninstall],
  [PluginStatus.Disabled]: [PluginTransition.Enable, PluginTransition.Uninstall],
  [PluginStatus.Running]: [PluginTransition.Stop, PluginTransition.Reload, PluginTransition.Disable],
  [PluginStatus.Stopped]: [PluginTransition.Start, PluginTransition.Disable, PluginTransition.Uninstall],
  [PluginStatus.Loading]: [], // 加载中无法操作
  [PluginStatus.Unloading]: [], // 卸载中无法操作
  [PluginStatus.Error]: [PluginTransition.Reload, PluginTransition.Uninstall], // 错误状态可以重载或卸载
}

const actionConfig: Record<
  PluginTransition,
  { label: string; icon: React.ReactNode; danger?: boolean; confirm?: string }
> = {
  [PluginTransition.Install]: { label: '安装', icon: <CheckCircleOutlined /> },
  [PluginTransition.Uninstall]: {
    label: '卸载',
    icon: <DeleteOutlined />,
    danger: true,
    confirm: '确定要卸载此插件吗？此操作不可恢复。',
  },
  [PluginTransition.Enable]: { label: '启用', icon: <CheckCircleOutlined /> },
  [PluginTransition.Disable]: { label: '禁用', icon: <PoweroffOutlined /> },
  [PluginTransition.Start]: { label: '启动', icon: <PlayCircleOutlined /> },
  [PluginTransition.Stop]: {
    label: '停止',
    icon: <PauseCircleOutlined />,
    confirm: '确定要停止此插件吗？',
  },
  [PluginTransition.Reload]: { label: '重载', icon: <ReloadOutlined /> },
}

export function PluginControlButtons({
  pluginName,
  status,
  onActionComplete,
}: PluginControlButtonsProps) {
  const availableActions = transitionRules[status] || []
  const loading = status === PluginStatus.Loading || status === PluginStatus.Unloading

  const handleAction = async (action: PluginTransition) => {
    try {
      let response

      switch (action) {
        case PluginTransition.Enable:
          response = await pluginApi.enablePlugin(pluginName)
          break
        case PluginTransition.Disable:
          response = await pluginApi.disablePlugin(pluginName)
          break
        case PluginTransition.Start:
          response = await pluginApi.startPlugin(pluginName)
          break
        case PluginTransition.Stop:
          response = await pluginApi.stopPlugin(pluginName)
          break
        case PluginTransition.Reload:
          response = await pluginApi.reloadPlugin(pluginName)
          break
        case PluginTransition.Uninstall:
          response = await pluginApi.uninstallPlugin(pluginName)
          break
        default:
          return
      }

      if (response.success) {
        onActionComplete()
      }
    } catch (error) {
      console.error(`Failed to ${action} plugin:`, error)
    }
  }

  if (availableActions.length === 0) {
    return <span style={{ color: '#999' }}>无可用操作</span>
  }

  return (
    <Space size="small">
      {availableActions.map((action) => {
        const config = actionConfig[action]

        if (config.confirm) {
          return (
            <Popconfirm
              key={action}
              title={config.confirm}
              onConfirm={() => handleAction(action)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                icon={config.icon}
                danger={config.danger}
                disabled={loading}
              >
                {config.label}
              </Button>
            </Popconfirm>
          )
        }

        return (
          <Tooltip key={action} title={config.label}>
            <Button
              type="text"
              size="small"
              icon={config.icon}
              danger={config.danger}
              disabled={loading}
              onClick={() => handleAction(action)}
            >
              {config.label}
            </Button>
          </Tooltip>
        )
      })}
    </Space>
  )
}
