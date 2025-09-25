import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // TEMPORARY WORKAROUND (CORS):
      // The classification PHP endpoint on dev-gis lacks CORS headers. This dev-time proxy rewrites
      // /api/classifications -> getAllClassification.php to bypass browser CORS during development ONLY.
      // Remove this before production deploy once server adds proper Access-Control-Allow-Origin or a backend
      // proxy endpoint is implemented (preferred long-term solution: .NET pass-through).
      '/api/classifications': {
        target: 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query',
        changeOrigin: true,
        secure: true,

        rewrite: (path) => path.replace(/^\/api\/classifications/, '/getAllClassification.php')
      },
      // TEMPORARY WORKAROUND (CORS) for Class endpoint; mirror of classifications rationale above.
      '/api/classes': {
        target: 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/classes/, '/getAllClass.php')
      },
      // TEMPORARY WORKAROUND (CORS) for Layer endpoint
      '/api/layers': {
        target: 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/query',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          if (path.startsWith('/api/layers')) {
            return path.replace(/^\/api\/layers/, '/getAllLayer.php');
          }
          if (path.startsWith('/api/license')) {
            return path.replace(/^\/api\/license/, '');
          }
          return path;
        }
      },
      '/helpers/gis/mgtsys/getLayers': {
        target: 'http://192.100.140.198',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
