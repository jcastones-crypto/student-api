<script setup>
import { reactive, ref, watch, computed } from 'vue';

// Props passed in from App.vue
const props = defineProps({
    student: { type: Object, default: null }, // null = add, object = edit
    serverErrors: { type: Object, default: () => ({}) }, // errors from Laravel
    saving: { type: Boolean, default: false },
});
const emit = defineEmits(['save', 'cancel', 'clear-error']);

const fields = [
    { key: 'student_number', label: 'Student Number', type: 'text' },
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'year_level', label: 'Year Level (1-6)', type: 'number' },
];

const blank = () => ({
    student_number: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_level: '',
});

// Form state: reactive() object, controlled by v-model
const form = reactive(blank());
const touched = reactive({}); // which fields the user already visited
const submitted = ref(false);
const isEdit = computed(() => props.student !== null);

// Client-side checks (Laravel still validates again on the server)
function validate(f) {
    const e = {};
    if (!String(f.student_number).trim()) e.student_number = 'Student number is required.';
    if (!String(f.first_name).trim()) e.first_name = 'First name is required.';
    if (!String(f.last_name).trim()) e.last_name = 'Last name is required.';
    if (!String(f.email).trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(String(f.email))) e.email = 'Enter a valid email address.';
    if (!String(f.course).trim()) e.course = 'Course is required.';
    if (f.year_level === '' || f.year_level === null) {
        e.year_level = 'Year level is required.';
    } else {
        const y = Number(f.year_level);
        if (!Number.isInteger(y) || y < 1 || y > 6) {
            e.year_level = 'Year level must be a whole number from 1 to 6.';
        }
    }
    return e;
}

const clientErrors = computed(() => validate(form));

// Server error first, then client error (only after the field was touched)
function shownError(key) {
    if (props.serverErrors[key]) return props.serverErrors[key][0];
    if ((touched[key] || submitted.value) && clientErrors.value[key]) {
        return clientErrors.value[key];
    }
    return '';
}

// Event handling
function onInput(key) {
    emit('clear-error', key); // remove the Laravel error once the user edits
}

function onBlur(key) {
    touched[key] = true;
}

function submit() {
    submitted.value = true;
    if (Object.keys(clientErrors.value).length > 0) return;
    emit('save', {
        ...form,
        year_level: Number(form.year_level),
    });
}

// Fill the form when a student is passed in (edit mode)
watch(
    () => props.student,
    (s) => {
        Object.assign(
            form,
            s
                ? {
                      student_number: s.student_number,
                      first_name: s.first_name,
                      last_name: s.last_name,
                      email: s.email,
                      course: s.course,
                      year_level: s.year_level,
                  }
                : blank()
        );
        Object.keys(touched).forEach((k) => delete touched[k]);
        submitted.value = false;
    },
    { immediate: true }
);
</script>

<template>
    <div class="card">
        <h2>{{ isEdit ? 'Update Student' : 'Add Student' }}</h2>
        <form novalidate @submit.prevent="submit">
            <div v-for="f in fields" :key="f.key" class="field">
                <label>{{ f.label }}</label>
                <input
                    v-model="form[f.key]"
                    :type="f.type"
                    :class="{ invalid: shownError(f.key) }"
                    :disabled="saving"
                    @input="onInput(f.key)"
                    @blur="onBlur(f.key)"
                />
                <small v-if="shownError(f.key)" class="error-text">
                    {{ shownError(f.key) }}
                </small>
            </div>

            <div class="actions">
                <button class="btn primary" :disabled="saving">
                    {{ saving ? 'Saving...' : isEdit ? 'Update' : 'Save' }}
                </button>
                <button type="button" class="btn" :disabled="saving" @click="emit('cancel')">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</template>
