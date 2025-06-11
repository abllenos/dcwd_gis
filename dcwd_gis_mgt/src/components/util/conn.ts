import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://192.100.140.198/helpers/gis/mgtsys/getLayers/',
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;