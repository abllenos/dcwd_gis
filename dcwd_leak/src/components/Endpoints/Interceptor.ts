import axios from 'axios';

export const apiGis = axios.create({
  baseURL: 'https://api-gis.davao-water.gov.ph/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const devApi = axios.create({
  baseURL: 'https://dev-api.davao-water.gov.ph/',
  headers: { 
    'Content-Type': 'application/json'
   },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
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
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        error.response?.data?.message === 'Token Expired' &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
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

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
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
