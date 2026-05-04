import { useState, useEffect } from 'react'
import * as React from 'react'
import * as antd from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export function usePlugin(pluginName: string) {
  const [component, setComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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
        const module = await import(
          /* @vite-ignore */
          `/plugins/${pluginPath}/frontend/assets/main.js`
        )

        if (typeof module.default === 'function') {
          // 传递 React、antd 和图标给工厂函数
          const icons = { PlusOutlined, EditOutlined, DeleteOutlined }
          const Component = module.default(React, antd, icons)
          if (typeof Component === 'function') {
            setComponent(Component)
          } else {
            throw new Error('Plugin factory function did not return a component')
          }
        } else if (module.default) {
          setComponent(module.default)
        } else {
          throw new Error('Plugin does not export a default component')
        }

        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    loadPlugin()
  }, [pluginName])

  return { component, loading, error }
}
