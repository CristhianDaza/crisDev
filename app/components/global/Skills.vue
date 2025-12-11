<script setup>
import { skillCategories } from '~/data/constants'
</script>

<template>
  <div class="relative">
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <h2
        class="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in [animation-delay:0.1s]"
      >
        {{ $t('skills.title') }}
      </h2>
      <p
        class="text-muted text-lg max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]"
      >
        {{ $t('skills.description') }}
      </p>
    </div>
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(category, index) in skillCategories"
        :key="category.id"
        class="group relative rounded-2xl border border-border bg-surface p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up [animation-fill-mode:both]"
        :style="{
          animationDelay: `${0.1 * (index + 1)}s`
        }"
      >
        <div
          class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          :style="{ background: `radial-gradient(circle at top left, ${category.color}, transparent)` }"
        />
        <div class="relative mb-6 flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            :style="{ backgroundColor: `color-mix(in srgb, ${category.color} 15%, transparent)` }"
          >
            <Icon :name="category.icon" />
          </div>
          <h3 class="text-xl font-semibold text-text">
            {{ $t(category.name) }}
          </h3>
        </div>
        <div class="relative space-y-3">
          <div
            v-for="(skill, skillIndex) in category.skills"
            :key="skill.name"
            class="group/skill flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-[color-mix(in_srgb,_var(--primary)_5%,_transparent)]"
            :style="{
              animationDelay: `${0.1 * (index + 1) + 0.05 * skillIndex}s`
            }"
          >
            <span class="text-xl transition-transform duration-300 group-hover/skill:scale-125">
               <Icon :name="skill.icon" />
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between gap-2">
                <span class="text-sm font-medium text-text truncate">
                  {{ (skill.name) }}
                </span>
                <span class="text-xs text-muted whitespace-nowrap flex items-center gap-1">
                  <Icon name="mdi-clock" />
                  {{ skill.years }}+ {{ skill.years === 1 ? $t('experience.year') : $t('experience.years') }}
                </span>
              </div>
              <div class="relative mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,_var(--border)_50%,_transparent)]">
                <div
                  class="h-full rounded-full transition-all duration-700 group-hover/skill:w-full"
                  :style="{
                    width: `${(skill.years / 7) * 100}%`,
                    backgroundColor: category.color,
                    boxShadow: `0 0 10px ${category.color}40`
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="relative mt-6 flex items-center justify-between text-xs text-muted">
          <span class="flex items-center gap-1">
            <Icon name="mdi-code-tags" />
            {{ category.skills.length }} {{ $t('skills.technologies') }}
          </span>
          <div
            class="h-1.5 w-1.5 rounded-full animate-pulse"
            :style="{ backgroundColor: category.color }"
          />
        </div>
      </div>
    </div>

    <div class="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none animate-float bg-[radial-gradient(circle,_var(--primary),_transparent_70%)]" />
    <div class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none animate-float-delayed bg-[radial-gradient(circle,_var(--accent),_transparent_70%)]" />
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}
</style>
