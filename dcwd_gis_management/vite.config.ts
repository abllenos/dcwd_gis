import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/license': {
        target: 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/license/, '')
      },
      '/helpers/gis/mgtsys/getLayers': {
        target: 'http://192.100.140.198',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
