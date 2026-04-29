import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spin } from 'antd'

export function PluginLoader() {
  const location = useLocation()
  const [currentPlugin, setCurrentPlugin] = useState<string | null>(null)

  useEffect(() => {
    // 检查当前路径是否属于某个插件
    checkCurrentRoute()
  }, [location.pathname])

  const checkCurrentRoute = async () => {
    try {
      const response = await fetch('/api/plugins/check-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: location.pathname }),
      })

      const data = await response.json()
      if (data.pluginName) {
        setCurrentPlugin(data.pluginName)
      } else {
        setCurrentPlugin(null)
      }
    } catch (error) {
      console.error('Failed to check route:', error)
      setCurrentPlugin(null)
    }
  }

  if (!currentPlugin) {
    return <div className="dashboard">欢迎使用宿主系统</div>
  }

  // TODO: 实现动态加载插件组件
  return <Spin size="large" />
}
