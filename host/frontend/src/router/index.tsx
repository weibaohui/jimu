import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../components/Layout/MainLayout'
import { Dashboard } from '../components/Dashboard/Dashboard'
import { PluginManagement } from '../components/PluginManagement/PluginManagement'
import { PluginLoader } from '../components/Plugin/PluginLoader'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'plugins',
        element: <PluginManagement />,
      },
      // 插件路由 — 所有插件路径由 PluginLoader 动态处理
      {
        path: '*',
        element: <PluginLoader />,
      },
    ],
  },
])
