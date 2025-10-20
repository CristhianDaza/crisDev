<script setup>
import { useI18n } from '#imports'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 500, message: '' })
  }
})

const { t } = useI18n()
const { initializeTheme } = useTheme()

const is404 = computed(() => props.error?.statusCode === 404)
const is500 = computed(() => props.error?.statusCode === 500 || props.error?.statusCode >= 500)

const errorType = computed(() => {
  if (is404.value) return '404'
  if (is500.value) return '500'
  return '500'
})

const errorData = computed(() => ({
  title: t(`errors.${errorType.value}.title`),
  heading: t(`errors.${errorType.value}.heading`),
  description: t(`errors.${errorType.value}.description`),
  button: t(`errors.${errorType.value}.button`)
}))

const handleError = () => clearError({ redirect: '/' })

onMounted(() => {
  initializeTheme()
})

useHead({
  title: errorData.value.title,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-4 md:p-8 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute w-[300px] h-[300px] -top-[150px] -right-[150px] rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-10 blur-[80px] animate-pulse-slow" />
      <div class="absolute w-[200px] h-[200px] -bottom-[100px] -left-[100px] rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-10 blur-[80px] animate-pulse-slower" />
      <div class="absolute w-[150px] h-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-10 blur-[60px] animate-pulse-slowest" />
    </div>

    <div class="relative z-10 w-full max-w-2xl">
      <div class="text-center animate-fade-in-up">
        <div class="text-[var(--primary)] mb-4 md:mb-6 animate-float flex justify-center">
          <Icon
            v-if="is404"
            name="mdi:alert-circle-outline"
            class="w-28 h-28 md:w-32 md:h-32"
          />
          <Icon
            v-else
            name="mdi:server-off"
            class="w-28 h-28 md:w-32 md:h-32"
          />
        </div>

        <div
          class="text-6xl sm:text-8xl md:text-9xl font-extrabold font-[family-name:var(--font-headings)] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent leading-none mb-3 md:mb-4 text-center"
        >
          {{ props.error?.statusCode || 500 }}
        </div>

        <h1 class="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-headings)] font-bold mb-3 md:mb-4 text-[var(--text)] text-center">
          {{ errorData.heading }}
        </h1>

        <p class="text-base sm:text-lg text-[var(--muted)] mb-8 md:mb-10 leading-relaxed max-w-lg mx-auto px-4 text-center">
          {{ errorData.description }}
        </p>

        <div class="flex justify-center">
          <button
            class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(58,167,227,0.3)] hover:shadow-[0_6px_20px_rgba(58,167,227,0.4)] hover:-translate-y-0.5 active:translate-y-0 font-[family-name:var(--font-body)]"
            @click="handleError"
          >
            <Icon name="tabler:home" class="w-5 h-5" />
            <span>{{ errorData.button }}</span>
          </button>
        </div>

        <details
          v-if="props.error?.message"
          class="mt-8 md:mt-12 text-left bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 max-w-lg mx-auto"
        >
          <summary class="cursor-pointer font-semibold text-[var(--muted)] mb-2 hover:text-[var(--text)] transition-colors">
            {{ t('errors.technicalDetails') }}
          </summary>
          <pre class="text-sm text-[var(--muted)] overflow-x-auto whitespace-pre-wrap break-words">{{ props.error }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 4s ease-in-out infinite;
}

.animate-pulse-slower {
  animation: pulse 5s ease-in-out infinite reverse;
}

.animate-pulse-slowest {
  animation: pulse 6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.15;
  }
}
</style>
