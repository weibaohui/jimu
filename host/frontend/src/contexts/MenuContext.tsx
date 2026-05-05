import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  createElement,
} from 'react'
import type { MenuProps } from 'antd'
import * as antdIcons from '@ant-design/icons'

export interface MenuItem {
  key: string
  icon?: string | React.ReactNode
  label: string
  children?: MenuItem[]
  path?: string
}

interface MenuContextType {
  menuItems: MenuProps['items']
  addMenuItem: (item: MenuItem) => void
  removeMenuItem: (key: string) => void
  updateMenuItem: (key: string, item: Partial<MenuItem>) => void
  refreshPluginMenus: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([
    {
      key: '/dashboard',
      icon: createElement(antdIcons.DashboardOutlined),
      label: '仪表盘',
    },
    {
      key: '/plugins',
      icon: createElement(antdIcons.AppstoreOutlined),
      label: '插件管理',
    },
  ])

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [...(prev ?? []), convertMenuItem(item)])
  }

  const removeMenuItem = (key: string) => {
    setMenuItems((prev) => (prev ?? []).filter((item: any) => item.key !== key))
  }

  const updateMenuItem = (key: string, item: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      (prev ?? []).map((menuItem: any) => {
        if (menuItem.key === key) {
          return { ...menuItem, ...item }
        }
        return menuItem
      })
    )
  }

  const menusLoadedRef = useRef(false)

  useEffect(() => {
    if (menusLoadedRef.current) return
    menusLoadedRef.current = true

    loadPluginMenus()
  }, [])

  const loadPluginMenus = async () => {
    try {
      const pluginsResponse = await fetch('http://localhost:3000/api/plugins')
      const pluginsData = await pluginsResponse.json()
      const runningPlugins = pluginsData.plugins?.filter(
        (plugin: any) => plugin.status.toLowerCase() === 'running'
      ) || []

      const menusResponse = await fetch('http://localhost:3000/api/plugins/menus')
      const menusData = await menusResponse.json()

      if (menusData.menus && Array.isArray(menusData.menus)) {
        const runningPluginNames = runningPlugins.map((p: any) => p.name)

        const filteredMenus = menusData.menus.filter((menu: any) => {
          if (!menu || !menu.path) return false
          
          const pluginName = extractPluginNameFromPath(menu.path)
          return runningPluginNames.includes(pluginName)
        })

        const allItems: MenuItem[] = []
        filteredMenus.forEach((pluginMenu: any) => {
          allItems.push(transformBackendMenu(pluginMenu))
          
          if (pluginMenu.children && Array.isArray(pluginMenu.children)) {
            pluginMenu.children.forEach((child: any) => {
              allItems.push(transformBackendMenu(child))
            })
          }
        })
        
        setMenuItems((prev) => {
          const defaultItems = prev.filter((item: any) => 
            item.key === '/dashboard' || item.key === '/plugins'
          )
          return [...defaultItems, ...allItems.map(convertMenuItem)]
        })
      }
    } catch (error) {
      console.error('Failed to load plugin menus:', error)
    }
  }

  const refreshPluginMenus = async () => {
    try {
      const pluginsResponse = await fetch('http://localhost:3000/api/plugins')
      const pluginsData = await pluginsResponse.json()
      const runningPlugins = pluginsData.plugins?.filter(
        (plugin: any) => plugin.status.toLowerCase() === 'running'
      ) || []

      const menusResponse = await fetch('http://localhost:3000/api/plugins/menus')
      const menusData = await menusResponse.json()

      if (menusData.menus && Array.isArray(menusData.menus)) {
        const runningPluginNames = runningPlugins.map((p: any) => p.name)

        const filteredMenus = menusData.menus.filter((menu: any) => {
          if (!menu || !menu.path) return false
          
          const pluginName = extractPluginNameFromPath(menu.path)
          return runningPluginNames.includes(pluginName)
        })

        const allItems: MenuItem[] = []
        filteredMenus.forEach((pluginMenu: any) => {
          allItems.push(transformBackendMenu(pluginMenu))
          
          if (pluginMenu.children && Array.isArray(pluginMenu.children)) {
            pluginMenu.children.forEach((child: any) => {
              allItems.push(transformBackendMenu(child))
            })
          }
        })

        setMenuItems((prev) => {
          const defaultItems = prev.filter((item: any) => 
            item.key === '/dashboard' || item.key === '/plugins'
          )
          return [...defaultItems, ...allItems.map(convertMenuItem)]
        })
      }
    } catch (error) {
      console.error('Failed to refresh plugin menus:', error)
    }
  }

  function extractPluginNameFromPath(path: string): string {
    if (!path.startsWith('/')) return ''
    const parts = path.split('/')
    if (parts.length >= 2) {
      return parts[1]
    }
    return ''
  }

  function transformBackendMenu(menu: any): MenuItem {
    const iconName = menu.icon
    const iconComponent = iconName ? getIconComponent(iconName) : undefined

    return {
      key: menu.path || menu.key,
      label: menu.title || menu.label,
      icon: iconComponent,
    }
  }

  function getIconComponent(iconName: string): React.ReactElement | null {
    const iconMap: Record<string, React.ComponentType<any>> = {
      UserOutlined: antdIcons.UserOutlined,
      DashboardOutlined: antdIcons.DashboardOutlined,
      AppstoreOutlined: antdIcons.AppstoreOutlined,
      UnorderedListOutlined: antdIcons.UnorderedListOutlined,
    }

    const IconComponent = iconMap[iconName]
    if (!IconComponent) {
      console.warn(`Icon not found: ${iconName}`)
      return null
    }

    return createElement(IconComponent)
  }

  return (
    <MenuContext.Provider
      value={{ menuItems, addMenuItem, removeMenuItem, updateMenuItem, refreshPluginMenus }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

type MenuItemType = NonNullable<MenuProps['items']>[number]

function convertMenuItem(item: MenuItem): MenuItemType {
  let iconComponent: React.ReactNode = undefined
  if (item.icon) {
    if (typeof item.icon === 'string') {
      iconComponent = createElement((antdIcons as any)[item.icon])
    } else {
      iconComponent = item.icon
    }
  }

  const menuItem: MenuItemType = {
    key: item.key,
    icon: iconComponent,
    label: item.label,
    children: item.children?.map(convertMenuItem),
  }

  return menuItem
}
