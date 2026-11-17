<script setup lang="ts">
/** Heng Auto Service logo: glowing car mark + wordmark. Sits on the always-dark header/footer. */
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })

const { t } = useI18n()
</script>

<template>
  <span
    class="inline-flex items-center whitespace-nowrap font-semibold text-night-text [font-stretch:125%]"
    :class="size === 'sm' ? 'gap-2 text-[15px] sm:gap-2.5 sm:text-[17px]' : 'gap-2.5 text-[17px]'"
  >
    <UiIcon
      name="car"
      :stroke-width="1.7"
      class="flex-none text-night-text drop-shadow-[0_0_8px_rgb(var(--color-night-strong)/0.55)]"
      :class="size === 'sm' ? 'size-5 sm:size-6' : 'size-6'"
    />
    {{ t('common.brand') }}
  </span>
</template>
