<template>
  <!-- Each option links to the same page in the other language, so the user stays where they are. -->
  <nav
    :aria-label="t('language.label')"
    class="inline-flex flex-none items-center gap-0.5 rounded-full border border-night-line p-[3px] hover:border-night-text"
  >
    <NuxtLink
      v-for="option in available"
      :key="option.code"
      :to="switchLocalePath(option.code)"
      :lang="option.code"
      :hreflang="option.language"
      :aria-current="option.code === locale ? 'true' : undefined"
      :aria-label="
        option.code === locale ? option.name : t('language.switchTo', { language: option.name })
      "
      class="rounded-full px-2.5 py-1.5 text-[13px] leading-snug no-underline transition-colors"
      :class="
        option.code === locale
          ? 'bg-night-text font-semibold text-night'
          : 'text-night-muted hover:text-night-text'
      "
    >
      {{ option.short ?? option.name }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { available, locale } = useAppLocale()
const switchLocalePath = useSwitchLocalePath()
</script>
