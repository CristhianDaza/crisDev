import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue',
  ],
  darkMode: 'class',
    theme: {
      extend: {
        colors: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          primary: 'var(--primary)',
          accent: 'var(--accent)',
          warning: 'var(--warning)',
          border: 'var(--border)',
          chip: 'var(--chip)'
        },
        borderRadius: {
          DEFAULT: 'var(--radius)',
          lg: 'var(--radius)'
        },
        boxShadow: {
          soft: 'var(--shadow)',
          DEFAULT: 'var(--shadow)'
        }
      }
    }
} satisfies Config
