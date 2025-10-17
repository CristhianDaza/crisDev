<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  iconPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  target: {
    type: String,
    default: null
  },
  rel: {
    type: String,
    default: null
  }
})

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95'

  const variantClasses = {
    primary: 'group relative shadow-lg hover:shadow-xl bg-primary text-text',
    secondary: 'border-2 border-border bg-surface text-text hover:border-primary'
  }

  return `${baseClasses} ${variantClasses[props.variant]}`
})

const componentTag = computed(() => props.href ? 'a' : 'button')
</script>

<template>
  <component
    :is="componentTag"
    :type="!href ? type : undefined"
    :href="href"
    :target="target"
    :rel="rel"
    :class="buttonClasses"
  >
    <Icon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      class="mr-2 w-4 h-4"
    />

    <span :class="variant === 'primary' ? 'relative z-10' : ''">
      <slot />
    </span>

    <Icon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      class="ml-2 w-4 h-4"
    />

    <span
      v-if="variant === 'primary'"
      class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg"
      style="background: var(--primary);"
    />
  </component>
</template>

<style scoped>

</style>
