<script setup>
const { initializeLanguage } = useLanguage()
const { initializeTheme } = useTheme()

onMounted(() => {
  initializeLanguage()
  initializeTheme()
})
</script>

<template>
  <NuxtPage />
</template>
