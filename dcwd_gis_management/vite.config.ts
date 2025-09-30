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
        rewrite: (path) => path.replace(/^\/api\/layers/, '/getAllLayer.php')
      },

      // TEMPORARY WORKAROUND (CORS): Geometry (User Logs) endpoint
      // The geometry endpoint is public (no Authorization) and currently lacks permissive CORS for localhost.
      // This dev-only proxy maps the same local path to the production api-gis host so the UI can retrieve
      // geometry for a selected log. Remove once backend provides appropriate CORS or a .NET pass-through.
      '/helpers/gis/api/UserLogs/getLogsGeometry.php': {
        target: 'https://api-gis.davao-water.gov.ph',
        changeOrigin: true,
        secure: true,
      },
      // Proxy for license API (MapInfoUsers)
      '/api/license': {
        target: 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/license/, '')
      },
      '/helpers/gis/api/userlogs/getlogsgeometry.php': {
        target: 'https://api-gis.davao-water.gov.ph',
        changeOrigin: true,
        secure: true,

      },
      '/helpers/gis/mgtsys/getLayers': {
        target: 'http://192.100.140.198',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})