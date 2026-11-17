<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Rounded button used across the site.
 * - `to`: internal route (locale-aware link)
 * - `href`: external / tel: / mailto: link
 * - neither: a <button>
 */
const props = withDefaults(
  defineProps<{
    variant?: 'solid' | 'line' | 'pill'
    size?: 'sm' | 'md' | 'lg'
    to?: RouteLocationRaw
    href?: string
    external?: boolean
    type?: 'button' | 'submit'
    disabled?: boolean
    block?: boolean
  }>(),
  {
    variant: 'solid',
    size: 'md',
    to: undefined,
    href: undefined,
    external: false,
    type: 'button',
    disabled: false,
    block: false,
  },
)

const VARIANTS = {
  solid: 'bg-ink text-bg hover:opacity-90',
  line: 'bg-transparent text-current shadow-[inset_0_0_0_1px_currentColor] hover:bg-ink hover:text-bg hover:shadow-none',
  // The header pill sits on the always-dark bar.
  pill: 'border border-current bg-transparent font-medium hover:border-night-text hover:bg-night-text hover:text-night',
} as const

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-[13px]',
  lg: 'px-6 py-[17px] text-base',
} as const

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2.5 rounded-full font-medium leading-tight no-underline transition',
  VARIANTS[props.variant],
  SIZES[props.size],
  props.block && 'w-full',
  props.disabled && 'pointer-events-none opacity-45',
])
</script>

<template>
  <NuxtLinkLocale v-if="to && !disabled" :to="to" :class="classes">
    <slot />
  </NuxtLinkLocale>
  <a
    v-else-if="href !== undefined"
    :href="disabled || !href ? undefined : href"
    :aria-disabled="disabled || !href ? 'true' : undefined"
    :target="external && href ? '_blank' : undefined"
    :rel="external && href ? 'noopener' : undefined"
    :class="[classes, !href && 'pointer-events-none opacity-40']"
  >
    <slot />
  </a>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
