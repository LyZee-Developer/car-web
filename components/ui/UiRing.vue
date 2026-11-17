<script setup lang="ts">
/** Circular progress ring (0–1) on the always-dark rating dashboard. */
const props = withDefaults(defineProps<{ value: number; radius?: number }>(), { radius: 28 })

const circumference = computed(() => 2 * Math.PI * props.radius)
const offset = computed(
  () => circumference.value * (1 - Math.max(0, Math.min(1, props.value || 0))),
)
</script>

<template>
  <svg viewBox="0 0 70 70" aria-hidden="true" class="ui-ring">
    <circle cx="35" cy="35" :r="radius" fill="none" stroke-width="4" class="stroke-night-text/10" />
    <circle
      cx="35"
      cy="35"
      :r="radius"
      fill="none"
      stroke-width="4"
      stroke-linecap="round"
      class="ui-ring__fg stroke-night-accent"
      :stroke-dasharray="circumference.toFixed(2)"
      :stroke-dashoffset="offset.toFixed(2)"
    />
  </svg>
</template>

<style scoped>
.ui-ring__fg {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 1.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .ui-ring__fg {
    transition: none;
  }
}
</style>
