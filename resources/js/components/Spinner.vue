<template>
    <div
        class="spinner-border"
        :class="{ 'spinner-border-sm': size == 'small' }"
        role="status"
    >
        <span class="sr-only">Loading...</span>
    </div>
</template>
<script setup>
const props = defineProps(["size"]);
</script>
