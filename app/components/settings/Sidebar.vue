<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

watch(() => props.isOpen, (newVal) => {
  if (typeof document !== 'undefined') {
    if (newVal) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition name="sidebar">
          <div
            v-if="isOpen"
            class="fixed left-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-r border-primary/20 shadow-2xl flex flex-col"
            @click.stop
          >
            <div class="flex items-center justify-between px-6 py-5 border-b border-primary/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
                  <Icon name="mdi:cog" class="w-5 h-5 text-primary" />
                </div>
                <h2 class="text-xl font-semibold text-white">
                  {{ $t('settings.title') }}
                </h2>
              </div>
              <CdTooltip :content="$t('global.close')" position="right" variant="primary">
                <button
                  type="button"
                  class="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  :aria-label="$t('global.close')"
                  @click="handleClose"
                >
                  <Icon name="mdi:close" class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </button>
              </CdTooltip>
            </div>

            <div class="flex-1 px-6 py-6 space-y-8">
              <div class="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
                <CdSeLanguage />
                <hr class="border-t border-gray-800/50">
                <CdSeTheme />
              </div>
            </div>

            <div class="px-6 py-4 border-t border-primary/10">
              <p class="text-xs text-gray-500 text-center">
                {{ $t('settings.footer') }}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
