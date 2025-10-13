<script setup>
useHead({
  htmlAttrs: {
    class: 'dark'
  }
})

const { locales, setLocale } = useI18n()
</script>

<template>
  <CvHeader :menus="mainMenu" />
  <CvHero />

  <button
    v-for="locale in locales"
    :key="locale.code"
    class="m-2 rounded border border-gray-300 bg-white px-3 py-1 text-sm shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    @click="setLocale(locale.code)"
  >
    {{ locale.name }}
  </button>

  <section id="projects" class="mx-auto max-w-7xl px-6 py-20">
    <h2 class="mb-4 text-2xl font-semibold">Proyectos</h2>
    <p class="text-[var(--muted)]">Aquí podrás listar tus trabajos destacados.</p>
  </section>

  <section id="contact" class="mx-auto max-w-7xl px-6 pb-24">
    <h2 class="mb-4 text-2xl font-semibold">Contacto</h2>
    <p class="text-[var(--muted)]">Incluye un formulario o tus enlaces de contacto.</p>
  </section>
</template>
