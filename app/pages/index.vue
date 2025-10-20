<script setup>
const { setSectionSeo, resetSeo } = useSeo()
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale.value
  }
})

watch(locale, (newLocale) => {
  useHead({
    htmlAttrs: {
      lang: newLocale
    }
  })
})

onMounted(() => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id
        if (sectionId && sectionId !== 'home') {
          setSectionSeo(sectionId)
        } else if (sectionId === 'home') {
          resetSeo()
        }
      }
    })
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)

  const sections = document.querySelectorAll('section[id]')
  sections.forEach(section => observer.observe(section))

  onUnmounted(() => {
    observer.disconnect()
  })
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

    <section id="projects" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">
      <CdProjects />
    </section>

    <section id="experience" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">
      <CdExperience />
    </section>

    <section id="skills" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">
      <CdSkills />
    </section>

    <section id="contact" class="mx-auto max-w-7xl px-6 pb-16 my-20 min-h-screen">
      <CdContact />
    </section>

    <CdSettings />
    <CdScrollToTop />
  </div>
</template>

