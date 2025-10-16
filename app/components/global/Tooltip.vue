<script setup>
const props = defineProps({
  position: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  content: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  delay: {
    type: Number,
    default: 200
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: '200px'
  },
  variant: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light', 'primary', 'accent', 'code', 'custom'].includes(value)
  },
  offset: {
    type: Number,
    default: 8
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
})

const slots = useSlots()
const isVisible = ref(false)
const timeoutId = ref(null)
const tooltipRef = ref(null)
const triggerRef = ref(null)
const tooltipPosition = ref({ top: 0, left: 0 })
const isMobile = ref(true)

const tooltipContent = computed(() => props.content || props.text)

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return
  const triggerElement = triggerRef.value.children[0] || triggerRef.value
  const triggerRect = triggerElement.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()

  let top = 0
  let left = 0

  switch (props.position) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      break
    case 'bottom':
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      left = triggerRect.left - tooltipRect.width - props.offset
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
      left = triggerRect.right + props.offset
      break
  }

  const padding = 8
  if (left < padding) left = padding
  if (left + tooltipRect.width > window.innerWidth - padding) {
    left = window.innerWidth - tooltipRect.width - padding
  }
  if (top < padding) top = padding
  if (top + tooltipRect.height > window.innerHeight - padding) {
    top = window.innerHeight - tooltipRect.height - padding
  }

  tooltipPosition.value = { top, left }
}

const showTooltip = () => {
  if (props.disabled || isMobile.value) return

  const hasContent = tooltipContent.value || slots.content
  if (!hasContent) return

  timeoutId.value = setTimeout(() => {
    isVisible.value = true
    nextTick(() => {
      calculatePosition()
    })
  }, props.delay)
}

const hideTooltip = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }
  isVisible.value = false
}

const variantClasses = computed(() => {
  const variants = {
    dark: 'bg-gray-900 dark:bg-gray-800 text-text',
    light: 'bg-white dark:bg-surface text-text border border-border shadow-soft',
    primary: 'bg-primary text-text',
    accent: 'bg-accent text-text',
    code: 'bg-bg/95 backdrop-blur-sm text-text font-medium shadow-xl border border-primary/30',
    custom: props.customClass
  }
  return variants[props.variant] || variants.dark
})

const arrowVariantClass = computed(() => {
  const variants = {
    dark: 'border-gray-900 dark:border-gray-800',
    light: 'border-white dark:border-surface',
    primary: 'border-primary',
    accent: 'border-accent',
    code: 'border-bg/95',
    custom: ''
  }
  return variants[props.variant] || variants.dark
})

const arrowPosition = computed(() => {
  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-[1px] border-t-[6px] border-x-[6px] border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-b-[6px] border-x-[6px] border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-l-[6px] border-y-[6px] border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-[1px] border-r-[6px] border-y-[6px] border-y-transparent'
  }
  return arrows[props.position] || arrows.top
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    window.addEventListener('scroll', () => {
      if (isVisible.value) {
        calculatePosition()
      }
    }, { passive: true })

    window.addEventListener('resize', () => {
      if (isVisible.value) {
        calculatePosition()
      }
    })
  }
})

onBeforeUnmount(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})
</script>

<template>
  <div class="tooltip-wrapper">
    <div
      ref="triggerRef"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
    >
      <slot />
    </div>

    <Teleport to="body">
      <Transition
        :name="`tooltip-${position}`"
        @after-enter="calculatePosition"
      >
        <div
          v-if="isVisible"
          ref="tooltipRef"
          :class="[
            'tooltip-content',
            'fixed z-[9999] px-3 py-2 text-sm rounded-lg',
            'pointer-events-none',
            variantClasses
          ]"
          :style="{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth: maxWidth,
            whiteSpace: maxWidth ? 'normal' : 'nowrap'
          }"
          role="tooltip"
        >
          <template v-if="variant === 'code'">
            <span class="text-primary">&lt;</span>
            <slot name="content">
              {{ tooltipContent }}
            </slot>
            <span class="text-primary">/&gt;</span>
          </template>
          <template v-else>
            <slot name="content">
              {{ tooltipContent }}
            </slot>
          </template>
          <div
            v-if="showArrow"
            :class="[
              'absolute w-0 h-0',
              arrowPosition,
              arrowVariantClass
            ]"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  display: contents;
}

.tooltip-top-enter-active,
.tooltip-top-leave-active,
.tooltip-bottom-enter-active,
.tooltip-bottom-leave-active,
.tooltip-left-enter-active,
.tooltip-left-leave-active,
.tooltip-right-enter-active,
.tooltip-right-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-top-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tooltip-top-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.tooltip-bottom-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.tooltip-bottom-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.tooltip-left-enter-from {
  opacity: 0;
  transform: translateX(4px);
}

.tooltip-left-leave-to {
  opacity: 0;
  transform: translateX(4px);
}

.tooltip-right-enter-from {
  opacity: 0;
  transform: translateX(-4px);
}

.tooltip-right-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
