<template>
  <NuxtLinkLocale v-if="to" :to="to" :class="classes">
    <slot />
    <UiIcon name="arrow-up-right" class="size-4 flex-none" />
  </NuxtLinkLocale>
  <button v-else type="button" :class="classes" @click="$emit('click', $event)">
    <slot />
    <UiIcon name="arrow-up-right" class="size-4 flex-none" />
  </button>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** Underlined link with an up-right arrow ("See all services ↗"). Renders a button when no `to` is given. */
defineProps<{ to?: RouteLocationRaw }>()
defineEmits<{ click: [event: MouseEvent] }>()

const classes =
  'inline-flex items-center gap-2.5 border-b border-current pb-1 font-medium no-underline transition-opacity hover:opacity-80'
</script>
