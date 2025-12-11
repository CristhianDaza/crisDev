<script setup>
import { projects } from '~/data/constants'

const selectedProject = ref(null)
const isProjectDetailOpen = ref(false)
const { setProjectSeo, resetSeo } = useSeo()

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
  <div>
    <div class="mb-12 text-center">
      <h2 class="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {{ $t('projects.title') }}
      </h2>
      <p class="text-muted text-lg max-w-2xl mx-auto">
        {{ $t('projects.description') }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
