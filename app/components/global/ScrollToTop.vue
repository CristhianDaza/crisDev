<script setup>
const isVisible = ref(false)
const scrollProgress = ref(0)

const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  isVisible.value = scrollTop > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="scroll-fade">
    <div v-if="isVisible" class="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      <CdTooltip
        position="left"
        variant="code"
        :delay="100"
        :offset="12"
        :show-arrow="false"
      >
        <button
          type="button"
          class="group"
          aria-label="Volver arriba"
          @click="scrollToTop"
        >
          <div class="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 overflow-hidden">
            <svg
              class="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :style="`stop-color: var(--primary); stop-opacity: 0.3`" />
                  <stop offset="100%" :style="`stop-color: var(--accent); stop-opacity: 0.3`" />
                </linearGradient>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :style="`stop-color: var(--primary); stop-opacity: 1`" />
                  <stop offset="50%" :style="`stop-color: var(--primary); stop-opacity: 1`" />
                  <stop offset="100%" :style="`stop-color: var(--accent); stop-opacity: 1`" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#bgGradient)"
                stroke-width="4"
                class="transition-all duration-300"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                stroke-width="4"
                :stroke-dasharray="283"
                :stroke-dashoffset="283 - (283 * scrollProgress) / 100"
                stroke-linecap="round"
                class="transition-all duration-300 ease-out"
                filter="url(#glow)"
              />
            </svg>

            <div
              :class="[
                'absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md',
                'border border-primary/30 shadow-lg',
                'flex items-center justify-center',
                'transition-all duration-300 ease-out',
                'sm:group-hover:scale-110 sm:group-hover:from-primary/30 sm:group-hover:to-accent/30',
                'sm:group-hover:border-primary/50 sm:group-hover:shadow-2xl sm:group-hover:shadow-primary/20',
                'group-active:scale-95'
              ]"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary transition-all duration-300 ease-out group-hover:translate-y-[-3px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>

              <span
                v-for="i in 3"
                :key="i"
                :class="[
                  'absolute w-1 h-1 rounded-full bg-primary/60',
                  'transition-all duration-700 ease-out',
                  'opacity-0 group-hover:opacity-100'
                ]"
                :style="{
                  top: '-8px',
                  left: `${30 + i * 15}%`,
                  transitionDelay: `${i * 50}ms`
                }"
              />
            </div>

            <div
              class="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow opacity-0 sm:group-hover:opacity-100"
            />
          </div>
        </button>

        <template #content>
          {{ $t('global.upToTop') }}
        </template>
      </CdTooltip>
    </div>
  </Transition>
</template>

<style scoped>
.scroll-fade-enter-active {
  animation: scrollFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scroll-fade-leave-active {
  animation: scrollFadeOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes scrollFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8) rotate(180deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

@keyframes scrollFadeOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.8) rotate(-180deg);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@media (hover: hover) and (min-width: 640px) {
  button:hover {
    filter: drop-shadow(0 0 20px color-mix(in srgb, var(--primary) 40%, transparent));
  }
}

@media (max-width: 639px) {
  .fixed {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
