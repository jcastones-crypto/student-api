<script setup>
// Props passed in from App.vue
defineProps({
    students: { type: Array, default: () => [] },
    isAdmin: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['edit', 'remove']);
</script>

<template>
    <div class="card">
        <h2>Student Records</h2>

        <!-- v-if / v-else-if: conditional content -->
        <p v-if="loading">Loading...</p>
        <p v-else-if="students.length === 0" class="muted">No students found.</p>

        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Student No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th v-if="isAdmin">Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- v-for: display every record -->
                <tr v-for="s in students" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.student_number }}</td>
                    <td>{{ s.first_name }} {{ s.last_name }}</td>
                    <td>{{ s.email }}</td>
                    <td>{{ s.course }}</td>
                    <td>{{ s.year_level }}</td>
                    <td v-if="isAdmin">
                        <button class="btn small" @click="emit('edit', s)">Edit</button>
                        <button class="btn small danger" @click="emit('remove', s)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
