import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  createElement,
} from 'react'
import type { MenuProps } from 'antd'
import * as antdIcons from '@ant-design/icons'

export interface MenuItem {
  key: string
  icon?: string
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

  useEffect(() => {
    // 从后端加载已安装插件的菜单
    loadPluginMenus()
  }, [])

  const loadPluginMenus = async () => {
    try {
      const response = await fetch('/api/plugins/menus')
      const data = await response.json()

      if (data.menus && Array.isArray(data.menus)) {
        data.menus.forEach((pluginMenu: any) => {
          if (pluginMenu) {
            addMenuItem(pluginMenu)
          }
        })
      }
    } catch (error) {
      console.error('Failed to load plugin menus:', error)
    }
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
  const iconComponent = item.icon
    ? createElement((antdIcons as any)[item.icon])
    : undefined

  const menuItem: MenuItemType = {
    key: item.key,
    icon: iconComponent,
    label: item.label,
    children: item.children?.map(convertMenuItem),
  }

  return menuItem
}
