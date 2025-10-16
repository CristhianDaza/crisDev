<script setup>
import photoUrl from '../../assets/images/image-cris.png'

const router = useRouter()

function scrollToId(id) {
  if (import.meta.client) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState({}, '', `#${id}`)
      router.replace({ hash: `#${id}` })
    }
  }
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
</script>

<template>
  <div
    class="relative overflow-hidden min-h-screen flex items-center"
    style="background: radial-gradient(ellipse 1400px 800px at 60% 20%, color-mix(in srgb, var(--primary) 15%, transparent), transparent);"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style="background: radial-gradient(circle, var(--accent), transparent 70%);"
      />
      <div
        class="absolute top-1/2 -left-32 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style="background: radial-gradient(circle, var(--primary), transparent 70%);"
      />
    </div>

    <div class="relative mx-auto max-w-7xl px-6 py-16 w-full mt-12">
      <div
        class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
      >
        <div class="space-y-6 lg:space-y-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in border-border bg-[color-mix(in_srgb,_var(--surface),_transparent_40%)] text-text"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-accent"/>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5  bg-accent" />
            </span>
            {{ $t('hero.role') }}
          </div>

          <div class="space-y-3">
            <h1 class="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span class="block text-text animate-slide-up">{{ $t('hero.greeting') }}</span>
              <span
                class="block bg-clip-text text-transparent animate-slide-up-delay"
                style="background-image: linear-gradient(120deg, var(--primary), var(--accent));"
              >
                {{ $t('hero.name') }}.
              </span>
            </h1>
            <p class="text-lg sm:text-xl lg:text-2xl text-muted max-w-xl leading-relaxed animate-fade-in-delay">
              {{ $t('hero.description', { years: experience }) }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              class="group relative inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 bg-primary text-text"
              @click="scrollToId('contact')"
            >
              <span class="relative z-10">{{ $t('hero.contactButton') }}</span>
              <span class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" style="background: var(--primary);" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold border-2 transition-all duration-300 hover:scale-105 active:scale-95 border-border bg-surface text-text hover:border-primary"
              @click="scrollToId('projects')"
            >
              {{ $t('hero.projectsButton') }}
              <Icon name="mdi-arrow-right-bold" class="ml-2 w-4 h-4" />
            </button>
          </div>

          <div class="flex flex-wrap gap-2.5 pt-4">
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
                class="group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer animate-slide-up-delay bg-chip text-text/90 hover:text-text"
              >
                <Icon
                  v-if="social.icon"
                  :name="social.icon"
                  class="w-5 h-5"
                />
                <span
                  class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                  style="background: linear-gradient(135deg, var(--primary), var(--accent));"
                />
              </a>
            </CdTooltip>
          </div>
        </div>

        <div class="relative lg:pl-8">
          <div class="relative group">
            <div
              class="absolute inset-0 rounded-3xl opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
              style="background: linear-gradient(135deg, var(--primary), var(--accent));"
            />
            <div
              class="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] border-border bg-gradient-to-br from-surface to-transparent"
            >
              <img
                :src="photoUrl"
                :alt="$t('global.altImagePerfil')"
                class="h-full w-full object-cover"
              >
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--primary) 20%, transparent));" />
            </div>

            <div class="pointer-events-none absolute -left-6 -top-6 hidden select-none lg:block animate-float">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                ✨ {{ $t('hero.UI') }}
              </div>
            </div>

            <div class="pointer-events-none absolute -right-6 top-1/3 hidden select-none lg:block animate-float-delay">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                🚀 {{ $t('hero.performance') }}
              </div>
            </div>

            <div class="pointer-events-none absolute -left-8 bottom-12 hidden select-none lg:block animate-float">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl border-border text-text"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                💎 {{ $t('hero.codeQuality') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      aria-label="Scroll down"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted hover:text-primary transition-colors duration-300 cursor-pointer group animate-fade-in-delay-long z-10"
      @click="scrollToNextSection"
    >
      <span class="text-xs sm:text-sm font-medium">{{ $t('hero.scrollDown') }}</span>
      <div class="relative">
        <Icon
          name="mdi:chevron-down"
          class="w-6 h-6 sm:w-8 sm:h-8 animate-bounce"
        />
        <div class="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity">
          <Icon
            name="mdi:chevron-down"
            class="w-6 h-6 sm:w-8 sm:h-8 text-primary"
          />
        </div>
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
