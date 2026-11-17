<script setup lang="ts">
import type { IconName } from '~/types/ui'

/**
 * Stroke icons taken from the design. All use currentColor, so they follow the surrounding text color.
 */
const props = withDefaults(defineProps<{ name: IconName; strokeWidth?: number }>(), {
  strokeWidth: 1.8,
})

// Filled icons ignore stroke and use fill instead.
const FILLED: IconName[] = ['pause', 'play']

const PATHS: Record<IconName, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
  'chevron-right': '<path d="M9 5l7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 17L17 7M9 7h8v8"/>',
  pause:
    '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  oil: '<path d="M12 3C9 8 6 11 6 14.5a6 6 0 0 0 12 0C18 11 15 8 12 3z"/>',
  brakes:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M17 4.5a9 9 0 0 1 3.5 5" stroke-width="3.5"/>',
  engine: '<path d="M3 10h3l2-2h5l2 2h2v2h3v4h-3v2H8l-2-2H3z"/><path d="M9 5h4M11 5v3"/>',
  tires:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
  ac: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M9 4l3 2 3-2M9 20l3-2 3 2"/>',
  electrical: '<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>',
  body: '<path d="M4 20l4-1 10-10-3-3L5 16z"/><path d="M13 6l3-3 3 3-3 3"/>',
  diag: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h1.5l1-2 2 4 1-2h1"/>',
  general:
    '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  telegram: '<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/><path d="M9 13l12-9"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  address:
    '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  // Side-view car used in the Heng Auto Service logo.
  car: '<path d="M2.5 15.5v-2.8l2.3-4.4A1.5 1.5 0 0 1 6.1 7.5h7.5a2 2 0 0 1 1.5.7l3.2 3.8 2.4.5a1.5 1.5 0 0 1 1.2 1.5v1.5h-1.9"/><path d="M14.9 15.5H9.1M5.1 15.5H2.5"/><path d="M6 12h12M10.8 7.6V12"/><circle cx="7" cy="15.8" r="2"/><circle cx="17" cy="15.8" r="2"/>',
}

const filled = computed(() => FILLED.includes(props.name))
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- static, trusted SVG paths defined above -->
  <svg
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    :stroke="filled ? 'none' : 'currentColor'"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="PATHS[name]"
  />
</template>
