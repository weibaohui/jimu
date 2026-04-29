import { useState, useEffect } from 'react'

export function usePlugin(pluginName: string) {
  const [component, setComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPlugin = async () => {
      try {
        setLoading(true)
        setError(null)

        // 动态导入插件的 JS 文件
        const module = await import(
          /* @vite-ignore */
          `/plugins/${pluginName}/frontend/assets/main.js`
        )

        // 获取插件导出的默认组件
        if (module.default) {
          setComponent(() => module.default)
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
