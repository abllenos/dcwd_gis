

import axios from 'axios';

export const apiGis = axios.create({
  baseURL: 'http://192.100.140.198/', // Match legacy system for local dev
  headers: {
    'Content-Type': 'application/json',
  },
});

export const devApi = axios.create({
  baseURL: 'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/',
  headers: { 
    'Content-Type': 'application/json'
   },
});

// Re-enable Authorization header for authenticated requests
[apiGis, devApi].forEach((instance) => {
  instance.interceptors.request.use(
    (config) => {
      // Only add Authorization header for API endpoints that require it
      // Do NOT add for PMS/PRV/PSV endpoints (which use token as query param)
      const noAuthEndpoints = [
        'getPMS.php',
        'getPrv.php',
        'getPsv.php',
        'getFirehydrant.php',
        'getIsolationValve.php',
        'getIsolation.php', // Add this to skip Authorization for legacy endpoint
      ];
      const url = config.url || '';
      const needsAuth = !noAuthEndpoints.some(endpoint => url.includes(endpoint));
      const token = localStorage.getItem('token');
      if (token && needsAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Remove Authorization header if present
        if (config.headers && config.headers.Authorization) {
          delete config.headers.Authorization;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     // ... (rest of the logic)
//   }
// );

