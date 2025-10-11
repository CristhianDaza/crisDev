<script setup>
defineProps({
  menus: {
    type: Array,
    default: () => [],
  }
})

const route = useRoute()

const hydrated = ref(false)

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

onMounted(() => {
  hydrated.value = true
})
</script>

<template>
  <div class="bg-border m-auto text-text px-16 py-4 shadow-lg">
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

      <nav class="flex-1 flex justify-end">
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
              <span class="text-primary font-bold">&lt;</span> {{ name }} <span class="text-primary font-bold">/&gt;</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<style scoped>

</style>
