<script setup>
import logoUrl from '../../assets/images/main-logo-cris-dev.png'

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  }
})

const route = useRoute()
const router = useRouter()
const hydrated = ref(false)
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isManualNavigation = ref(false)
const skipHomeDetection = ref(false)
let manualNavigationTimeout = null
let scrollDetectionTimeout = null
let skipHomeDetectionTimeout = null

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
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

const toggleMenu = () => {
  if (typeof document === 'undefined') return
  if (!isMenuOpen.value) {
    isMenuOpen.value = true
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
  } else {
    closeMenu()
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  if (scrollDetectionTimeout) {
    clearTimeout(scrollDetectionTimeout)
  }

  scrollDetectionTimeout = setTimeout(() => {
    if (!isMenuOpen.value && hydrated.value && !isManualNavigation.value) {
      detectCurrentSection()
    }
  }, 150)
}

const detectCurrentSection = () => {
  if (typeof document === 'undefined' || !props.menus) return
  if (isMenuOpen.value || isManualNavigation.value) return

  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  const menuIds = props.menus.map(item => {
    const id = item.id || ''
    return id.startsWith('#') ? id.substring(1) : id
  }).filter(Boolean)

  if (menuIds.length === 0) return

  if (scrollY < 100) {
    if (skipHomeDetection.value) return
    if (route.hash !== '#home') {
      router.replace({ hash: '#home' })
    }
    return
  }

  let currentSection = null
  let maxVisibility = 0

  menuIds.forEach((sectionId) => {
    if (sectionId.startsWith('__') || sectionId === 'teleports') return

    const section = document.getElementById(sectionId)
    if (!section) return

    try {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionBottom = rect.bottom

      const visibleTop = Math.max(sectionTop, 0)
      const visibleBottom = Math.min(sectionBottom, windowHeight)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      const isNearTop = sectionTop >= -50 && sectionTop <= 150

      let score = visibleHeight
      if (isNearTop) {
        score += 200
      }

      if (score > maxVisibility && visibleHeight > 100) {
        maxVisibility = score
        currentSection = sectionId
      }
    } catch {
      console.warn('Detecting section failed for:', sectionId);
    }
  })

  if (currentSection && route.hash !== `#${currentSection}`) {
    router.replace({ hash: `#${currentSection}` })
  }
}

const scheduleManualNavigationReset = (duration = 1000) => {
  isManualNavigation.value = true
  if (manualNavigationTimeout) {
    clearTimeout(manualNavigationTimeout)
  }
  manualNavigationTimeout = setTimeout(() => {
    isManualNavigation.value = false
    detectCurrentSection()
  }, duration)
}

const scrollIntoViewById = (id, behavior = 'smooth') => {
  if (!id || typeof document === 'undefined') return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

const handleInitialHashNavigation = () => {
  if (!import.meta.client) return
  const hash = route.hash
  if (!hash || hash === '#home') return

  if (skipHomeDetectionTimeout) {
    clearTimeout(skipHomeDetectionTimeout)
  }
  skipHomeDetection.value = true
  skipHomeDetectionTimeout = setTimeout(() => {
    skipHomeDetection.value = false
  }, 2000)

  scheduleManualNavigationReset(1200)
  nextTick(() => {
    requestAnimationFrame(() => {
      scrollIntoViewById(hash.slice(1), 'auto')
    })
  })
}

const scrollToSection = (href) => {
  if (!import.meta.client || !href) return

  const hash = href.startsWith('#') ? href : `#${href}`
  const id = hash.slice(1)

  if (route.hash !== hash) {
    router.replace({ hash })
  }

  scheduleManualNavigationReset()
  scrollIntoViewById(id)
}

onMounted(() => {
  hydrated.value = true
  window.addEventListener('scroll', handleScroll, { passive: true })

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeMenu()
  }
  window.addEventListener('keydown', onKeydown)

  handleInitialHashNavigation()
  setTimeout(() => {
    detectCurrentSection()
  }, 100)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', onKeydown)
    if (manualNavigationTimeout) {
      clearTimeout(manualNavigationTimeout)
    }
    if (scrollDetectionTimeout) {
      clearTimeout(scrollDetectionTimeout)
    }
    if (skipHomeDetectionTimeout) {
      clearTimeout(skipHomeDetectionTimeout)
    }
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  })
})
</script>

<template>
  <div
    :class="[
      'fixed left-0 right-0 top-0 z-50 m-auto px-4 text-text transition-all duration-300 ease-in-out sm:px-6 md:px-8 lg:px-16',
      isScrolled
        ? 'py-2'
        : 'py-3'
    ]"
  >
    <header
      :class="[
        'm-auto flex w-full max-w-screen-xl items-center justify-between rounded-full border px-4 backdrop-blur-xl transition-all duration-300',
        isScrolled
          ? 'border-card bg-card py-2 shadow-card'
          : 'border-card bg-card py-2.5 shadow-sm'
      ]"
    >
      <div
        :class="[
          'flex min-w-0 items-center gap-3 transition-all duration-300',
          isScrolled ? 'scale-[0.96]' : 'scale-100'
        ]"
      >
        <img
          :src="logoUrl"
          :alt="$t('global.altLogo')"
          :class="[
            'drop-shadow-sm transition-all duration-300',
            isScrolled ? 'h-6 w-8' : 'h-7 w-9'
          ]"
        >
        <h2
          :class="[
            'flex items-center truncate tracking-wider text-text font-bold transition-all duration-300',
            isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
          ]"
        >
          &lt;<span class="text-text">Cris</span><span class="text-primary">Dev</span> /&gt;
        </h2>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-transparent p-2 text-primary transition-colors hover:border-primary/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-label="Abrir menú"
        @click="toggleMenu"
      >
        <Icon v-if="!isMenuOpen" name="mdi:menu" class="h-6 w-6" />
        <Icon v-else name="mdi:close" class="h-6 w-6" />
      </button>

      <nav class="hidden md:flex flex-1 justify-end">
        <ul class="flex flex-wrap gap-2">
          <li v-for="{ name, id  } in menus" :key="id">
            <NuxtLink
              :to="ensureHash(id)"
              :class="[
                'relative inline-flex rounded-full px-3 py-2 text-xs font-bold uppercase text-text transition-colors duration-300 after:absolute after:bottom-1.5 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out after:content-[\'\'] hover:bg-primary/10 hover:text-primary hover:after:origin-left hover:after:scale-x-100',
                activeClassFor(id)
              ]"
              :aria-current="hydrated && isActive(id) ? 'page' : undefined"
              @click.prevent="scrollToSection(id)"
            >
              <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold"> /&gt; </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <Transition name="menu-fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[100] flex h-screen w-screen flex-col bg-black/90 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        @click.self="closeMenu"
      >
        <div class="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-black/70 p-4 shadow-lg backdrop-blur-sm">
          <div class="flex items-center gap-2">
            <img :src="logoUrl" :alt="$t('global.altLogo')" class="h-7 w-9 drop-shadow-sm">
            <span class="font-bold text-lg">&lt;<span class="text-white">Cris</span><span class="text-primary">Dev</span> /&gt;</span>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-primary transition-colors duration-200 hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar menú"
            @click="closeMenu"
          >
            <Icon name="mdi:close" class="h-7 w-7" />
          </button>
        </div>

        <nav class="flex-1 flex items-center justify-center overflow-y-auto">
          <ul class="flex flex-col items-center gap-6 p-6 my-auto">
            <li v-for="{ name, id } in menus" :key="id" class="w-full text-center">
              <a
                :href="ensureHash(id)"
                class="block w-full rounded-full py-3 text-2xl font-extrabold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-white/5 hover:text-primary"
                :class="[ hydrated && isActive(id) ? 'text-primary' : '' ]"
                :aria-current="hydrated && isActive(id) ? 'page' : undefined"
                @click.prevent="scrollToSection(id); closeMenu()"
              >
                <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold">/&gt;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
:global(.menu-fade-enter-active) {
  transition: opacity 200ms ease-out;
}

:global(.menu-fade-leave-active) {
  transition: opacity 150ms ease-in;
}

:global(.menu-fade-enter-from),
:global(.menu-fade-leave-to) {
  opacity: 0;
}
</style>
