import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'assets',
    lib: {
      entry: 'src/index.tsx',
      formats: ['iife'],
      name: 'UserManagementPlugin',
      fileName: () => 'main.js',
    },
  },
})
