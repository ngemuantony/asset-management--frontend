import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const { access } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokens = localStorage.getItem('tokens');
                if (tokens) {
                    const { refresh } = JSON.parse(tokens);
                    const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
                        refresh,
                    });

                    const { access } = response.data;
                    const newTokens = { access, refresh };
                    localStorage.setItem('tokens', JSON.stringify(newTokens));

                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
