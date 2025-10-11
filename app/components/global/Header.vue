<script setup>
defineProps({
  menus: {
    type: Array,
    default: () => [],
  }
})

const route = useRoute()
const hydrated = ref(false)
const isMenuOpen = ref(false)

const ensureHash = (href) => {
  if (!href) return ''
  return href.startsWith('#') ? href : `#${href}`
}

const isActive = (href) => {
  if (!href) return false
  const hash = href.startsWith('#') ? href : `#${href}`
  return route.hash === hash
}

const activeClassFor = (href) => {
  if (!hydrated.value) return ''
  return isActive(href) ? 'after:origin-left after:scale-x-100 text-primary' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

watch(() => route.fullPath, () => {
  if (isMenuOpen.value) closeMenu()
})

onMounted(() => {
  hydrated.value = true

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeMenu()
  }
  window.addEventListener('keydown', onKeydown)

  watch(isMenuOpen, (open) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  })
})
</script>

<template>
  <div class="bg-border m-auto text-text px-4 md:px-16 py-4 shadow-lg">
    <header class="flex items-center justify-between max-w-screen-xl m-auto">
      <div class="flex items-center gap-3">
        <img
          src="/assets/images/main-logo-cris-dev.png"
          alt="Cris Dev - Main Logo"
          class="h-7 w-9 drop-shadow-sm"
        >
        <h2 class="text-xl md:text-2xl tracking-wider text-text flex items-center font-bold">
          &lt;<span class="text-white">Cris</span><span class="text-primary">Dev</span> /&gt;
        </h2>
      </div>

      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-label="Abrir menú"
        @click="toggleMenu"
      >
        <svg v-if="!isMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <nav class="hidden md:flex flex-1 justify-end">
        <ul class="flex flex-wrap gap-5">
          <li v-for="{ name, id  } in menus" :key="id">
            <NuxtLink
              :to="ensureHash(id)"
              :class="[
                'relative inline-block text-text transition-colors duration-300 after:content-[\'\'] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-primary after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 font-bold after:transition-transform after:duration-500 after:ease-in-out uppercase',
                activeClassFor(id)
              ]"
              :aria-current="hydrated && isActive(id) ? 'page' : undefined"
            >
              <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold">/&gt;</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <div class="flex items-center gap-2">
            <img src="/assets/images/main-logo-cris-dev.png" alt="Cris Dev - Main Logo" class="h-7 w-9 drop-shadow-sm">
            <span class="font-bold text-lg">&lt;<span class="text-white">Cris</span><span class="text-primary">Dev</span> /&gt;</span>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar menú"
            @click="closeMenu"
          >
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav class="h-full w-full flex items-center justify-center">
          <ul class="flex flex-col items-center gap-6 p-6">
            <li v-for="{ name, id } in menus" :key="id">
              <NuxtLink
                :to="ensureHash(id)"
                class="text-2xl uppercase font-extrabold tracking-wide text-text hover:text-primary transition-colors duration-200"
                :class="[ hydrated && isActive(id) ? 'text-primary' : '' ]"
                :aria-current="hydrated && isActive(id) ? 'page' : undefined"
                @click="closeMenu"
              >
                <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold">/&gt;</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
