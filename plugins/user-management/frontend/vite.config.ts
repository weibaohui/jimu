import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets',
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: 'main',
    },
  },
})
