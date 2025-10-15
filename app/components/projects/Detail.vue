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
          class="project-detail relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[var(--radius)] bg-[var(--surface)] shadow-2xl"
          @click.stop
        >
          <CdTooltip :content="$t('global.close')" position="left" variant="primary">
            <button
              class="absolute top-4 right-4 z-20 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--chip)] text-[var(--text)] hover:bg-[var(--primary)] hover:text-white transition-colors shadow-lg"
              @click="closeModal"
            >
              <Icon name="mdi:close" />
            </button>
          </CdTooltip>
          <div class="overflow-y-auto max-h-[90vh] project-detail-scroll">
            <div class="relative h-64 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-9xl text-white/20 font-bold">
                {{ project.title.charAt(0) }}
              </div>
              <div v-if="project.featured" class="absolute top-6 left-6 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-full shadow-lg">
                ⭐ {{ $t('projects.featuredProject') }}
              </div>
            </div>

            <div class="p-8">
              <div class="flex items-start justify-between gap-4 mb-4">
                <h2 class="text-3xl md:text-4xl font-bold text-[var(--text)]">
                  {{ project.title }}
                </h2>
                <span class="px-3 py-1 bg-[var(--chip)] text-[var(--primary)] text-sm font-semibold rounded-lg whitespace-nowrap">
                  {{ project.date }}
                </span>
              </div>

              <p class="text-[var(--muted)] text-lg leading-relaxed mb-8">
                {{ project.fullDescription }}
              </p>

              <div v-if="project.highlights && project.highlights.length" class="mb-8">
                <h3 class="text-xl font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ $t('projects.highlights') }}
                </h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li
                    v-for="(highlight, index) in project.highlights"
                    :key="index"
                    class="flex items-start gap-2 text-[var(--muted)] bg-[var(--chip)] p-3 rounded-lg"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <svg class="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ highlight }}</span>
                  </li>
                </ul>
              </div>

              <div class="mb-8">
                <h3 class="text-xl font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {{ $t('projects.technologiesUsed') }}
                </h3>
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="(tech, index) in project.technologies"
                    :key="tech"
                    class="px-4 py-2 bg-[var(--chip)] text-[var(--primary)] text-sm font-medium rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors tech-badge"
                    :style="{ animationDelay: `${index * 0.05}s` }"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="flex flex-wrap gap-4 pt-6 border-t border-[var(--border)]">
                <a
                  v-if="project.projectUrl"
                  :href="project.projectUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--accent)] transition-all hover:scale-105 shadow-lg"
                >
                  <Icon name="mdi:open-in-new" />
                  {{ $t('projects.viewProjectLive') }}
                </a>
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-6 py-3 bg-[var(--chip)] text-[var(--primary)] font-semibold rounded-lg border-2 border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all hover:scale-105"
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
