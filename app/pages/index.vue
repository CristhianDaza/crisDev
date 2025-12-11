<script setup>
import { mainMenu } from '~/data/constants'

const { setSectionSeo, resetSeo } = useSeo()
const { locale } = useI18n()
const route = useRoute()

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

watch(() => route.hash, (newHash) => {
  if (!newHash || newHash === '#home') {
    resetSeo()
  } else {
    const sectionId = newHash.replace('#', '')
    if (sectionId && sectionId !== 'home') {
      setSectionSeo(sectionId)
    }
  }
}, { immediate: true })

onMounted(() => {
  if (!route.hash || route.hash === '#home') {
    resetSeo()
  }
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

    <main>
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
