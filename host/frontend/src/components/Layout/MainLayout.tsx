import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { MenuOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { useMenu } from '../../contexts/MenuContext'

const { Header, Sider, Content } = Layout

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { menuItems } = useMenu()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const selectedKeys = [location.pathname]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>
            {collapsed ? '宿主' : '宿主系统'}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <MenuOutlined
              style={{ fontSize: '18px', cursor: 'pointer' }}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: '个人中心', icon: <UserOutlined /> },
                { key: 'settings', label: '系统设置', icon: <SettingOutlined /> },
              ],
            }}
          >
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
