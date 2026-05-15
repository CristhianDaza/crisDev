<script setup>
import { projects } from '~/data/constants'

const selectedProject = ref(null)
const isProjectDetailOpen = ref(false)
const { setProjectSeo, resetSeo } = useSeo()
const featuredProjects = computed(() => projects.filter(project => project.featured))

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

    <div class="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
      <CdPrCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @open-project="openProject"
      />
    </div>
    <CdPrDetail
      v-if="selectedProject"
      :project="selectedProject"
      :is-open="isProjectDetailOpen"
      @close="closeProjectDetail"
    />
  </div>
</template>
