// https://nuxt.com/docs/api/configuration/nuxt-config
import { calculateYearsOfExperience, siteUrl } from './app/utils/helpers'
const years = calculateYearsOfExperience()

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],
  i18n: {
    defaultLocale: 'es',
    locales: [
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  css: ['~/assets/css/theme.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      title: 'Cristhian Daza | Frontend Developer',
      meta: [
        { name: 'description', content: `Desarrollador Frontend con más de ${years} años de experiencia creando experiencias web rápidas, accesibles y centradas en el usuario.` },
        { name: 'keywords', content: 'frontend developer, vue.js, nuxt, javascript, typescript, tailwind css, web development, desarrollador frontend, cristhian daza' },
        { name: 'author', content: 'Cristhian Daza' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

        { name: 'format-detection', content: 'telephone=no' },

        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'CrisDev' },

        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${siteUrl}/` },
        { property: 'og:title', content: 'Cristhian Daza | Frontend Developer' },
        { property: 'og:description', content: `Desarrollador Frontend con más de ${years} años de experiencia creando experiencias web rápidas, accesibles y centradas en el usuario.` },
        { property: 'og:image', content: `${siteUrl}/og-image.jpg` },
        { property: 'og:image:secure_url', content: `${siteUrl}/og-image.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Cristhian Daza - Frontend Developer Portfolio' },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:locale', content: 'es_ES' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { property: 'og:site_name', content: 'CrisDev' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@CristhianDaza' },
        { name: 'twitter:creator', content: '@CristhianDaza' },
        { name: 'twitter:url', content: `${siteUrl}/` },
        { name: 'twitter:title', content: 'Cristhian Daza | Frontend Developer' },
        { name: 'twitter:description', content: `Desarrollador Frontend con más de ${years} años de experiencia creando experiencias web rápidas, accesibles y centradas en el usuario.` },
        { name: 'twitter:image', content: `${siteUrl}/og-image.jpg` },
        { name: 'twitter:image:alt', content: 'Cristhian Daza - Frontend Developer Portfolio' },

        { name: 'theme-color', content: '#6366f1' },
        { name: 'msapplication-TileColor', content: '#6366f1' },
        { name: 'msapplication-TileImage', content: '/favicon.ico' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: `${siteUrl}/` },
        { rel: 'alternate', hreflang: 'es', href: `${siteUrl}/` },
        { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/` },
        { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Cristhian Daza',
            jobTitle: 'Frontend Developer',
            url: siteUrl,
            image: `${siteUrl}/og-image.jpg`,
            sameAs: [
              'https://github.com/CristhianDaza',
              'https://www.linkedin.com/in/cristhiandaza'
            ],
            knowsAbout: ['Vue.js', 'Nuxt', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Web Components', 'LitElement'],
            alumniOf: {
              '@type': 'Organization',
              name: 'Universidad'
            }
          })
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CrisDev - Cristhian Daza Portfolio',
            description: 'Portfolio de Cristhian Daza - Frontend Developer',
            url: siteUrl,
            inLanguage: ['es', 'en'],
            author: {
              '@type': 'Person',
              name: 'Cristhian Daza'
            }
          })
        }
      ]
    }
  },
  components: [
    {
      path: '~/components/global',
      prefix: 'Cd'
    },
    {
      path: '~/components/projects',
      prefix: 'CdPr'
    },
    {
      path: '~/components/settings',
      prefix: 'CdSe'
    }
  ],
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  }
})
