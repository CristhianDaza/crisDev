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
const scrollPosition = ref(0)
const isScrollingProgrammatically = ref(false)

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
    const currentScroll = scrollPosition.value
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, currentScroll)
  }
}

const toggleMenu = () => {
  if (typeof document !== 'undefined') {
    if (!isMenuOpen.value) {
      scrollPosition.value = window.scrollY
      isMenuOpen.value = true
      requestAnimationFrame(() => {
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollPosition.value}px`
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'
      })
    } else {
      closeMenu()
    }
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  if (!isScrollingProgrammatically.value && hydrated.value) {
    detectCurrentSection()
  }
}

const detectCurrentSection = () => {
  if (typeof document === 'undefined' || !props.menus) return

  const scrollY = window.scrollY

  if (scrollY < 200) {
    if (route.hash !== '#home') {
      router.replace({ hash: '#home' })
    }
    return
  }

  const menuIds = props.menus.map(item => {
    const id = item.id || ''
    return id.startsWith('#') ? id.substring(1) : id
  }).filter(Boolean)

  if (menuIds.length === 0) return

  const windowHeight = window.innerHeight

  let currentSection = null
  let maxVisibility = 0

  menuIds.forEach((sectionId) => {
    if (sectionId.startsWith('__') || sectionId === 'teleports') return

    const section = document.getElementById(sectionId)
    if (!section) return

    try {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + scrollY
      const sectionBottom = sectionTop + rect.height

      const viewportTop = scrollY
      const viewportBottom = scrollY + windowHeight

      const visibleTop = Math.max(sectionTop, viewportTop)
      const visibleBottom = Math.min(sectionBottom, viewportBottom)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      if (visibleHeight > maxVisibility && visibleHeight > 100) {
        maxVisibility = visibleHeight
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

const scrollToSection = (href) => {
  if (import.meta.client) {
    const hash = href.startsWith('#') ? href.substring(1) : href
    const wasMenuOpen = isMenuOpen.value

    isScrollingProgrammatically.value = true

    if (wasMenuOpen) {
      const currentScroll = scrollPosition.value
      isMenuOpen.value = false

      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, currentScroll)
      }

      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          router.push({ hash: `#${hash}` })
          setTimeout(() => {
            isScrollingProgrammatically.value = false
          }, 1000)
        }
      }, 250)
    } else {
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        router.push({ hash: `#${hash}` })
        setTimeout(() => {
          isScrollingProgrammatically.value = false
        }, 1000)
      }
    }
  }
}

watch(() => route.fullPath, () => {
  if (isMenuOpen.value) closeMenu()
})

onMounted(() => {
  hydrated.value = true
  window.addEventListener('scroll', handleScroll)

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeMenu()
  }
  window.addEventListener('keydown', onKeydown)

  setTimeout(() => {
    detectCurrentSection()
  }, 100)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('keydown', onKeydown)
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  })
})
</script>

<template>
  <div
    :class="[
      'fixed top-0 left-0 right-0 z-50 m-auto text-text px-4 md:px-16 transition-all duration-500 ease-in-out',
      isScrolled
        ? 'py-2 bg-border/90 backdrop-blur-md shadow-2xl'
        : 'py-4 bg-border shadow-lg'
    ]"
  >
    <header class="flex items-center justify-between max-w-screen-xl m-auto">
      <div
        :class="[
          'flex items-center gap-3 transition-all duration-500',
          isScrolled ? 'scale-90' : 'scale-100'
        ]"
      >
        <img
          :src="logoUrl"
          :alt="$t('global.altLogo')"
          :class="[
            'drop-shadow-sm transition-all duration-500',
            isScrolled ? 'h-6 w-8' : 'h-7 w-9'
          ]"
        >
        <h2
          :class="[
            'tracking-wider text-text flex items-center font-bold transition-all duration-500',
            isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
          ]"
        >
          &lt;<span class="text-text">Cris</span><span class="text-primary">Dev</span> /&gt;
        </h2>
      </div>

      <button
        type="button"
        class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-label="Abrir menú"
        @click="toggleMenu"
      >
        <Icon v-if="!isMenuOpen" name="mdi:menu" class="h-6 w-6" />
        <Icon v-else name="mdi:close" class="h-6 w-6" />
      </button>

      <nav class="hidden md:flex flex-1 justify-end">
        <ul class="flex flex-wrap gap-5">
          <li v-for="{ name, id  } in menus" :key="id">
            <NuxtLink
              :to="ensureHash(id)"
              :class="[
                'relative inline-block text-text transition-colors duration-300 after:content-[\'\'] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-primary after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 font-bold after:transition-transform after:duration-500 after:ease-in-out uppercase cursor-pointer',
                activeClassFor(id)
              ]"
              :aria-current="hydrated && isActive(id) ? 'page' : undefined"
              @click.prevent="scrollToSection(id)"
            >
              <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold" >/&gt;</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <Transition name="menu-fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        @click.self="toggleMenu"
      >
        <div class="flex items-center justify-between p-4 bg-border/80 backdrop-blur-sm shadow-lg flex-shrink-0">
          <div class="flex items-center gap-2">
            <img :src="logoUrl" :alt="$t('global.altLogo')" class="h-7 w-9 drop-shadow-sm">
            <span class="font-bold text-lg">&lt;<span class="text-text">Cris</span><span class="text-primary">Dev</span> /&gt;</span>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
            aria-label="Cerrar menú"
            @click="toggleMenu"
          >
            <Icon name="mdi:close" class="h-7 w-7" />
          </button>
        </div>

        <nav class="flex-1 flex items-center justify-center overflow-y-auto">
          <ul class="flex flex-col items-center gap-8 p-6 my-auto">
            <li v-for="{ name, id } in menus" :key="id" class="w-full text-center">
              <NuxtLink
                :to="ensureHash(id)"
                class="text-3xl uppercase font-extrabold tracking-wide text-text hover:text-primary transition-all duration-300 cursor-pointer block py-3 hover:scale-110 transform"
                :class="[ hydrated && isActive(id) ? 'text-primary scale-110' : '' ]"
                :aria-current="hydrated && isActive(id) ? 'page' : undefined"
                @click.prevent="scrollToSection(id)"
              >
                <span class="text-primary font-bold">&lt;</span> {{ $t(name) }} <span class="text-primary font-bold" >/&gt;</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.menu-fade-enter-active {
  transition: opacity 200ms ease-out;
}

.menu-fade-leave-active {
  transition: opacity 150ms ease-in;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
