<script setup>
// Props passed in from App.vue
defineProps({
    students: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    search: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    deletingId: { type: Number, default: null },
});

const emit = defineEmits(['edit', 'remove', 'update:search']);
</script>

<template>
    <div class="card">
        <div class="list-head">
            <h2>Student Records <span class="count">({{ students.length }} of {{ total }})</span></h2>

            <!-- Controlled input: value comes from the prop, changes go up as an event -->
            <input
                class="search"
                type="search"
                placeholder="Search students..."
                :value="search"
                @input="emit('update:search', $event.target.value)"
            />
        </div>

        <!-- v-if / v-else-if: conditional content -->
        <p v-if="loading">Loading students...</p>
        <p v-else-if="total === 0" class="muted">No students yet.</p>
        <p v-else-if="students.length === 0" class="muted">No students match your search.</p>

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
                        <button
                            class="btn small danger"
                            :disabled="deletingId === s.id"
                            @click="emit('remove', s)"
                        >
                            {{ deletingId === s.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
