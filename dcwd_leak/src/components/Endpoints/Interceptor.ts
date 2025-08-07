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
    'Content-Type': 'application/json',
  },
});


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
    (error) => {
      console.error('Axios error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
});
