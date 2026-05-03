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
    // React 18 Strict Mode 会触发两次 mount，用 ref 防止重复加载
    if (menusLoadedRef.current) return
    menusLoadedRef.current = true

    // 从后端加载已安装插件的菜单
    loadPluginMenus()
  }, [])

  const loadPluginMenus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/plugins/menus')
      const data = await response.json()

      if (data.menus && Array.isArray(data.menus)) {
        // 扁平化处理所有菜单项
        const allItems: MenuItem[] = []
        data.menus.forEach((pluginMenu: any) => {
          if (pluginMenu) {
            // 添加父菜单
            allItems.push(transformBackendMenu(pluginMenu))
            // 添加子菜单
            if (pluginMenu.children && Array.isArray(pluginMenu.children)) {
              pluginMenu.children.forEach((child: any) => {
                allItems.push(transformBackendMenu(child))
              })
            }
          }
        })
        allItems.forEach(item => addMenuItem(item))
      }
    } catch (error) {
      console.error('Failed to load plugin menus:', error)
    }
  }

  /** 将后端菜单格式 (path/title/icon) 转换为前端 MenuItem 格式 */
  function transformBackendMenu(menu: any): MenuItem {
    const iconName = menu.icon
    const iconComponent = iconName ? getIconComponent(iconName) : undefined

    return {
      key: menu.path || menu.key,
      label: menu.title || menu.label,
      icon: iconComponent,
    }
  }

  /** 根据图标名称获取 antd 图标组件 */
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
      value={{ menuItems, addMenuItem, removeMenuItem, updateMenuItem }}
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
  // If icon is already a ReactNode (from transformBackendMenu), use it directly
  // Otherwise treat it as a string and look it up
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
