<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['openProject'])
</script>

<template>
  <article
    class="project-card group cursor-pointer overflow-hidden rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 hover:shadow-[var(--shadow)] hover:-translate-y-2"
    @click="$emit('openProject', project)"
  >
    <div class="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-80">
      <div class="absolute inset-0 flex items-center justify-center text-6xl text-white/30 font-bold">
        {{ project.title.charAt(0) }}
      </div>
      <div v-if="project.featured" class="absolute top-3 right-3 px-3 py-1 bg-[var(--accent)] text-white text-xs font-semibold rounded-full">
        {{ $t('projects.featured') }}
      </div>
    </div>

    <div class="p-6">
      <div class="flex items-start justify-between gap-2 mb-3">
        <h3 class="text-xl font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
          {{ project.title }}
        </h3>
        <span class="text-sm text-[var(--muted)] whitespace-nowrap">{{ project.date }}</span>
      </div>

      <p class="text-[var(--muted)] text-sm mb-4 line-clamp-2 leading-relaxed">
        {{ project.shortDescription }}
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.technologies.slice(0, 3)"
          :key="tech"
          class="px-2.5 py-1 bg-[var(--chip)] text-[var(--primary)] text-xs font-medium rounded-lg"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 3"
          class="px-2.5 py-1 text-[var(--muted)] text-xs font-medium"
        >
          +{{ project.technologies.length - 3 }}
        </span>
      </div>

      <div class="flex gap-3 pt-4 border-t border-[var(--border)]">
        <a
          v-if="project.projectUrl"
          :href="project.projectUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
          @click.stop
        >
          <Icon name="mdi:open-in-new" />
          {{ $t('projects.viewProject') }}
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
          @click.stop
        >
          <Icon name="mdi:github" />
          {{ $t('social.github') }}
        </a>
      </div>
    </div>

    <div class="absolute inset-0 border-2 border-[var(--primary)] opacity-0 group-hover:opacity-100 rounded-[var(--radius)] transition-opacity pointer-events-none" />
  </article>
</template>

<style scoped>
.project-card {
  position: relative;
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

