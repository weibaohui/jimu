import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { usePlugin } from '../../hooks/usePlugin'

export function PluginLoader() {
  const location = useLocation()
  const [currentPlugin, setCurrentPlugin] = useState<string | null>(null)
  const [routeChecked, setRouteChecked] = useState(false)
  const { component: PluginComponent, loading, error } = usePlugin(currentPlugin || '')

  useEffect(() => {
    checkCurrentRoute()
  }, [location.pathname])

  const checkCurrentRoute = async () => {
    setRouteChecked(false)
    try {
      const response = await fetch('/api/plugins/check-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: location.pathname }),
      })

      const data = await response.json()
      setCurrentPlugin(data.pluginName || null)
    } catch (error) {
      console.error('Failed to check route:', error)
      setCurrentPlugin(null)
    } finally {
      setRouteChecked(true)
    }
  }

  // 还没检查完路由
  if (!routeChecked) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
  }

  // 不是插件路由
  if (!currentPlugin) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>欢迎使用宿主系统</div>
  }

  // 正在加载插件组件
  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} tip="加载插件中..." />
  }

  // 加载失败
  if (error) {
    return (
      <Alert
        type="error"
        message="插件加载失败"
        description={error.message}
        showIcon
        style={{ margin: 24 }}
      />
    )
  }

  // 渲染插件组件
  if (PluginComponent) {
    return <PluginComponent />
  }

  return (
    <Alert
      type="warning"
      message="插件未导出有效组件"
      description={`插件 "${currentPlugin}" 未提供前端界面`}
      showIcon
      style={{ margin: 24 }}
    />
  )
}
