export enum PluginStatus {
  Uninstalled = 'uninstalled',
  Installed = 'installed',
  Enabled = 'enabled',
  Disabled = 'disabled',
  Running = 'running',
  Stopped = 'stopped',
  Loading = 'loading',
  Unloading = 'unloading',
  Error = 'error',
}

export enum PluginTransition {
  Install = 'install',
  Uninstall = 'uninstall',
  Enable = 'enable',
  Disable = 'disable',
  Start = 'start',
  Stop = 'stop',
  Reload = 'reload',
}

export interface PluginManifest {
  name: string
  version: string
  description: string
  author: string
  min_host_version?: string
  dependencies?: string[]
}

export interface Plugin {
  id: string
  name: string
  version: string
  status: PluginStatus
  description: string
  author: string
  enabled: boolean
  created_at: string
  updated_at: string
  manifest?: PluginManifest
}

export interface PluginDetail extends Plugin {
  routes: string[]
  permissions: string[]
  logs: PluginLog[]
  sandbox_stats: SandboxStats
}

export interface PluginLog {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  context?: Record<string, any>
}

export interface SandboxStats {
  memory_usage: number
  memory_limit: number
  cpu_time: number
  cpu_limit: number
  operation_count: number
  violations: SandboxViolation[]
}

export interface SandboxViolation {
  id: string
  timestamp: string
  type: 'memory_limit' | 'cpu_limit' | 'forbidden_file' | 'forbidden_network' | 'forbidden_syscall'
  message: string
  context?: Record<string, any>
}

export interface PluginUploadRequest {
  file?: File
  path?: string
  data?: string // base64 encoded
}

export interface PluginActionResponse {
  success: boolean
  message: string
  plugin?: Plugin
}

export interface PluginTransitionRule {
  from: PluginStatus
  to: PluginStatus
  action: PluginTransition
  label: string
  icon: string
  danger?: boolean
}

export interface MenuItem {
  key: string
  icon?: string
  label: string
  path?: string
  children?: MenuItem[]
}
