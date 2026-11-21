<template>
  <span class="inline-flex gap-0.5 align-middle" role="img" :aria-label="ariaLabel">
    <svg
      v-for="i in 5"
      :key="i"
      viewBox="0 0 24 24"
      aria-hidden="true"
      :width="size"
      :height="size"
      :class="
        tone === 'night'
          ? i <= filled
            ? 'fill-night-accent'
            : 'fill-night-off'
          : i <= filled
            ? 'fill-primary'
            : 'fill-line'
      "
    >
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  </span>
</template>

<script setup lang="ts">
/**
 * Five-star display. `tone="night"` is for the always-dark panels.
 * The label is read by screen readers; the stars themselves are decorative.
 */
const props = withDefaults(
  defineProps<{ value: number; size?: number; tone?: 'default' | 'night'; label?: string }>(),
  { size: 16, tone: 'default', label: undefined },
)

const { t } = useI18n()
const filled = computed(() => Math.round(props.value))
const ariaLabel = computed(() => props.label ?? t('common.starsOutOf', { n: filled.value }))
</script>
