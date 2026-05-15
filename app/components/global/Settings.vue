<script setup>
const isSettingsOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const closeSettings = () => {
  isSettingsOpen.value = false
}
</script>

<template>
  <div>
    <div class="fixed bottom-4 left-4 z-[60] sm:bottom-6 sm:left-6 md:left-8">
      <CdTooltip
        position="right"
        variant="code"
        :delay="100"
        :offset="12"
        :show-arrow="false"
      >
        <button
          type="button"
          class="group"
          :aria-label=" $t('settings.openSettings')"
          @click="toggleSettings"
        >
          <div class="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
            <div
              :class="[
                'absolute inset-0 rounded-full bg-card backdrop-blur-md',
                'border border-card shadow-card',
                'flex items-center justify-center',
                'transition-all duration-300 ease-out',
                'group-hover:border-primary/60 group-hover:shadow-card',
                'group-active:scale-95',
                isSettingsOpen && 'border-primary/60'
              ]"
            >
              <Icon
                name="mdi:cog"
                :class="[
                  'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-300',
                  'text-primary drop-shadow-sm',
                  'group-hover:rotate-90',
                  isSettingsOpen ? 'rotate-90' : ''
                ]"
              />
            </div>

            <svg
              class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :style="`stop-color: var(--primary); stop-opacity: 0.6`" />
                  <stop offset="100%" :style="`stop-color: var(--accent); stop-opacity: 0.6`" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#settingsGradient)"
                stroke-width="2"
                :stroke-dasharray="301"
                :stroke-dashoffset="isSettingsOpen ? 0 : 301"
                stroke-linecap="round"
                class="transition-all duration-500 ease-out"
              />
            </svg>
          </div>
        </button>

        <template #content>
          <span class="text-xs font-medium">{{  $t('settings.title') }}</span>
        </template>
      </CdTooltip>
    </div>

    <CdSeSidebar :is-open="isSettingsOpen" @close="closeSettings" />
  </div>
</template>
