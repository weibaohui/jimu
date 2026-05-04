import { useState, useEffect } from 'react'

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

        // 去除 pluginName 可能带的前导斜杠
        const pluginPath = pluginName.replace(/^\//, '')
        
        // 使用动态 import 加载插件
        const module = await import(
          /* @vite-ignore */
          `/plugins/${pluginPath}/frontend/assets/main.js`
        )

        // 如果导出的是工厂函数，调用它来获取组件
        if (typeof module.default === 'function') {
          const Component = module.default()
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
