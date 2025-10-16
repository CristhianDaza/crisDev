<script setup>
useHead({
  htmlAttrs: {
    class: 'dark'
  }
})

const { initializeLanguage } = useLanguage()

onMounted(() => {
  initializeLanguage()
})
</script>

<template>
  <div class="bg-decorative-effects">
    <div class="bg-blob-primary" />
    <div class="bg-blob-accent" />
    <div class="bg-blob-primary-center" />
    <div class="bg-grid-pattern" />
  </div>

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

  <CdSettings />
  <CdScrollToTop />
</template>
