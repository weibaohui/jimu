import axios from 'axios'
import type {
  Plugin,
  PluginDetail,
  PluginUploadRequest,
  PluginActionResponse,
  PluginLog,
  SandboxStats,
  MenuItem,
} from '../types/plugin'

const API_BASE_URL = 'http://localhost:3000/api'

export const pluginApi = {
  // 获取所有插件列表
  async listPlugins(): Promise<Plugin[]> {
    const response = await axios.get(`${API_BASE_URL}/plugins`)
    return response.data.plugins || []
  },

  // 获取插件详情
  async getPluginDetail(name: string): Promise<PluginDetail> {
    const response = await axios.get(`${API_BASE_URL}/plugins/${name}`)
    return response.data
  },

  // 上传插件
  async uploadPlugin(request: PluginUploadRequest): Promise<PluginActionResponse> {
    const formData = new FormData()

    if (request.file) {
      formData.append('file', request.file)
    } else if (request.path) {
      formData.append('path', request.path)
    } else if (request.data) {
      formData.append('data', request.data)
    }

    const response = await axios.post(`${API_BASE_URL}/plugins`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // 启用插件
  async enablePlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/enable`)
    return response.data
  },

  // 禁用插件
  async disablePlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/disable`)
    return response.data
  },

  // 启动插件
  async startPlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/start`)
    return response.data
  },

  // 停止插件
  async stopPlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/stop`)
    return response.data
  },

  // 重载插件（热重载）
  async reloadPlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/reload`)
    return response.data
  },

  // 卸载插件
  async uninstallPlugin(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/uninstall`)
    return response.data
  },

  // 获取插件日志
  async getPluginLogs(name: string, limit?: number): Promise<PluginLog[]> {
    const response = await axios.get(`${API_BASE_URL}/plugins/${name}/logs`, {
      params: { limit },
    })
    return response.data.logs || []
  },

  // 获取沙盒统计
  async getSandboxStats(name: string): Promise<SandboxStats> {
    const response = await axios.get(`${API_BASE_URL}/plugins/${name}/sandbox`)
    return response.data
  },

  // 清空插件日志
  async clearPluginLogs(name: string): Promise<PluginActionResponse> {
    const response = await axios.delete(`${API_BASE_URL}/plugins/${name}/logs`)
    return response.data
  },

  // 重置沙盒统计
  async resetSandboxStats(name: string): Promise<PluginActionResponse> {
    const response = await axios.post(`${API_BASE_URL}/plugins/${name}/sandbox/reset`)
    return response.data
  },

  // 获取所有插件菜单
  async getPluginMenus(): Promise<MenuItem[]> {
    const response = await axios.get(`${API_BASE_URL}/plugins/menus`)
    return response.data.menus || []
  },
}

// 创建 axios 实例，用于通用请求
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // 请求已发送但无响应
      console.error('Network Error:', error.message)
    } else {
      // 请求配置错误
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default pluginApi
