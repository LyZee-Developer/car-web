<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  { hash: '#services', label: t('nav.services') },
  { hash: '#rating', label: t('nav.rating') },
  { hash: '#reviews', label: t('nav.reviews') },
  { hash: '#contact', label: t('nav.contact') },
])
</script>

<template>
  <header
    class="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-night-line bg-night/80 text-night-text backdrop-blur-md"
  >
    <div
      class="page-wrap grid h-[66px] grid-cols-[1fr_auto] items-center gap-5 md:grid-cols-[1fr_auto_1fr]"
    >
      <NuxtLinkLocale :to="{ path: '/', hash: '#top' }" class="no-underline">
        <BrandLogo size="sm" />
      </NuxtLinkLocale>

      <nav :aria-label="t('nav.label')" class="hidden gap-7 text-sm md:flex">
        <NuxtLinkLocale
          v-for="link in links"
          :key="link.hash"
          :to="{ path: '/', hash: link.hash }"
          class="text-night-muted no-underline transition-colors hover:text-night-text"
        >
          {{ link.label }}
        </NuxtLinkLocale>
      </nav>

      <div class="flex items-center gap-2 justify-self-end sm:gap-2.5">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <UiButton
          :to="{ path: '/', hash: '#write' }"
          variant="pill"
          size="sm"
          class="hidden xs:inline-flex"
        >
          {{ t('common.buttons.writeReview') }}
        </UiButton>
      </div>
    </div>
  </header>
</template>
