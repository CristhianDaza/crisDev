<script setup>
useHead({
  htmlAttrs: {
    class: 'dark'
  }
})

const { locales, setLocale } = useI18n()
</script>

<template>
  <main id="home">
    <CdHeader :menus="mainMenu"/>
  </main>

  <section id="home" class="min-h-screen">
    <CdHero />
  </section>
  <section id="projects" class="mx-auto max-w-7xl px-6 py-20 min-h-screen">
    <CdProjects />
  </section>

  <section id="experience" class="relative mx-auto max-w-full px-6 py-20 min-h-screen">
    <CdExperience />
  </section>

  <section id="skills" class="mx-auto max-w-7xl px-6 py-20 min-h-screen">
    <CdSkills />
  </section>

  <section id="contact" class="relative w-full min-h-screen flex items-center">
    <CdContact />
  </section>

  <button
    v-for="locale in locales"
    :key="locale.code"
    class="m-2 rounded border border-gray-300 bg-white px-3 py-1 text-sm shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    @click="setLocale(locale.code)"
  >
    {{ locale.name }}
  </button>

  <CdScrollToTop />
</template>
