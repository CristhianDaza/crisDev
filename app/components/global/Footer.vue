<script setup>
import { socialMediaLinks } from '~/data/constants'

const currentYear = new Date().getFullYear()

const sortedSocialMedia = computed(() =>
  socialMediaLinks.slice().sort((a, b) => a.order - b.order)
)
</script>

<template>
  <footer class="w-full border-t border-border bg-surface py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="text-sm text-muted">
        © {{ currentYear }} <span class="font-bold text-text">CrisDev</span>. {{ $t('footer.allRightsReserved')}}
      </div>

      <div class="flex items-center gap-4">
        <a
          v-for="social in sortedSocialMedia"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-muted hover:text-primary transition-colors"
          :aria-label="$t(social.name)"
        >
          <Icon :name="social.icon" class="w-5 h-5" />
        </a>
      </div>

      <div class="text-xs text-muted flex items-center gap-1">
        <span>Built with</span>
        <Icon name="logos:nuxt-icon" class="w-4 h-4" />
        <span>&</span>
        <Icon name="logos:tailwindcss-icon" class="w-4 h-4" />
      </div>
    </div>
  </footer>
</template>
