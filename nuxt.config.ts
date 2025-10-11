// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
  ],
  css: ['~/assets/css/theme.css'],
  components: [
    {
      path: '~/components/global',
      prefix: 'Cv',
    }
  ],
})
