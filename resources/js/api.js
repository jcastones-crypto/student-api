import axios from 'axios';

// All requests go to the existing Laravel API (/api/...)
const api = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

// Called by useAuth: attach (or remove) the Bearer token on EVERY request
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

export default api;
