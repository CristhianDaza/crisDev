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

const experience = computed(() => {
  const start = new Date(2018, 6, 1)
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  const month = now.getMonth() - start.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < start.getDate())) {
    years--
  }
  return years
})

const sortedSocialMedia = computed(() =>
  socialMediaLinks.slice().sort((a, b) => a.order - b.order)
)
</script>

<template>
  <section
    class="relative overflow-hidden min-h-[80vh] flex items-center"
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

    <div class="relative mx-auto max-w-7xl px-6 py-16 md:py-24 w-full">
      <div
        class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
      >
        <div class="space-y-6 lg:space-y-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in"
            :class="'border-[var(--border)] bg-[color-mix(in_srgb,_var(--surface),_transparent_40%)] text-[var(--text)]'"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--accent);" />
              <span class="relative inline-flex rounded-full h-2.5 w-2.5" style="background-color: var(--accent);" />
            </span>
            {{ $t('hero.role') }}
          </div>

          <div class="space-y-3">
            <h1 class="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span class="block text-[var(--text)] animate-slide-up">{{ $t('hero.greeting') }}</span>
              <span
                class="block bg-clip-text text-transparent animate-slide-up-delay"
                style="background-image: linear-gradient(120deg, var(--primary), var(--accent));"
              >
                {{ $t('hero.name') }}.
              </span>
            </h1>
            <p class="text-lg sm:text-xl lg:text-2xl text-[var(--muted)] max-w-xl leading-relaxed animate-fade-in-delay">
              {{ $t('hero.description', { years: experience }) }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              class="group relative inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
              :class="'bg-[var(--primary)] text-text'"
              @click="scrollToId('contact')"
            >
              <span class="relative z-10">{{ $t('hero.contactButton') }}</span>
              <span class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" style="background: var(--primary);" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold border-2 transition-all duration-300 hover:scale-105 active:scale-95"
              :class="'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--primary)]'"
              @click="scrollToId('projects')"
            >
              {{ $t('hero.projectsButton') }}
              <svg class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div class="flex flex-wrap gap-2.5 pt-4">
            <CdTooltip
              v-for="social in sortedSocialMedia"
              :key="social.name"
              :content="$t(social.name)"
              variant="primary"
            >
              <a
                :href="social.url || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 cursor-pointer animate-slide-up-delay"
                :class="'bg-[var(--chip)] text-white/90 hover:text-white'"
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
              class="relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border-4 shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
              :class="'border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-transparent'"
            >
              <img
                :src="photoUrl"
                alt="Foto de perfil - Cristhian"
                class="h-full w-full object-cover"
              >
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--primary) 20%, transparent));" />
            </div>

            <div class="pointer-events-none absolute -left-6 -top-6 hidden select-none lg:block animate-float">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl"
                :class="'border-[var(--border)] text-[var(--text)]'"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                ✨ {{ $t('hero.UI') }}
              </div>
            </div>

            <div class="pointer-events-none absolute -right-6 top-1/3 hidden select-none lg:block animate-float-delay">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl"
                :class="'border-[var(--border)] text-[var(--text)]'"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                🚀 {{ $t('hero.performance') }}
              </div>
            </div>

            <div class="pointer-events-none absolute -left-8 bottom-12 hidden select-none lg:block animate-float">
              <div
                class="rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-md shadow-xl"
                :class="'border-[var(--border)] text-[var(--text)]'"
                style="background: color-mix(in srgb, var(--surface) 80%, transparent);"
              >
                💎 {{ $t('hero.codeQuality') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 1023px) {
  h1 {
    line-height: 1.1;
  }
}
</style>
