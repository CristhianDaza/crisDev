// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    [
      '@nuxtjs/i18n',
      {
        defaultLocale: 'es',
        locales: [
          { code: 'es', name: 'Español', file: 'es.json' },
          { code: 'en', name: 'English', file: 'en.json' },
        ],
      },

    ],
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/theme.css'],
  components: [
    {
      path: '~/components/global',
      prefix: 'Cd'
    }
  ]
})
