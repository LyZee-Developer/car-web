<script setup lang="ts">
const { t } = useI18n()

// <html lang>, hreflang alternates, canonical and og:locale for the current locale.
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang, dir: i18nHead.value.htmlAttrs?.dir },
  link: [...(i18nHead.value.link ?? [])],
  meta: [...(i18nHead.value.meta ?? [])],
}))

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
})
</script>

<template>
  <div class="min-h-dvh">
    <!-- Dark strip behind the iOS notch / status bar. -->
    <div
      class="fixed inset-x-0 top-0 z-40 h-[env(safe-area-inset-top,0px)] bg-night"
      aria-hidden="true"
    />
    <!-- Site-wide interactive dot grid behind all content; follows light/dark mode. -->
    <DotGrid fixed tone="theme" class="z-0" />
    <AppHeader />
    <!-- Content sits above the dot grid; cards and dark panels cover it, open areas show it. -->
    <div class="relative z-[1]">
      <slot />
      <AppFooter />
    </div>
    <ContactCallBar />
  </div>
</template>
