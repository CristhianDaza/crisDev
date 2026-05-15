<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['openProject'])

const openProject = (project) => {
  emit('openProject', project)
}
</script>

<template>
  <article
    class="project-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius)] border border-card bg-card shadow-card outline-none backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
    role="button"
    tabindex="0"
    @click="openProject(project)"
    @keydown.enter="openProject(project)"
    @keydown.space.prevent="openProject(project)"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-chip/40">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="$t(project.title)"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      >
      <div
        v-else
        class="h-full w-full bg-gradient-to-br from-primary/90 to-accent/90"
      >
        <div class="absolute inset-0 flex items-center justify-center text-6xl font-bold text-text/30">
          {{ project.title.charAt(0) }}
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-70 transition-opacity group-hover:opacity-55" />
      <div v-if="project.featured" class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/75 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
        <Icon name="mdi:star-four-points" class="h-3.5 w-3.5 text-accent drop-shadow" />
        {{ $t('projects.featured') }}
      </div>
      <span class="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        {{ project.date }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="mb-3">
        <h3 class="line-clamp-1 text-xl font-bold text-text transition-colors group-hover:text-primary">
          {{ $t(project?.title) }}
        </h3>
      </div>

      <p class="mb-5 line-clamp-2 min-h-[3.5rem] text-sm leading-7 text-muted">
        {{ $t(project.shortDescription) }}
      </p>

      <div class="mb-5 flex flex-wrap gap-2">
        <UIChip
          v-for="tech in project.technologies.slice(0, 3)"
          :key="tech"
          :content="tech"
        />
        <span
          v-if="project.technologies.length > 3"
          class="inline-flex items-center rounded-full border border-border bg-bg/40 px-2.5 py-1 text-xs font-semibold text-muted"
        >
          +{{ project.technologies.length - 3 }}
        </span>
      </div>

      <div class="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
        <a
          v-if="project.projectUrl"
          :href="project.projectUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          @click.stop
        >
          <Icon name="mdi:open-in-new" class="h-4 w-4" />
          {{ $t('projects.viewProject') }}
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          @click.stop
        >
          <Icon name="mdi:github" class="h-4 w-4" />
          {{ $t('social.github') }}
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
