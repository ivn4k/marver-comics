import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_MARVEL_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {

        console.log('Request:', {
            url: config.url,
            params: config.params,
            method: config.method
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            
            // Обработка разных типов ошибок
            switch (status) {
                case 401:
                    console.error('Authentication Error:', message);
                    break;
                case 403:
                    console.error('Authorization Error:', message);
                    break;
                case 404:
                    console.error('Not Found:', message);
                    break;
                case 429:
                    console.error('Rate Limit Exceeded:', message);
                    break;
                default:
                    console.error('API Error:', {
                        status,
                        message,
                        url: error.config?.url,
                        params: error.config?.params
                    });
            }
        }
        return Promise.reject(error);
    }
);

export default api;