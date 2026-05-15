<script setup>
import { experiences } from '~/data/constants'
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
  <div id="experience-section" class="relative w-full">
    <div class="mb-12 max-w-3xl">
      <div
        class="mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      />
      <h2
        class="text-4xl font-bold tracking-normal text-text transition-all duration-500 md:text-5xl"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        {{ t('experience.title') }}
      </h2>
      <p
        class="mt-4 max-w-2xl text-base leading-8 text-muted transition-all delay-100 duration-500 md:text-lg"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        {{ t('experience.description') }}
      </p>
    </div>

    <div class="relative mx-auto max-w-5xl">
      <div
        class="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-primary/70 via-border to-accent/70 transition-all duration-700 md:left-1/2 md:-translate-x-1/2"
        :class="isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'"
      />

      <div
        v-for="(exp, index) in sortedExperiences"
        :key="exp.id"
        class="relative mb-8 pl-10 last:mb-0 md:mb-10 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
      >
        <div
          class="absolute left-4 top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-primary bg-surface shadow-sm transition-all duration-500 md:left-1/2"
          :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'"
          :style="`transition-delay: ${index * 120 + 120}ms`"
        />

        <div
          class="relative max-w-2xl transition-all duration-500 md:max-w-none"
          :class="[
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
            index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
          ]"
          :style="`transition-delay: ${index * 120}ms`"
        >
          <div
            class="group rounded-[var(--radius)] border border-border bg-surface/90 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-shadow md:p-6"
          >
            <div class="mb-5 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Icon name="mdi:calendar-range" class="h-3.5 w-3.5" />
                {{ formatDate(exp.startDate) }} - {{ exp.endDate ? formatDate(exp.endDate) : t('experience.present') }}
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <Icon name="mdi:timer-sand" class="h-3.5 w-3.5" />
                {{ calculateDuration(exp.startDate, exp.endDate) }}
              </span>
            </div>

            <h3 class="text-2xl font-bold leading-tight text-text transition-colors group-hover:text-primary">
              {{ t(exp.position) }}
            </h3>
            <h4 class="mt-2 text-base font-semibold text-primary md:text-lg">
              {{ t(exp.company) }}
            </h4>
            <p class="mt-4 text-sm leading-7 text-muted md:text-base">
              {{ t(exp.description) }}
            </p>
            <div class="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
              <UIChip
                v-for="tech in exp.technologies"
                :key="tech"
                :content="tech"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
