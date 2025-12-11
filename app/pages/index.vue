<script setup>
import { mainMenu } from '~/data/constants'

const { setSectionSeo, resetSeo } = useSeo()
const { locale } = useI18n()
const route = useRoute()
const scrollProgress = ref(0)

const updateScrollProgress = () => {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
}

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
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  if (!route.hash || route.hash === '#home') {
    resetSeo()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<template>
  <div class="overflow-x-hidden w-full">
    <div class="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
      <div
        class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      />
    </div>

    <div class="bg-decorative-effects">
      <div class="bg-blob-primary animate-blob" />
      <div class="bg-blob-accent animate-blob animation-delay-2000" />
      <div class="bg-blob-primary-center animate-blob animation-delay-4000" />
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
