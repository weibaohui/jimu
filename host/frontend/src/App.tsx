import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { MenuProvider } from './contexts/MenuContext'
import { router } from './router'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <MenuProvider>
        <RouterProvider router={router} />
      </MenuProvider>
    </ConfigProvider>
  )
}

export default App
