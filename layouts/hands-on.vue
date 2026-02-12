<!-- layouts/hands-on.vue -->
<script setup lang="ts">
const { heading } = defineProps<{ heading?: string }>();
</script>

<template>
  <div
    class="slidev-layout hands-on bg-sky-50 dark:bg-slate-900 text-white-600 dark:text-white-600"
  >
    <h2 v-if="heading">Hands-On: {{ heading }}</h2>
    <slot />
  </div>
</template>
