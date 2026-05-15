<script setup>
import photoUrl from '../../assets/images/image-cris.png'
import { socialMediaLinks } from '~/data/constants'

const router = useRouter()

const roles = ['Frontend Developer', 'Vue.js Enthusiast', 'Open Source Contributor']
const displayText = ref('')
const currentRoleIndex = ref(0)
const isDeleting = ref(false)
const typingSpeed = ref(100)

const type = () => {
  if (typeof window === 'undefined') return

  const currentRole = roles[currentRoleIndex.value]

  if (isDeleting.value) {
    displayText.value = currentRole.substring(0, displayText.value.length - 1)
    typingSpeed.value = 50
  } else {
    displayText.value = currentRole.substring(0, displayText.value.length + 1)
    typingSpeed.value = 150
  }

  if (!isDeleting.value && displayText.value === currentRole) {
    isDeleting.value = true
    typingSpeed.value = 2000
  } else if (isDeleting.value && displayText.value === '') {
    isDeleting.value = false
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
    typingSpeed.value = 500
  }

  setTimeout(type, typingSpeed.value)
}

onMounted(() => {
  type()
})

function scrollToId(id) {
  if (!import.meta.client) return

  const el = document.getElementById(id)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  router.replace({ hash: `#${id}` })
}

function scrollToNextSection() {
  if (import.meta.client) {
    const heroHeight = window.innerHeight
    window.scrollTo({ top: heroHeight, behavior: 'smooth' })
  }
}

const experience = computed(() => {
  return calculateYearsOfExperience()
})

const sortedSocialMedia = computed(() =>
  socialMediaLinks.slice().sort((a, b) => a.order - b.order)
)

const heroPills = [
  { key: 'hero.UI', icon: 'mdi:palette-outline' },
  { key: 'hero.performance', icon: 'mdi:speedometer' },
  { key: 'hero.codeQuality', icon: 'mdi:shield-check' },
]

const normalizeIconName = icon => {
  if (!icon) return ''
  return icon.includes(':') ? icon : icon.replace(/^mdi-/, 'mdi:')
}
</script>

<template>
  <div class="relative flex min-h-screen items-center overflow-hidden">
    <div class="relative mx-auto mt-12 w-full max-w-7xl px-6 py-20 md:py-24">
      <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div class="max-w-3xl space-y-7">
          <div class="inline-flex max-w-full items-center gap-2 rounded-full border border-card bg-card px-4 py-2 text-sm font-semibold text-muted shadow-card backdrop-blur">
            <span class="h-2 w-2 shrink-0 rounded-full bg-accent" />
            <span class="typewriter-cursor min-w-0 truncate">{{ displayText || '&nbsp;' }}</span>
          </div>

          <div class="space-y-5">
            <h1 class="text-5xl font-bold leading-tight tracking-tight text-text sm:text-6xl lg:text-7xl">
              <span class="block text-muted">{{ $t('hero.greeting') }}</span>
              <span class="block text-text">{{ $t('hero.name') }}.</span>
            </h1>
            <div class="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-accent" />
            <p class="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              {{ $t('hero.description', { years: experience }) }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <UIButton variant="primary" @click="scrollToId('contact')">
              {{ $t('hero.contactButton') }}
            </UIButton>
            <UIButton variant="secondary" icon="mdi:arrow-right-bold" @click="scrollToId('projects')">
              {{ $t('hero.projectsButton') }}
            </UIButton>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 pt-2">
            <CdTooltip
              v-for="social in sortedSocialMedia"
              :key="social.name"
              :content="$t(social.name)"
              variant="code"
            >
              <a
                :href="social.url || '#'"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="$t(social.name)"
                class="group relative flex h-10 w-10 items-center justify-center rounded-full border border-card bg-card text-text/85 shadow-sm transition-colors duration-300 hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Icon
                  v-if="social.icon"
                  :name="normalizeIconName(social.icon)"
                  class="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-accent"
                />
              </a>
            </CdTooltip>
          </div>
        </div>

        <div class="relative">
          <div class="relative mx-auto max-w-sm lg:max-w-md">
            <div class="overflow-hidden rounded-[calc(var(--radius)+10px)] border border-card bg-card p-2 shadow-card">
              <div class="relative overflow-hidden rounded-[calc(var(--radius)+2px)]">
                <img
                  :src="photoUrl"
                  :alt="$t('global.altImagePerfil')"
                  class="aspect-[4/5] h-full w-full object-cover"
                >
                <div
                  class="absolute inset-x-0 bottom-0 h-1/3"
                  style="background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg) 50%, transparent));"
                />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:absolute lg:-bottom-6 lg:left-1/2 lg:mt-0 lg:w-[128%] lg:-translate-x-1/2 xl:w-[120%]">
              <div
                v-for="pill in heroPills"
                :key="pill.key"
                class="flex items-center justify-center gap-2 rounded-full border border-card bg-card px-2.5 py-2.5 text-xs font-semibold text-text shadow-card backdrop-blur"
              >
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                  <Icon :name="pill.icon" class="h-4 w-4" />
                </span>
                <span class="whitespace-nowrap">{{ $t(pill.key) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      aria-label="Scroll down"
      class="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-muted transition-colors duration-300 hover:text-primary sm:flex"
      @click="scrollToNextSection"
    >
      <span class="text-xs sm:text-sm font-medium">{{ $t('hero.scrollDown') }}</span>
      <div class="relative">
        <Icon
          name="mdi:chevron-down"
          class="h-6 w-6 sm:h-8 sm:w-8"
        />
      </div>
    </button>
  </div>
</template>

<style scoped>
@media (max-width: 1023px) {
  h1 {
    line-height: 1.1;
  }
}
</style>
