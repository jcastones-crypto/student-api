<script setup>
import { ref, computed, onMounted } from 'vue';
import api from './api';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentList from './components/StudentList.vue';
import AlertMessage from './components/AlertMessage.vue';

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const students = ref([]);
const selected = ref(null); // student being edited (null = adding)
const showForm = ref(false);
const loading = ref(false);
const saving = ref(false);
const errors = ref({});
const alert = ref({ type: 'success', message: '' });

const isLoggedIn = computed(() => user.value !== null);
const isAdmin = computed(() => user.value?.role === 'admin');

function notify(type, message) {
    alert.value = { type, message };
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    user.value = null;
    students.value = [];
    showForm.value = false;
}

function handleError(e) {
    const status = e.response?.status;
    if (status === 422) {
        errors.value = e.response.data.errors || {};
        notify('error', e.response.data.message || 'Validation failed.');
    } else if (status === 401) {
        clearSession();
        notify('error', 'Session expired. Please log in again.');
    } else if (status === 403) {
        notify('error', e.response.data.message || 'You do not have permission.');
    } else if (status === 404) {
        notify('error', 'Student not found.');
    } else {
        notify('error', e.response?.data?.message || 'Something went wrong.');
    }
}

// READ (retrieve)
async function fetchStudents() {
    loading.value = true;
    try {
        const { data } = await api.get('/students');
        students.value = data.data;
    } catch (e) {
        handleError(e);
    } finally {
        loading.value = false;
    }
}

function onLogin({ token, user: u }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    user.value = u;
    notify('success', `Welcome, ${u.name}!`);
    fetchStudents();
}

async function logout() {
    try {
        await api.post('/logout');
    } catch (e) {
        // ignore, the session is cleared anyway
    }
    clearSession();
    notify('success', 'Logged out successfully.');
}

function openAdd() {
    selected.value = null;
    errors.value = {};
    showForm.value = true;
}

function openEdit(student) {
    selected.value = student;
    errors.value = {};
    showForm.value = true;
}

function cancelForm() {
    showForm.value = false;
    selected.value = null;
    errors.value = {};
}

// CREATE (add) and UPDATE
async function saveStudent(form) {
    saving.value = true;
    errors.value = {};
    try {
        if (selected.value) {
            await api.put(`/students/${selected.value.id}`, form);
            notify('success', 'Student updated successfully.');
        } else {
            await api.post('/students', form);
            notify('success', 'Student added successfully.');
        }
        cancelForm();
        await fetchStudents();
    } catch (e) {
        handleError(e);
    } finally {
        saving.value = false;
    }
}

// DELETE
async function removeStudent(student) {
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    try {
        await api.delete(`/students/${student.id}`);
        notify('success', 'Student deleted successfully.');
        await fetchStudents();
    } catch (e) {
        handleError(e);
    }
}

onMounted(() => {
    if (isLoggedIn.value) fetchStudents();
});
</script>

<template>
    <div class="page">
        <header>
            <h1>Student Management</h1>
            <div v-if="isLoggedIn" class="user-box">
                <span>{{ user.name }} ({{ user.role }})</span>
                <button class="btn small" @click="logout">Logout</button>
            </div>
        </header>

        <AlertMessage
            :type="alert.type"
            :message="alert.message"
            @close="alert.message = ''"
        />

        <LoginForm v-if="!isLoggedIn" @login="onLogin" />

        <template v-else>
            <div v-if="isAdmin && !showForm" class="toolbar">
                <button class="btn primary" @click="openAdd">+ Add Student</button>
            </div>

            <StudentForm
                v-if="showForm"
                :student="selected"
                :errors="errors"
                :saving="saving"
                @save="saveStudent"
                @cancel="cancelForm"
            />

            <StudentList
                :students="students"
                :is-admin="isAdmin"
                :loading="loading"
                @edit="openEdit"
                @remove="removeStudent"
            />
        </template>
    </div>
</template>
