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
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>

    <div class="relative mx-auto max-w-5xl px-6">
      <div class="text-center mb-12">
        <h2
          class="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-all duration-700"
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
          class="relative rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-xl border bg-surface/50 border-border/50 hover:shadow-2xl transition-shadow duration-500"
        >
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="group space-y-2">
              <label
                for="name"
                class="flex items-center gap-2 text-sm font-semibold text-text"
              >
                <Icon name="mdi-account" class="w-5 h-5 text-primary" />
                {{ $t('contact.nameLabel') }}
              </label>
              <div class="relative">
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  :placeholder="$t('contact.namePlaceholder')"
                  class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  :disabled="isSubmitting"
                >
                <Icon name="mdi-account-outline" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>

            <div class="group space-y-2">
              <label
                for="email"
                class="flex items-center gap-2 text-sm font-semibold text-text"
              >
                <Icon name="mdi-email" class="w-5 h-5 text-primary" />
                {{ $t('contact.emailLabel') }}
              </label>
              <div class="relative">
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  :placeholder="$t('contact.emailPlaceholder', { at: '@' })"
                  class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  :disabled="isSubmitting"
                >
                <Icon name="mdi-email-outline" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>

            <div class="group space-y-2">
              <label
                for="message"
                class="flex items-center gap-2 text-sm font-semibold text-text"
              >
                <Icon name="mdi-message-text" class="w-5 h-5 text-primary" />
                {{ $t('contact.messageLabel') }}
              </label>
              <div class="relative">
                <textarea
                  id="message"
                  v-model="formData.message"
                  required
                  rows="5"
                  :placeholder="$t('contact.messagePlaceholder')"
                  class="w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg resize-none bg-surface text-text border-border focus:border-primary focus:ring-primary/20 hover:border-primary/50"
                  :disabled="isSubmitting"
                />
                <Icon name="mdi-message-outline" class="absolute left-3.5 top-4 w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>

            <UIButton
              type="submit"
              variant="primary"
              :icon="isSubmitting ? 'mdi-loading' : 'mdi-send'"
              icon-position="right"
              class="w-full !py-4"
              :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': isSubmitting }"
            >
              <span class="flex items-center justify-center gap-2">
                <Icon
                  v-if="isSubmitting"
                  name="mdi-loading"
                  class="w-5 h-5 animate-spin"
                />
                {{ isSubmitting ? $t('contact.sending') : $t('contact.sendButton') }}
              </span>
            </UIButton>

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
                class="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30"
              >
                <Icon name="mdi-check-circle" class="w-6 h-6 flex-shrink-0 text-green-500 mt-0.5" />
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
                class="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30"
              >
                <Icon name="mdi-alert-circle" class="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5" />
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
.delay-1000 {
  animation-delay: 1s;
}
</style>
