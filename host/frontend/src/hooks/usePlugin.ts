import { useState, useEffect, useCallback, type ComponentType } from 'react'
import * as React from 'react'
import * as antd from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export function usePlugin(pluginName: string) {
  const [factory, setFactory] = useState<((React: any, antd: any, icons: any) => ComponentType) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!pluginName) {
      setFactory(null)
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
        if (existingScript) {
          // 等待一下确保脚本已经执行
          await new Promise(resolve => setTimeout(resolve, 100))
        } else {
          // 创建 script 元素来加载 IIFE 插件
          const script = document.createElement('script')
          script.src = scriptUrl
          script.type = 'text/javascript'

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve()
            script.onerror = () => reject(new Error(`Failed to load plugin: ${pluginPath}`))
            document.head.appendChild(script)
          })
        }

        // 从全局变量获取工厂函数
        const pluginNameCamel = pluginPath
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('') + 'Plugin'
        
        const pluginModule = (window as any)[pluginNameCamel]
        
        if (pluginModule && typeof pluginModule.default === 'function') {
          setFactory(pluginModule.default)
        } else {
          throw new Error(`Plugin ${pluginName} does not export a factory function`)
        }

        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    loadPlugin()
  }, [pluginName])

  const createComponent = useCallback(() => {
    if (!factory) return null
    
    const icons = { PlusOutlined, EditOutlined, DeleteOutlined }
    const Component = factory(React, antd, icons)
    return Component
  }, [factory])

  return { createComponent, loading, error }
}
