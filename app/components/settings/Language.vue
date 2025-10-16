<script setup>
const { locale, locales, changeLanguage } = useLanguage()

const handleLanguageChange = (langCode) => {
  changeLanguage(langCode)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Icon name="mdi:translate" class="w-5 h-5 text-primary" />
      <h3 class="text-lg font-medium text-white">
        {{ $t('settings.language.language') }}
      </h3>
    </div>
    <p class="text-sm text-gray-400">
      {{ $t('settings.language.languageDescription') }}
    </p>

    <div class="space-y-2">
      <button
        v-for="lang in locales"
        :key="lang.code"
        type="button"
        :class="[
          'w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200',
          locale === lang.code
            ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50 shadow-lg shadow-primary/10'
            : 'bg-gray-800/50 border-gray-700/50 hover:border-primary/30 hover:bg-gray-800/80'
          ]"
          @click="handleLanguageChange(lang.code)"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
            locale === lang.code
              ? 'bg-primary/30 text-primary'
              : 'bg-gray-700/50 text-gray-400'
            ]">
            {{ lang.code.toUpperCase() }}
          </div>
          <span
            :class="[
            'font-medium',
            locale === lang.code ? 'text-white' : 'text-gray-300'
          ]">
            {{ lang.name }}
          </span>
        </div>
        <div v-if="locale === lang.code" class="flex items-center gap-2">
          <Icon name="mdi:check-circle" class="w-5 h-5 text-primary" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
