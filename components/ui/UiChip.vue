<script setup lang="ts">
/**
 * Toggle chip. Use `role="radio"` inside a radiogroup (sets aria-checked),
 * otherwise it is a toggle button (aria-pressed).
 */
const props = withDefaults(defineProps<{ active?: boolean; role?: 'button' | 'radio' }>(), {
  active: false,
  role: 'button',
})
defineEmits<{ click: [event: MouseEvent] }>()

const ariaState = computed(() =>
  props.role === 'radio' ? { 'aria-checked': props.active } : { 'aria-pressed': props.active },
)
</script>

<template>
  <button
    type="button"
    :role="role === 'radio' ? 'radio' : undefined"
    v-bind="ariaState"
    class="rounded-full border px-[15px] py-2 text-sm leading-snug transition-colors"
    :class="active ? 'border-ink bg-ink text-bg' : 'border-line bg-transparent hover:border-ink'"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
