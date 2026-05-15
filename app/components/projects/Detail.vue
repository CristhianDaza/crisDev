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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm md:p-6"
        @click.self="closeModal"
      >
        <div
          class="project-detail relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-2xl md:max-h-[88vh] md:flex-row"
          @click.stop
        >
          <CdTooltip :content="$t('global.close')" position="top" variant="primary">
            <button
              class="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:right-4 md:top-4"
              type="button"
              @click="closeModal"
            >
              <Icon name="mdi:close" class="h-5 w-5" />
            </button>
          </CdTooltip>
          <div class="relative h-64 w-full flex-shrink-0 overflow-hidden bg-chip/40 md:h-auto md:w-[42%]">
            <img
              v-if="project.imageDetail || project.image_mobile || project.image"
              :src="project.imageDetail || project.image_mobile || project.image"
              :alt="$t(project.title)"
              class="h-full w-full object-cover"
            >
            <div
              v-else
              class="h-full w-full bg-gradient-to-br from-primary to-accent"
            >
              <div class="absolute inset-0 flex items-center justify-center text-9xl font-bold text-text/20">
                {{ project.title.charAt(0) }}
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
            <div v-if="project.featured" class="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/75 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md md:bottom-6 md:left-6">
              <Icon name="mdi:star-four-points" class="h-4 w-4 text-accent drop-shadow" />
              {{ $t('projects.featuredProject') }}
            </div>
          </div>

          <div class="flex-1 overflow-y-auto project-detail-scroll bg-surface">
            <div class="p-5 pt-14 md:p-8 md:pt-8">
              <div class="mb-6 flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
                <h2 class="text-2xl font-bold leading-tight text-text md:text-3xl">
                  {{ $t(project.title) }}
                </h2>
                <span class="w-fit rounded-full border border-border bg-bg/50 px-3 py-1 text-sm font-semibold text-primary">
                  {{ project.date }}
                </span>
              </div>

              <p class="mb-7 rounded-[calc(var(--radius)-4px)] border border-border bg-bg/30 p-4 text-base leading-8 text-muted">
                {{ $t(project.fullDescription) }}
              </p>

              <section v-if="project.highlights && project.highlights.length" class="mb-7">
                <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-text">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon name="mdi:lightbulb" class="h-4 w-4" />
                  </span>
                  {{ $t('projects.highlights') }}
                </h3>
                <ul class="grid grid-cols-1 gap-2.5">
                  <li
                    v-for="(highlight, index) in project.highlights"
                    :key="index"
                    class="flex items-start gap-3 rounded-xl border border-border bg-bg/25 p-3 text-sm leading-6 text-muted transition-colors hover:bg-bg/45"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <Icon name="mdi:check-circle" class="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span class="flex-1">{{ $t(highlight) }}</span>
                  </li>
                </ul>
              </section>

              <section class="mb-7">
                <h3 class="mb-3 flex items-center gap-2 text-lg font-semibold text-text">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name="mdi:code-tags" class="h-4 w-4" />
                  </span>
                  {{ $t('projects.technologiesUsed') }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UIChip
                    v-for="(tech, index) in project.technologies"
                    :key="index"
                    :content="tech"
                  />
                </div>
              </section>

              <div class="flex flex-wrap gap-3 border-t border-border pt-6">
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
  animation: slide-up 0.24s ease-out;
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
