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
  <div class="overflow-x-hidden w-full">
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

    <section id="projects" class="mx-auto max-w-7xl px-6 my-20 min-h-screen">
      <CdProjects />
    </section>

    <section id="experience" class="mx-auto max-w-7xl px-6 my-20 min-h-screen">
      <CdExperience />
    </section>

    <section id="skills" class="mx-auto max-w-7xl px-6 my-20 min-h-screen">
      <CdSkills />
    </section>

    <section id="contact" class="mx-auto max-w-7xl px-6 my-20 min-h-screen">
      <CdContact />
    </section>

    <CdSettings />
    <CdScrollToTop />
  </div>
</template>
