<script setup>
// Props: data passed IN from the parent (App.vue)
defineProps({
    type: { type: String, default: 'success' },
    message: { type: String, default: '' },
});

// Event sent OUT to the parent
const emit = defineEmits(['close']);
</script>

<template>
    <div v-if="message" :class="['alert', type]">
        <span>{{ message }}</span>
        <button class="close" @click="emit('close')">x</button>
    </div>
</template>
