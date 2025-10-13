<script setup>
import photoUrl from '../../assets/images/image-cris.png'

const skills = [
  'Vue',
  'Nuxt',
  'Tailwind',
  'TypeScript',
  'Node.js',
  'LitElement',
  'Firebase',
]

function scrollToId(id) {
  if (import.meta.client) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section
    class="relative overflow-hidden"
    style="background: radial-gradient(1200px 600px at 100% 0%, color-mix(in srgb, var(--primary) 20%, transparent), transparent);"
  >
    <div class="mx-auto max-w-7xl px-6 py-14 md:py-20">
      <div
        class="grid items-center gap-10 md:grid-cols-2 md:gap-12"
        style="min-height: 75vh;"
      >
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
            :class="'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'"
          >
            <span class="h-2 w-2 rounded-full bg-[var(--accent)]" />
            {{ $t('hero.role') }}
          </div>

          <h1 class="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span class="block">{{ $t('hero.greeting') }}</span>
            <span class="bg-clip-text text-transparent" style="background-image: linear-gradient(90deg, var(--primary), var(--accent));">Cristhian</span>
          </h1>

          <p class="mt-4 text-lg text-[var(--muted)] sm:text-xl">
            {{ $t('hero.description') }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold shadow transition"
              :class="'bg-[var(--primary)] text-white hover:brightness-110'"
              @click="scrollToId('contacto')"
            >
              {{ $t('hero.contactButton') }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold border transition"
              :class="'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[color-mix(in_srgb,_var(--surface),_var(--bg)_20%)]'"
              @click="scrollToId('proyectos')"
            >
              {{ $t('hero.projectsButton') }}
            </button>
          </div>

          <div class="mt-10 flex flex-wrap gap-2">
            <span
              v-for="tag in skills"
              :key="tag"
              class="rounded-full px-3 py-1 text-xs font-medium shadow"
              :class="'bg-[var(--chip)] text-white/90 shadow-[var(--shadow)]'"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="relative">
          <div
            class="mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius)] border shadow"
            :class="'border-[var(--border)] bg-transparent shadow-[var(--shadow)]'"
          >
            <img :src="photoUrl" alt="Foto de perfil" class="h-full w-full object-cover">
          </div>

          <div class="pointer-events-none absolute -left-3 -top-3 hidden select-none md:block">
            <div
              class="rounded-full border px-3 py-1 text-xs backdrop-blur"
              :class="'border-[var(--border)] bg-[color-mix(in_srgb,_var(--surface),_transparent_20%)] text-[var(--muted)]'"
            >
              UI/UX Friendly
            </div>
          </div>
          <div class="pointer-events-none absolute -right-3 bottom-6 hidden select-none md:block">
            <div
              class="rounded-full border px-3 py-1 text-xs backdrop-blur"
              :class="'border-[var(--border)] bg-[color-mix(in_srgb,_var(--surface),_transparent_20%)] text-[var(--muted)]'"
            >
              Performance
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 767px) {
  h1 {
    line-height: 1.15;
  }
}
</style>
