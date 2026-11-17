<script setup lang="ts">
/** Floating "Call / Telegram" bar on phones. Hidden when neither is configured. */
const { t } = useI18n()
const { links } = useContact()
const show = computed(() => !!links.value.phone || !!links.value.telegram)
</script>

<template>
  <template v-if="show">
    <!-- Spacer so the bar never covers the end of the footer. -->
    <div class="h-24 bg-night md:hidden" aria-hidden="true" />
    <nav
      :aria-label="t('nav.quickContact')"
      class="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-30 flex gap-2 rounded-full border border-night-line bg-night/85 p-2 backdrop-blur-md md:hidden"
    >
      <a
        v-if="links.phone"
        :href="links.phone"
        class="flex flex-1 items-center justify-center gap-2 rounded-full bg-night-text p-3 text-[15px] font-medium text-night no-underline"
      >
        <UiIcon name="phone" class="size-[18px]" />
        {{ t('contact.phone.short') }}
      </a>
      <a
        v-if="links.telegram"
        :href="links.telegram"
        target="_blank"
        rel="noopener"
        class="flex flex-1 items-center justify-center gap-2 rounded-full p-3 text-[15px] font-medium text-night-text no-underline"
      >
        <UiIcon name="telegram" class="size-[18px]" />
        {{ t('contact.telegram.short') }}
      </a>
    </nav>
  </template>
</template>
