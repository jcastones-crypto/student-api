import { ref, computed } from 'vue';
import api from '../api';
import { useAuth } from './useAuth';
import { useAlert } from './useAlert';

// ===== Shared student state =====
const students = ref([]);
const search = ref('');
const loading = ref(false);
const saving = ref(false);
const deletingId = ref(null);
const serverErrors = ref({}); // validation errors from Laravel (422)
const editing = ref(null);    // student being edited (null = adding)
const formOpen = ref(false);

// Computed: the list updates automatically when students or search change
const filteredStudents = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return students.value;
    return students.value.filter((s) =>
        [s.student_number, s.first_name, s.last_name, s.email, s.course]
            .join(' ')
            .toLowerCase()
            .includes(q)
    );
});

export function useStudents() {
    const auth = useAuth();
    const { success, error } = useAlert();

    function resetStudents() {
        students.value = [];
        search.value = '';
        editing.value = null;
        formOpen.value = false;
        serverErrors.value = {};
    }

    // One place that turns API errors into clear messages
    function handleError(e) {
        const status = e.response?.status;
        const data = e.response?.data;

        if (!e.response) {
            error('Cannot reach the server. Is php artisan serve running?');
        } else if (status === 422) {
            serverErrors.value = data.errors || {};
            error(data.message || 'Validation failed. Please check the form.');
        } else if (status === 401) {
            auth.clearSession();
            resetStudents();
            error('Your session has expired. Please log in again.');
        } else if (status === 403) {
            error(data?.message || 'You do not have permission to do that.');
        } else if (status === 404) {
            error('Student not found. It may already be deleted.');
        } else {
            error(data?.message || 'Something went wrong.');
        }
    }

    // READ
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

    function openAdd() {
        editing.value = null;
        serverErrors.value = {};
        formOpen.value = true;
    }

    function openEdit(student) {
        editing.value = student;
        serverErrors.value = {};
        formOpen.value = true;
    }

    function closeForm() {
        formOpen.value = false;
        editing.value = null;
        serverErrors.value = {};
    }

    // Remove one field's server error while the user types in that field
    function clearFieldError(field) {
        if (serverErrors.value[field]) {
            const { [field]: removed, ...rest } = serverErrors.value;
            serverErrors.value = rest;
        }
    }

    // CREATE and UPDATE
    async function saveStudent(form) {
        saving.value = true;
        serverErrors.value = {};
        try {
            if (editing.value) {
                await api.put(`/students/${editing.value.id}`, form);
                success('Student updated successfully.');
            } else {
                await api.post('/students', form);
                success('Student added successfully.');
            }
            closeForm();
            await fetchStudents();
            return true;
        } catch (e) {
            handleError(e);
            return false;
        } finally {
            saving.value = false;
        }
    }

    // DELETE
    async function removeStudent(student) {
        deletingId.value = student.id;
        try {
            await api.delete(`/students/${student.id}`);
            success('Student deleted successfully.');
            await fetchStudents();
        } catch (e) {
            handleError(e);
        } finally {
            deletingId.value = null;
        }
    }

    return {
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
    };
}
