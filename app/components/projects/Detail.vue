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

watch(() => props.isOpen, async (isOpen) => {
  await nextTick()
  if (isOpen) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  } else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}, { immediate: true })

onUnmounted(() => {
  document.documentElement.style.overflow = ''
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
          class="project-detail relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-radius bg-surface shadow-2xl flex flex-col md:flex-row"
          @click.stop
        >
          <CdTooltip :content="$t('global.close')" position="top" variant="primary">
            <button
              class="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 w-10 h-10 flex items-center justify-center rounded-full bg-chip text-text hover:bg-primary hover:text-text transition-colors shadow-lg"
              @click="closeModal"
            >
              <Icon name="mdi:close" />
            </button>
          </CdTooltip>
          <div class="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden flex-shrink-0">
            <img
              v-if="project.imageDetail || project.image_mobile || project.image"
              :src="project.imageDetail || project.image_mobile || project.image"
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

          <div class="flex-1 overflow-y-auto project-detail-scroll">
            <div class="p-6 md:p-8 pt-12 md:pt-8">
              <div class="flex items-start justify-between gap-4 mb-4 pr-8">
                <h2 class="text-2xl md:text-3xl font-bold text-text">
                  {{ $t(project.title) }}
                </h2>
                <span class="px-3 py-1 bg-chip text-primary text-sm font-semibold rounded-lg whitespace-nowrap">
                  {{ project.date }}
                </span>
              </div>

              <p class="text-muted text-base leading-relaxed mb-6">
                {{ $t(project.fullDescription) }}
              </p>

              <div v-if="project.highlights && project.highlights.length" class="mb-6">
                <h3 class="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                  <Icon name="mdi:lightbulb" class="text-accent" />
                  {{ $t('projects.highlights') }}
                </h3>
                <ul class="grid grid-cols-1 gap-2">
                  <li
                    v-for="(highlight, index) in project.highlights"
                    :key="index"
                    class="flex items-center gap-2 text-muted bg-surface/50 border border-border p-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <Icon name="mdi:star" class="flex-shrink-0 w-4 h-4 text-warning" />
                    <span class="flex-1">{{ $t(highlight) }}</span>
                  </li>
                </ul>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                  <Icon name="mdi:code-tags" class="text-primary" />
                  {{ $t('projects.technologiesUsed') }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UIChip
                    v-for="(tech, index) in project.technologies"
                    :key="index"
                    :content="tech"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-4 pt-6 border-t border-border">
                <UIButton
                  v-if="project.projectUrl"
                  variant="primary"
                  icon="mdi:open-in-new"
                  :href="project.projectUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ $t('projects.viewProjectLive') }}
                </UIButton>
                <UIButton
                  v-if="project.githubUrl"
                  variant="secondary"
                  icon="mdi:github"
                  icon-position="left"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ $t('projects.viewCodeInGitHub') }}
                </UIButton>
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

.fixed.inset-0 {
  position: fixed;
  touch-action: none;
  overscroll-behavior: none;
}
</style>
