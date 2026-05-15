<script setup>
defineProps({
  content: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/15">
    {{ content }}
  </span>
</template>

<style scoped>

</style>
