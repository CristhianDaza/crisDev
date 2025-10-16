<script setup>
const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

const isVisible = ref(false)

onMounted(() => {
  if (import.meta.client) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    }, { threshold: 0.1 })

    const section = document.querySelector('#contact-section')
    if (section) {
      observer.observe(section)
    }
  }
})

const handleSubmit = async () => {
  if (!formData.name || !formData.email || !formData.message) {
    return
  }

  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Formulario enviado:', formData)

    showSuccess.value = true
    formData.name = ''
    formData.email = ''
    formData.message = ''

    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 5000)
    console.error('Error al enviar el formulario:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    id="contact-section"
    class="relative w-full overflow-hidden"
  >
    <div class="relative mx-auto max-w-5xl px-6 py-24 lg:py-32">
      <div class="text-center mb-16">
        <h2
          class="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-all duration-700"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          {{ $t('contact.title') }}
        </h2>
        <p
          class="text-muted text-lg md:text-xl max-w-2xl mx-auto transition-all duration-700 delay-100"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          {{ $t('contact.description') }}
        </p>
      </div>
      <div
        class="relative mx-auto max-w-2xl transition-all duration-700 delay-200"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <div
          class="relative rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl border border-border-translucent bg-surface-translucent"
        >
          <div
            class="absolute inset-0 rounded-3xl opacity-50 blur-xl -z-10 bg-gradient-to-br from-primary to-accent"
          />

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label
                for="name"
                class="block text-sm font-semibold text-text"
              >
                {{ $t('contact.nameLabel') }}
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                :placeholder="$t('contact.namePlaceholder')"
                class="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-surface text-text border-border focus:border-primary focus:ring-primary"
                :disabled="isSubmitting"
              >
            </div>

            <div class="space-y-2">
              <label
                for="email"
                class="block text-sm font-semibold text-text"
              >
                {{ $t('contact.emailLabel') }}
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                :placeholder="$t('contact.emailPlaceholder', { at: '@' })"
                class="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-surface text-text border-border focus:border-primary focus:ring-primary"
                :disabled="isSubmitting"
              >
            </div>

            <div class="space-y-2">
              <label
                for="message"
                class="block text-sm font-semibold text-text"
              >
                {{ $t('contact.messageLabel') }}
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="6"
                :placeholder="$t('contact.messagePlaceholder')"
                class="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none bg-surface text-text border-border focus:border-primary focus:ring-primary"
                :disabled="isSubmitting"
              />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="group relative w-full inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white"
            >
              <span class="relative z-10 flex items-center gap-2">
                <Icon
                  v-if="!isSubmitting"
                  name="mdi-send"
                  class="w-5 h-5 transition-transform group-hover:translate-x-1"
                />
                <Icon
                  v-else
                  name="mdi-loading"
                  class="w-5 h-5 animate-spin"
                />
                {{ isSubmitting ? $t('contact.sending') : $t('contact.sendButton') }}
              </span>
              <span
                class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg bg-primary"
              />
            </button>

            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-300"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showSuccess"
                class="flex items-center gap-3 p-4 rounded-xl border-2 border-accent bg-accent/10"
              >
                <Icon name="mdi-check-circle" class="w-6 h-6 flex-shrink-0 text-accent" />
                <p class="text-sm font-medium text-text">
                  {{ $t('contact.successMessage') }}
                </p>
              </div>
            </Transition>

            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-300"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div
                v-if="showError"
                class="flex items-center gap-3 p-4 rounded-xl border-2 border-warning bg-warning/10"
              >
                <Icon name="mdi-alert-circle" class="w-6 h-6 flex-shrink-0 text-warning" />
                <p class="text-sm font-medium text-text">
                  {{ $t('contact.errorMessage') }}
                </p>
              </div>
            </Transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-surface-translucent {
  background: color-mix(in srgb, var(--surface) 80%, transparent);
}

.border-border-translucent {
  border-color: color-mix(in srgb, var(--border) 50%, transparent);
}
</style>
