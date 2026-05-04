import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  build: {
    outDir: 'assets',
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      name: 'UserManagementPlugin',
      fileName: (format) => `main.js`,
    },
  },
})
