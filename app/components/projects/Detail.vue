<script setup>
const props = defineProps({
  project: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEsc)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleEsc)
  })
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="project-detail relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-radius bg-surface shadow-2xl"
          @click.stop
        >
          <CdTooltip :content="$t('global.close')" position="left" variant="primary">
            <button
              class="absolute top-4 right-4 z-20 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-chip text-text hover:bg-primary hover:text-text transition-colors shadow-lg"
              @click="closeModal"
            >
              <Icon name="mdi:close" />
            </button>
          </CdTooltip>
          <div class="overflow-y-auto max-h-[90vh] project-detail-scroll">
            <div class="relative h-64 overflow-hidden">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-primary to-accent"
              >
                <div class="absolute inset-0 flex items-center justify-center text-9xl text-text/20 font-bold">
                  {{ project.title.charAt(0) }}
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
              <div v-if="project.featured" class="absolute top-6 left-6 px-4 py-2 bg-accent text-text text-sm font-semibold rounded-full shadow-lg">
                ⭐ {{ $t('projects.featuredProject') }}
              </div>
            </div>

            <div class="p-8">
              <div class="flex items-start justify-between gap-4 mb-4">
                <h2 class="text-3xl md:text-4xl font-bold text-text">
                  {{ $t(project.title) }}
                </h2>
                <span class="px-3 py-1 bg-chip text-primary text-sm font-semibold rounded-lg whitespace-nowrap">
                  {{ project.date }}
                </span>
              </div>

              <p class="text-muted text-lg leading-relaxed mb-8">
                {{ $t(project.fullDescription) }}
              </p>

              <div v-if="project.highlights && project.highlights.length" class="mb-8">
                <h3 class="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Icon name="mdi:lightbulb" class="text-accent" />
                  {{ $t('projects.highlights') }}
                </h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li
                    v-for="(highlight, index) in project.highlights"
                    :key="index"
                    class="flex items-center gap-2 text-muted bg-chip p-3 rounded-lg"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <Icon name="mdi:star" class="self-center text-warning" />
                    <span class="self-center">{{ $t(highlight) }}</span>
                  </li>
                </ul>
              </div>

              <div class="mb-8">
                <h3 class="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                  <Icon name="mdi:code-tags" class="text-primary" />
                  {{ $t('projects.technologiesUsed') }}
                </h3>
                <div class="flex flex-wrap gap-3">
                  <CdUiChip
                    v-for="(tech, index) in project.technologies"
                    :key="index"
                    :content="tech"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-4 pt-6 border-t border-border">
                <a
                  v-if="project.projectUrl"
                  :href="project.projectUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-6 py-3 bg-primary text-text font-semibold rounded-lg hover:bg-accent transition-all hover:scale-105 shadow-lg"
                >
                  <Icon name="mdi:open-in-new" />
                  {{ $t('projects.viewProjectLive') }}
                </a>
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-6 py-3 bg-chip text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary hover:text-text transition-all hover:scale-105"
                >
                  <Icon name="mdi:github" />
                  {{ $t('projects.viewCodeInGitHub') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.project-detail {
  animation: slide-up 0.3s ease-out;
}

.tech-badge {
  animation: fade-in 0.5s ease-out backwards;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .project-detail,
.modal-leave-active .project-detail {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .project-detail,
.modal-leave-to .project-detail {
  transform: scale(0.9);
  opacity: 0;
}

.project-detail-scroll::-webkit-scrollbar {
  width: 8px;
}

.project-detail-scroll::-webkit-scrollbar-track {
  background: var(--bg);
  border-radius: 10px;
}

.project-detail-scroll::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}

.project-detail-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
