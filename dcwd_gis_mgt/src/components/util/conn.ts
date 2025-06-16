import axios ,{ AxiosInstance} from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://192.100.140.198/',
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




// setInterceptors(axiosInstance);
// setInterceptors(axiosAltInstance);

// export { axiosInstance, axiosAltInstance };
