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
const activeExperienceId = ref(sortedExperiences.value[0]?.id || null)
const visibleExperienceIds = ref(new Set())
const timelineRef = ref(null)
const timelineProgress = ref(0)
const experienceElements = new Map()
let sectionObserver = null
let itemObserver = null
let scrollTicking = false

const setExperienceElement = (id, element) => {
  if (element) {
    experienceElements.set(id, element)
  } else {
    experienceElements.delete(id)
  }
}

const revealExperience = (id) => {
  if (visibleExperienceIds.value.has(id)) return

  visibleExperienceIds.value = new Set([...visibleExperienceIds.value, id])
}

const isActiveExperience = (id) => activeExperienceId.value === id
const isVisibleExperience = (id) => visibleExperienceIds.value.has(id)

const updateActiveExperience = () => {
  if (!import.meta.client || experienceElements.size === 0) return

  const anchor = window.innerHeight * 0.42
  let closestId = activeExperienceId.value
  let closestDistance = Number.POSITIVE_INFINITY

  experienceElements.forEach((element, id) => {
    const rect = element.getBoundingClientRect()
    const elementAnchor = rect.top + rect.height * 0.3
    const distance = Math.abs(elementAnchor - anchor)

    if (rect.bottom > 0 && rect.top < window.innerHeight && distance < closestDistance) {
      closestDistance = distance
      closestId = id
    }
  })

  if (closestId) {
    activeExperienceId.value = closestId
  }
}

const updateTimelineProgress = () => {
  if (!import.meta.client || !timelineRef.value) return

  const rect = timelineRef.value.getBoundingClientRect()
  const anchor = window.innerHeight * 0.42
  const scrollableDistance = Math.max(rect.height - anchor, 1)
  const progress = ((anchor - rect.top) / scrollableDistance) * 100

  timelineProgress.value = Math.min(100, Math.max(0, progress))
}

const updateScrollState = () => {
  if (scrollTicking) return

  scrollTicking = true
  window.requestAnimationFrame(() => {
    updateTimelineProgress()
    updateActiveExperience()
    scrollTicking = false
  })
}

const getExperienceCardStyle = (exp, index) => ({
  transitionDelay: `${index * 120}ms`,
  borderColor: isActiveExperience(exp.id) ? 'color-mix(in srgb, var(--primary) 78%, var(--accent))' : undefined,
  boxShadow: isActiveExperience(exp.id)
    ? '0 24px 60px color-mix(in srgb, var(--primary) 22%, transparent)'
    : undefined,
})

onMounted(async () => {
  if (!import.meta.client) return

  await nextTick()

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    })
  }, { threshold: 0.1 })

  itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealExperience(Number(entry.target.dataset.experienceId))
      }
    })

    updateActiveExperience()
  }, {
    rootMargin: '-24% 0px -40% 0px',
    threshold: [0.18, 0.35, 0.55, 0.75],
  })

  const section = document.querySelector('#experience-section')
  if (section) {
    sectionObserver.observe(section)
  }

  experienceElements.forEach((element) => {
    itemObserver.observe(element)
  })

  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState)
})

onUnmounted(() => {
  sectionObserver?.disconnect()
  itemObserver?.disconnect()

  if (import.meta.client) {
    window.removeEventListener('scroll', updateScrollState)
    window.removeEventListener('resize', updateScrollState)
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

    <div ref="timelineRef" class="relative mx-auto max-w-5xl">
      <div
        class="absolute bottom-0 left-4 top-0 w-px origin-top bg-border transition-all duration-700 md:left-1/2 md:-translate-x-1/2"
        :class="isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'"
      />
      <div
        class="absolute left-4 top-0 w-px origin-top bg-gradient-to-b from-primary via-accent to-primary transition-[height,opacity] duration-300 md:left-1/2 md:-translate-x-1/2"
        :class="isVisible ? 'opacity-100' : 'opacity-0'"
        :style="{ height: `${timelineProgress}%` }"
      />

      <div
        v-for="(exp, index) in sortedExperiences"
        :key="exp.id"
        :ref="(element) => setExperienceElement(exp.id, element)"
        :data-experience-id="exp.id"
        class="relative mb-8 pl-10 last:mb-0 md:mb-10 md:grid md:grid-cols-2 md:gap-10 md:pl-0"
      >
        <div
          class="absolute left-4 top-7 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 bg-surface shadow-sm transition-all duration-500 md:left-1/2"
          :class="[
            isVisibleExperience(exp.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            isActiveExperience(exp.id) ? 'border-accent shadow-[0_0_0_8px_color-mix(in_srgb,var(--accent)_16%,transparent)]' : 'border-primary'
          ]"
          :style="`transition-delay: ${index * 120 + 120}ms`"
        />

        <div
          class="relative max-w-2xl transition-all duration-500 md:max-w-none"
          :class="[
            isVisibleExperience(exp.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
            index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
          ]"
          :style="`transition-delay: ${index * 120}ms`"
        >
          <div
            class="group rounded-[var(--radius)] border border-card bg-card p-5 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/80 md:p-6"
            :class="isActiveExperience(exp.id) ? 'ring-1 ring-primary/20' : ''"
            :style="getExperienceCardStyle(exp, index)"
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
