<script setup>
import { reactive, watch, computed } from 'vue';

// Props passed in from App.vue
const props = defineProps({
    student: { type: Object, default: null }, // null = add, object = edit
    errors: { type: Object, default: () => ({}) },
    saving: { type: Boolean, default: false },
});
const emit = defineEmits(['save', 'cancel']);

const fields = [
    { key: 'student_number', label: 'Student Number', type: 'text' },
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'year_level', label: 'Year Level', type: 'number' },
];

const blank = () => ({
    student_number: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_level: '',
});

const form = reactive(blank());
const isEdit = computed(() => props.student !== null);

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
    },
    { immediate: true }
);

function submit() {
    emit('save', {
        ...form,
        year_level: form.year_level === '' ? '' : Number(form.year_level),
    });
}
</script>

<template>
    <div class="card">
        <h2>{{ isEdit ? 'Update Student' : 'Add Student' }}</h2>
        <form @submit.prevent="submit">
            <div v-for="f in fields" :key="f.key" class="field">
                <label>{{ f.label }}</label>
                <input v-model="form[f.key]" :type="f.type" />
                <small v-if="errors[f.key]" class="error-text">
                    {{ errors[f.key][0] }}
                </small>
            </div>
            <div class="actions">
                <button class="btn primary" :disabled="saving">
                    {{ saving ? 'Saving...' : isEdit ? 'Update' : 'Save' }}
                </button>
                <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
            </div>
        </form>
    </div>
</template>
