
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';


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


let isRefreshing = false;
type QueueEntry = { resolve: (token: string | null) => void; reject: (reason?: unknown) => void };
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

[apiGis, devApi].forEach((instance) => {
  instance.interceptors.request.use(
    (config) => {
      // Support per-request opt-out of auth via custom flag
      const cfg = config as (InternalAxiosRequestConfig & { skipAuth?: boolean });

      // Remove Content-Type for GET to avoid unnecessary CORS preflight
      if ((cfg.method || '').toLowerCase() === 'get' && cfg.headers) {
        delete (cfg.headers as AxiosRequestHeaders)['Content-Type'];
      }

      // Normalize URL to detect public geometry endpoint (no Authorization header allowed; CORS rejects it)
      const combined = ((cfg.baseURL || '').replace(/\/$/, '') + '/' + (cfg.url || '')).replace(/(?<!:)\/+/g, '/');
      const pathOnly = '/' + combined.replace(/^https?:\/\/[^/]+/, '').replace(/^\/*/, '').split('?')[0];
      const isPublicGeometry = pathOnly.toLowerCase().endsWith('/helpers/gis/api/userlogs/getlogsgeometry.php');
      if (!cfg.skipAuth && !isPublicGeometry) {
        const token = localStorage.getItem('token');
        if (token) {
          cfg.headers = {
            ...(cfg.headers as AxiosRequestHeaders),
            Authorization: `Bearer ${token}`,
          } as AxiosRequestHeaders;
        }
      } else if (isPublicGeometry && cfg.headers) {
        // Ensure Authorization header *not* present if some earlier logic added it
        delete (cfg.headers as AxiosRequestHeaders).Authorization;
      }
      return cfg;
    },
    (error) => Promise.reject(error)
  );



  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (
        error.response?.status === 401 &&
        (error.response?.data as { message?: string } | undefined)?.message === 'Token Expired' &&
        originalRequest && !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`,
            } as AxiosRequestHeaders;
            return instance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const { data } = await devApi.post('/auth/refresh', { token: refreshToken });

          localStorage.setItem('token', data.accessToken);
          processQueue(null, data.accessToken);

          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${data.accessToken}`,
          } as AxiosRequestHeaders;
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
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

