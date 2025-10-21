<script setup>
const { theme, themes, changeTheme } = useTheme()

const handleThemeChange = (newTheme) => {
  changeTheme(newTheme)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <Icon name="mdi:palette" class="w-5 h-5 text-primary" />
      <h3 class="text-lg font-medium text-white">
        {{ $t('settings.theme.theme') }}
      </h3>
    </div>
    <p class="text-sm text-gray-400">
      {{ $t('settings.theme.themeDescription') }}
    </p>

    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="themeOption in themes"
        :key="themeOption.value"
        type="button"
        class="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 group"
        :class="[
          theme === themeOption.value
            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
            : 'bg-gray-800/30 border-gray-700/50 hover:border-primary/50 hover:bg-gray-800/50'
        ]"
        @click="handleThemeChange(themeOption.value)"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
          :class="[
            theme === themeOption.value
              ? 'bg-primary/20 text-primary'
              : 'bg-gray-700/50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
          ]"
        >
          <Icon :name="themeOption.icon" class="w-5 h-5" />
        </div>

        <span
          class="text-xs font-medium transition-colors duration-300"
          :class="[
            theme === themeOption.value
              ? 'text-primary'
              : 'text-gray-400 group-hover:text-gray-300'
          ]"
        >
          {{ themeOption.label }}
        </span>

        <div
          v-if="theme === themeOption.value"
          class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
        >
          <Icon name="mdi:check" class="w-3 h-3 text-white" />
        </div>
      </button>
    </div>
  </div>
</template>
