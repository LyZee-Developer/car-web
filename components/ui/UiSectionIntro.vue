<template>
  <div
    class="mb-11 grid items-start gap-3.5 border-t border-line pt-7 md:grid-cols-[1.1fr_1fr] md:gap-10"
  >
    <h2 :id="headingId" class="text-[clamp(32px,4.4vw,52px)]">{{ title }}</h2>
    <p v-if="text || $slots.default" class="mt-1.5 max-w-[46ch] text-muted">
      <slot>{{ text }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
/** Section heading: hairline on top, title left, intro text right (stacked on mobile). */
defineProps<{ title: string; text?: string; headingId?: string }>()
</script>
