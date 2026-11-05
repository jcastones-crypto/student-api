<script setup>
import { ref } from 'vue';
import api from '../api';

const emit = defineEmits(['login']);

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
    error.value = '';
    loading.value = true;
    try {
        const { data } = await api.post('/login', {
            email: email.value,
            password: password.value,
        });
        emit('login', { token: data.access_token, user: data.user });
    } catch (e) {
        if (e.response?.status === 422) {
            error.value = 'Please enter a valid email and password.';
        } else {
            error.value = e.response?.data?.message || 'Login failed.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="card login">
        <h2>Login</h2>
        <p v-if="error" class="alert error">{{ error }}</p>
        <form @submit.prevent="submit">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="admin@example.com" />
            <label>Password</label>
            <input v-model="password" type="password" placeholder="password" />
            <button class="btn primary" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
        </form>
    </div>
</template>
