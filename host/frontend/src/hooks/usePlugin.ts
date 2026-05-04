import { useState, useEffect, useRef, type ComponentType } from 'react'
import * as React from 'react'
import * as antd from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export function usePlugin(pluginName: string) {
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!pluginName) {
      setComponent(null)
      setLoading(false)
      setError(null)
      return
    }

    const loadPlugin = async () => {
      try {
        setLoading(true)
        setError(null)

        const pluginPath = pluginName.replace(/^\//, '')
        const scriptUrl = `/plugins/${pluginPath}/frontend/assets/main.js`
        
        // 检查是否已经加载过
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`)
        
        if (!existingScript) {
          // 创建 script 元素来加载插件
          const script = document.createElement('script')
          script.src = scriptUrl
          script.type = 'text/javascript'

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve()
            script.onerror = () => reject(new Error(`Failed to load plugin: ${pluginPath}`))
            document.head.appendChild(script)
          })
        } else {
          // 等待一下确保脚本已经执行
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        if (!mountedRef.current) return

        // 从 window.plugins 获取工厂函数
        const plugins = (window as any).plugins || {}
        const factory = plugins[pluginPath]
        
        if (typeof factory !== 'function') {
          throw new Error(`Plugin ${pluginName} does not export a factory function`)
        }

        // 传递 React 和 antd 实例给工厂函数
        const icons = { PlusOutlined, EditOutlined, DeleteOutlined }
        const CreatedComponent = factory(React, antd, icons)
        
        if (!mountedRef.current) return

        setComponent(() => CreatedComponent)
        setLoading(false)
      } catch (err) {
        if (!mountedRef.current) return
        setError(err as Error)
        setLoading(false)
      }
    }

    loadPlugin()
  }, [pluginName])

  return { component: Component, loading, error }
}
