<script setup>
import { projects } from '~/data/constants'

const selectedProject = ref(null)
const isProjectDetailOpen = ref(false)
const carousel = ref(null)
const currentPage = ref(0)
const visibleProjectsCount = ref(3)
const { setProjectSeo, resetSeo } = useSeo()
const featuredProjects = computed(() => projects.filter(project => project.featured))
const totalPages = computed(() => Math.ceil(projects.length / visibleProjectsCount.value))
const visibleStartIndex = computed(() => Math.min(
  currentPage.value * visibleProjectsCount.value,
  Math.max(0, projects.length - visibleProjectsCount.value)
))
const visibleRange = computed(() => {
  const start = visibleStartIndex.value + 1
  const end = Math.min(start + visibleProjectsCount.value - 1, projects.length)

  return { start, end }
})

let scrollFrame = null

const openProject = (project) => {
  selectedProject.value = project
  isProjectDetailOpen.value = true
  setProjectSeo(project)
}

const closeProjectDetail = () => {
  isProjectDetailOpen.value = false
  resetSeo()
  setTimeout(() => {
    selectedProject.value = null
  }, 300)
}

const getVisibleProjectsCount = () => {
  if (window.innerWidth >= 1280) return 3
  if (window.innerWidth >= 768) return 2
  return 1
}

const scrollToPage = (page) => {
  const nextPage = Math.max(0, Math.min(page, totalPages.value - 1))
  const firstProjectIndex = Math.min(
    nextPage * visibleProjectsCount.value,
    Math.max(0, projects.length - visibleProjectsCount.value)
  )
  const targetProject = carousel.value?.children[firstProjectIndex]

  if (!targetProject || !carousel.value) return

  const targetPosition = targetProject.getBoundingClientRect().left
    - carousel.value.getBoundingClientRect().left
    + carousel.value.scrollLeft

  currentPage.value = nextPage
  carousel.value.scrollTo({
    left: targetPosition,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  })
}

const updateCurrentPage = () => {
  if (!carousel.value) return

  const maxScroll = carousel.value.scrollWidth - carousel.value.clientWidth
  currentPage.value = maxScroll > 0
    ? Math.round((carousel.value.scrollLeft / maxScroll) * (totalPages.value - 1))
    : 0
}

const handleScroll = () => {
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
  scrollFrame = requestAnimationFrame(updateCurrentPage)
}

const handleResize = () => {
  const nextVisibleProjectsCount = getVisibleProjectsCount()

  if (nextVisibleProjectsCount === visibleProjectsCount.value) return

  visibleProjectsCount.value = nextVisibleProjectsCount
  currentPage.value = 0
  nextTick(() => scrollToPage(0))
}

onMounted(() => {
  visibleProjectsCount.value = getVisibleProjectsCount()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <div class="space-y-10">
    <div class="max-w-3xl">
      <div class="mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
      <h2 class="text-4xl font-bold tracking-normal text-text md:text-5xl">
        {{ $t('projects.title') }}
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
        {{ $t('projects.description') }}
      </p>
      <div class="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
        <span class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5">
          <span class="h-2 w-2 rounded-full bg-accent" />
          {{ $t('projects.featured') }}: {{ featuredProjects.length }}
        </span>
        <span class="text-border">/</span>
        <span>{{ $t('menu.projects') }}: {{ projects.length }}</span>
      </div>
    </div>

    <div class="space-y-5">
      <div class="flex items-center justify-between gap-4">
        <p
          class="text-sm font-medium text-muted"
          aria-live="polite"
        >
          {{ $t('projects.showing', { start: visibleRange.start, end: visibleRange.end, total: projects.length }) }}
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            :disabled="currentPage === 0"
            :aria-label="$t('projects.previousProjects')"
            @click="scrollToPage(currentPage - 1)"
          >
            <Icon name="mdi:arrow-left" class="h-5 w-5" />
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-text shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            :disabled="currentPage === totalPages - 1"
            :aria-label="$t('projects.nextProjects')"
            @click="scrollToPage(currentPage + 1)"
          >
            <Icon name="mdi:arrow-right" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref="carousel"
        class="projects-carousel rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        tabindex="0"
        :aria-label="$t('projects.carouselLabel')"
        @scroll.passive="handleScroll"
        @keydown.left.prevent="scrollToPage(currentPage - 1)"
        @keydown.right.prevent="scrollToPage(currentPage + 1)"
      >
        <li
          v-for="project in projects"
          :key="project.id"
        >
          <CdPrCard
            :project="project"
            @open-project="openProject"
          />
        </li>
      </ul>

      <div class="flex justify-center gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="h-2 rounded-full transition-all duration-300"
          :class="page - 1 === currentPage ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-muted'"
          :aria-label="$t('projects.goToProjectsPage', { page })"
          :aria-current="page - 1 === currentPage ? 'true' : undefined"
          @click="scrollToPage(page - 1)"
        />
      </div>
    </div>

    <CdPrDetail
      v-if="selectedProject"
      :project="selectedProject"
      :is-open="isProjectDetailOpen"
      @close="closeProjectDetail"
    />
  </div>
</template>

<style scoped>
.projects-carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  gap: 1.25rem;
  margin-inline: -0.25rem;
  overflow-x: auto;
  padding: 0.25rem 0.25rem 1rem;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.projects-carousel::-webkit-scrollbar {
  display: none;
}

.projects-carousel > li {
  display: flex;
  min-width: 0;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .projects-carousel {
    grid-auto-columns: calc((100% - 1.25rem) / 2);
  }

  .projects-carousel > li {
    scroll-snap-align: none;
  }

  .projects-carousel > li:nth-child(2n + 1),
  .projects-carousel > li:last-child {
    scroll-snap-align: start;
  }
}

@media (min-width: 1280px) {
  .projects-carousel {
    grid-auto-columns: calc((100% - 2.5rem) / 3);
  }

  .projects-carousel > li:nth-child(2n + 1) {
    scroll-snap-align: none;
  }

  .projects-carousel > li:nth-child(3n + 1),
  .projects-carousel > li:last-child {
    scroll-snap-align: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .projects-carousel {
    scroll-behavior: auto;
  }
}
</style>
