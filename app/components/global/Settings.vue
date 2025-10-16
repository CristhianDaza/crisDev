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
    <div class="fixed bottom-6 left-8 z-40 md:bottom-6">
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
          <div class="relative w-14 h-14 md:w-16 md:h-16">
            <div
              :class="[
                'absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md',
                'border border-primary/30 shadow-lg',
                'flex items-center justify-center',
                'transition-all duration-300 ease-out',
                'group-hover:scale-110 group-hover:from-primary/30 group-hover:to-accent/30',
                'group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20',
                'group-active:scale-95',
                isSettingsOpen && 'scale-110 from-primary/30 to-accent/30 border-primary/50'
              ]"
            >
              <Icon
                name="mdi:cog"
                :class="[
                  'w-7 h-7 md:w-8 md:h-8 transition-all duration-300',
                  'text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]',
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
