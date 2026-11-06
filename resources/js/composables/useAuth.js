import { ref, computed } from 'vue';
import api, { setAuthToken } from '../api';

// ===== Shared authentication state (created once, used by every component) =====
function readUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
}

const token = ref(localStorage.getItem('token'));
const user = ref(readUser());
const loggingIn = ref(false);
const loginError = ref('');

setAuthToken(token.value); // use the saved token for API requests

// Computed values that depend on the state above
const isLoggedIn = computed(() => !!token.value && !!user.value);
const isAdmin = computed(() => user.value?.role === 'admin');
const tokenPreview = computed(() =>
    token.value ? `${token.value.slice(0, 6)}...` : ''
);

function saveSession(newToken, newUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setAuthToken(newToken);
}

function clearSession() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
}

// POST /api/login -> store the returned token and use it as a Bearer token
async function login(email, password) {
    loggingIn.value = true;
    loginError.value = '';
    try {
        const { data } = await api.post('/login', { email, password });
        saveSession(data.access_token, data.user);
        return true;
    } catch (e) {
        if (!e.response) {
            loginError.value = 'Cannot reach the server. Is php artisan serve running?';
        } else if (e.response.status === 422) {
            loginError.value = 'Please enter a valid email and password.';
        } else {
            loginError.value = e.response.data?.message || 'Login failed.';
        }
        return false;
    } finally {
        loggingIn.value = false;
    }
}

// POST /api/logout -> Laravel revokes the token, then we clear it here
async function logout() {
    try {
        await api.post('/logout');
    } catch (e) {
        // token was already invalid, we still clear the session
    }
    clearSession();
}

// GET /api/me -> ask Laravel who we are (the role comes from the SERVER)
async function restoreSession() {
    if (!token.value) return false;
    try {
        const { data } = await api.get('/me');
        user.value = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
    } catch (e) {
        if (e.response?.status === 401) clearSession();
        return false;
    }
}

export function useAuth() {
    return {
        token,
        user,
        loggingIn,
        loginError,
        isLoggedIn,
        isAdmin,
        tokenPreview,
        login,
        logout,
        restoreSession,
        clearSession,
    };
}
