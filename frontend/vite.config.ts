import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (
            id.includes('react-dom') ||
            id.includes('/react/') ||
            id.includes('react-router') ||
            id.includes('@remix-run') ||
            id.includes('scheduler')
          ) {
            return 'vendor-react'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('recharts') || id.includes('/d3-') || id.includes('internmap')) {
            return 'vendor-charts'
          }

          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'vendor-maps'
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }
        },
      },
    },
  },
})
