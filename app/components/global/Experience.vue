<script setup>
const { t } = useI18n()

const sortedExperiences = computed(() =>
  experiences.slice().sort((a, b) => {
    const aDate = a.startDate.year * 12 + a.startDate.month
    const bDate = b.startDate.year * 12 + b.startDate.month
    return bDate - aDate
  })
)

const formatDate = (date) => {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]

  if (!date) return t('experience.present')

  const monthName = months[date.month - 1]
  return `${monthName} ${date.year}`
}

const calculateDuration = (startDate, endDate) => {
  const end = endDate ? new Date(endDate.year, endDate.month - 1) : new Date()
  const start = new Date(startDate.year, startDate.month - 1)

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  const parts = []
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? t('experience.year') : t('experience.years')}`)
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? t('experience.month') : t('experience.months')}`)
  }

  return parts.length > 0 ? parts.join(' ') : `1 ${t('experience.month')}`
}

const isVisible = ref(false)

onMounted(() => {
  if (import.meta.client) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    }, { threshold: 0.1 })

    const section = document.querySelector('#experience-section')
    if (section) {
      observer.observe(section)
    }
  }
})
</script>

<template>
  <div id="experience-section" class="w-full">
    <div class="text-center mb-16">
      <h2
        class="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        {{ t('experience.title') }}
      </h2>
      <p
        class="text-muted text-lg max-w-2xl mx-auto transition-all duration-700 delay-100"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        {{ t('experience.description') }}
      </p>
    </div>
    <div class="relative max-w-5xl mx-auto">
      <div
        class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full transition-all duration-1000 bg-gradient-to-b from-primary to-accent origin-top"
        :class="isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'"
      />
      <div
        v-for="(exp, index) in sortedExperiences"
        :key="exp.id"
        class="relative mb-16 last:mb-0"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div
            class="relative transition-all duration-700"
            :class="[
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0',
              index % 2 === 0 ? '-translate-x-8' : 'translate-x-8 md:col-start-2'
            ]"
            :style="`transition-delay: ${index * 150}ms`"
          >
            <div
              class="p-6 rounded-2xl backdrop-blur-sm border border-border bg-surface transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'"
            >
              <div class="mb-3 flex flex-col gap-2" :class="index % 2 === 0 ? 'md:items-end' : 'md:items-start'">
                <div
                  class="inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary"
                >
                  {{ formatDate(exp.startDate) }} - {{ exp.endDate ? formatDate(exp.endDate) : t('experience.present') }}
                </div>
                <div
                  class="inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-accent"
                >
                  {{ calculateDuration(exp.startDate, exp.endDate) }}
                </div>
              </div>
              <h3
                class="text-2xl font-bold mb-2 transition-colors text-text"
              >
                {{ t(exp.position) }}
              </h3>
              <h4
                class="text-lg font-semibold mb-3 transition-colors text-primary"
              >
                {{ t(exp.company) }}
              </h4>
              <p
                class="mb-4 leading-relaxed text-muted"
              >
                {{ t(exp.description) }}
              </p>
              <div class="flex flex-wrap gap-2" :class="index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'">
                <span
                  v-for="tech in exp.technologies"
                  :key="tech"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-110 bg-chip text-text opacity-90"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 hidden md:block transition-all duration-500 z-10"
          :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
          :style="`transition-delay: ${index * 150 + 200}ms`"
        >
          <div
            class="w-4 h-4 rounded-full border-4 border-primary bg-surface transition-all duration-300 hover:scale-150"
          >
            <div
              class="absolute inset-0 rounded-full animate-ping opacity-75 text-primary"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-5 blur-3xl bg-[radial-gradient(circle,var(--accent),transparent_70%)]"
      />
      <div
        class="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl bg-[radial-gradient(circle,var(--primary),transparent_70%)]"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
