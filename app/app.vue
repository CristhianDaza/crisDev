<script setup>
useHead({
  htmlAttrs: {
    class: 'dark'
  }
})

const { locales, setLocale } = useI18n()
</script>

<template>
  <CvHeader :menus="mainMenu" />
  <button
    v-for="locale in locales"
    :key="locale.code"
    class="m-2 rounded border border-gray-300 bg-white px-3 py-1 text-sm shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    @click="setLocale(locale.code)"
  >
    {{ locale.name }}
  </button>
</template>
