<script setup>
import { skillCategories } from '~/data/constants'
</script>

<template>
  <div class="space-y-10">
    <div class="max-w-3xl">
      <div class="mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
      <h2 class="text-4xl font-bold tracking-normal text-text md:text-5xl">
        {{ $t('skills.title') }}
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
        {{ $t('skills.description') }}
      </p>
    </div>

    <div class="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in skillCategories"
        :key="category.id"
        class="group flex h-full flex-col rounded-[var(--radius)] border border-card bg-card p-5 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/80"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-xl"
              :style="{
                backgroundColor: `color-mix(in srgb, ${category.color} 14%, transparent)`,
                color: category.color
              }"
            >
              <Icon :name="category.icon" class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <h3 class="truncate text-lg font-bold text-text">
                {{ $t(category.name) }}
              </h3>
              <p class="mt-1 text-xs font-medium text-muted">
                {{ category.skills.length }} {{ $t('skills.technologies') }}
              </p>
            </div>
          </div>
          <div
            class="mt-2 h-2 w-2 shrink-0 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
        </div>

        <div class="flex flex-1 flex-col gap-2">
          <div
            v-for="skill in category.skills"
            :key="skill.name"
            class="group/skill flex min-h-12 items-center gap-3 rounded-xl border border-transparent bg-bg/25 px-3 py-2.5 transition-colors hover:border-border hover:bg-bg/45"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg"
              :style="{
                backgroundColor: `color-mix(in srgb, ${category.color} 10%, transparent)`,
                color: category.color
              }"
            >
              <Icon :name="skill.icon" class="h-4 w-4" />
            </span>

            <span class="min-w-0 flex-1 truncate text-sm font-semibold text-text">
              {{ skill.name }}
            </span>
            <span class="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-xs font-semibold text-muted">
              <Icon name="mdi:clock-outline" class="h-3.5 w-3.5" />
              {{ skill.years }}+ {{ skill.years === 1 ? $t('experience.year') : $t('experience.years') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
