import axios from 'axios';

// All requests go to the existing Laravel API (/api/...)
const api = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

// Attach the saved Sanctum token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
