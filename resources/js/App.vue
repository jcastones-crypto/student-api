<script setup>
import { onMounted } from 'vue';
import { useAuth } from './composables/useAuth';
import { useStudents } from './composables/useStudents';
import { useAlert } from './composables/useAlert';
import LoginForm from './components/LoginForm.vue';
import StudentForm from './components/StudentForm.vue';
import StudentList from './components/StudentList.vue';
import AlertMessage from './components/AlertMessage.vue';

// ===== Shared state from the composables (Composition API) =====
const { user, isLoggedIn, isAdmin, tokenPreview, logout, restoreSession } = useAuth();
const { alert, success, error, clear } = useAlert();
const {
    students,
    filteredStudents,
    search,
    loading,
    saving,
    deletingId,
    serverErrors,
    editing,
    formOpen,
    fetchStudents,
    openAdd,
    openEdit,
    closeForm,
    clearFieldError,
    saveStudent,
    removeStudent,
    resetStudents,
} = useStudents();

// ===== Event handlers =====
async function onLoggedIn() {
    success(`Welcome, ${user.value.name}!`);
    await fetchStudents();
}

async function onLogout() {
    await logout();
    resetStudents();
    success('Logged out successfully. Token revoked.');
}

function onRemove(student) {
    if (confirm(`Delete ${student.first_name} ${student.last_name}?`)) {
        removeStudent(student);
    }
}

// On page load: if a token was saved, ask Laravel if it is still valid
onMounted(async () => {
    if (!isLoggedIn.value) return;
    const ok = await restoreSession();
    if (ok) await fetchStudents();
    else if (!isLoggedIn.value) error('Your session has expired. Please log in again.');
});
</script>

<template>
    <div class="page">
        <header>
            <h1>Student Management</h1>

            <div v-if="isLoggedIn" class="user-box">
                <div class="who">
                    <span>{{ user.name }}</span>
                    <span :class="['badge', isAdmin ? 'admin' : 'user']">
                        {{ isAdmin ? 'Administrator' : 'Regular User' }}
                    </span>
                    <small class="token">Bearer token: {{ tokenPreview }}</small>
                </div>
                <button class="btn small" @click="onLogout">Logout</button>
            </div>
        </header>

        <AlertMessage :type="alert.type" :message="alert.message" @close="clear" />

        <LoginForm v-if="!isLoggedIn" @success="onLoggedIn" />

        <template v-else>
            <!-- What this role is allowed to do (Laravel enforces it on the server) -->
            <p v-if="isAdmin" class="access ok">
                Full access: you can view, add, update, and delete students.
            </p>
            <p v-else class="access limited">
                Read-only access: you can view students. Only an administrator can add,
                update, or delete.
            </p>

            <div v-if="isAdmin && !formOpen" class="toolbar">
                <button class="btn primary" @click="openAdd">+ Add Student</button>
            </div>

            <StudentForm
                v-if="isAdmin && formOpen"
                :student="editing"
                :server-errors="serverErrors"
                :saving="saving"
                @save="saveStudent"
                @cancel="closeForm"
                @clear-error="clearFieldError"
            />

            <StudentList
                v-model:search="search"
                :students="filteredStudents"
                :total="students.length"
                :is-admin="isAdmin"
                :loading="loading"
                :deleting-id="deletingId"
                @edit="openEdit"
                @remove="onRemove"
            />
        </template>
    </div>
</template>
