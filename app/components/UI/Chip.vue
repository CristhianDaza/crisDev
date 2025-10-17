<script setup>
defineProps({
  content: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="px-2.5 py-1 bg-primary text-text text-xs font-medium rounded-lg hover:bg-bg hover:text-text transition-colors">
    {{ content }}
  </span>
</template>

<style scoped>

</style>
