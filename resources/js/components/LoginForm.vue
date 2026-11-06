<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['success']);

// State from the shared auth composable
const { login, loggingIn, loginError } = useAuth();

// Controlled inputs: the refs below ALWAYS hold what is typed
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const localError = ref('');

async function submit() {
    localError.value = '';
    if (!email.value.trim() || !password.value) {
        localError.value = 'Please enter your email and password.';
        return;
    }
    const ok = await login(email.value.trim(), password.value);
    if (ok) {
        password.value = ''; // do not keep the password in memory
        emit('success');
    }
}
</script>

<template>
    <div class="card login">
        <h2>Login</h2>

        <p v-if="localError || loginError" class="alert error">
            {{ localError || loginError }}
        </p>

        <form @submit.prevent="submit">
            <label>Email</label>
            <input
                v-model="email"
                type="email"
                placeholder="Email"
                autocomplete="username"
                :disabled="loggingIn"
                @input="localError = ''"
            />

            <label>Password</label>
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                autocomplete="current-password"
                :disabled="loggingIn"
                @input="localError = ''"
            />

            <label class="check-row">
                <input v-model="showPassword" type="checkbox" />
                Show password
            </label>

            <button class="btn primary" :disabled="loggingIn">
                {{ loggingIn ? 'Logging in...' : 'Login' }}
            </button>
        </form>
    </div>
</template>
