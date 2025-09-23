import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const apiGis = axios.create({
  baseURL: 'https://api-gis.davao-water.gov.ph/',
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
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
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
