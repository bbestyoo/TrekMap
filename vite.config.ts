import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  worker: {
    format: 'es',
  },
  server: {
    port: 3000,
    proxy: {
      '/api/opentopodata': {
        target: 'https://api.opentopodata.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/opentopodata/, ''),
      },
    },
  },
})