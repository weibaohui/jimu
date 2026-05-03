import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'serve-plugins',
      configureServer(server) {
        const pluginsRoot = path.resolve(__dirname, '../../plugins')
        console.log('pluginsRoot:', pluginsRoot)
        
        server.middlewares.use((req, res, next) => {
          // 只拦截 /plugins/ 或 /plugins 路径
          if (!req.url?.startsWith('/plugins')) {
            return next()
          }
          
          // 提取路径：/plugins/user-management/frontend/assets/main.js => user-management/frontend/assets/main.js
          const relativePath = req.url!.replace(/^\/plugins(\/)?/, '')
          
          // 如果是空路径（请求 /plugins 或 /plugins/），fallback
          if (!relativePath) {
            return next()
          }
          
          // 安全检查：防止路径遍历
          if (relativePath.includes('..')) {
            res.writeHead(403, { 'Content-Type': 'text/plain' })
            res.end('Forbidden')
            return
          }
          
          const filePath = path.join(pluginsRoot, relativePath)
          
          // 确保文件在插件目录下
          if (!filePath.startsWith(pluginsRoot)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' })
            res.end('Forbidden')
            return
          }
          
          // 读取并返回文件
          fs.stat(filePath, (err, stat) => {
            if (err) {
              next() // 不存在，fallback
              return
            }
            
            // 如果是目录，fallback 到 historyApiFallback
            if (stat.isDirectory()) {
              next()
              return
            }
            
            // 读取文件内容
            fs.readFile(filePath, (readErr, data) => {
              if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' })
                res.end('Internal Server Error')
                return
              }
              
              // 根据扩展名设置 Content-Type
              const ext = path.extname(filePath).toLowerCase()
              const contentTypes: Record<string, string> = {
                '.js': 'application/javascript; charset=utf-8',
                '.mjs': 'application/javascript; charset=utf-8',
                '.cjs': 'application/javascript; charset=utf-8',
                '.ts': 'application/javascript; charset=utf-8',
                '.tsx': 'application/javascript; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.html': 'text/html; charset=utf-8',
                '.json': 'application/json; charset=utf-8',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon',
              }
              
              res.writeHead(200, {
                'Content-Type': contentTypes[ext] || 'application/octet-stream',
                'Cache-Control': 'no-cache',
              })
              res.end(data)
            })
          })
        })
      },
    },
    react(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5188,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: [
        path.resolve(__dirname), // 当前 frontend 目录（包含 index.html 等）
        path.resolve(__dirname, '../../plugins'),
      ],
    },
  },
})
