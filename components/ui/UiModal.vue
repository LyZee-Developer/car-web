<script setup lang="ts">
/**
 * Accessible modal built on the native <dialog>: focus is trapped inside, Esc closes it,
 * and focus returns to the button that opened it. Clicking the backdrop also closes it.
 */
const props = defineProps<{ open: boolean; labelledby?: string }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const dialog = ref<HTMLDialogElement | null>(null)
const closing = ref(false)
const reducedMotion = usePreferredReducedMotion()
/** The element that had focus when the modal opened (usually the button that opened it). */
let opener: HTMLElement | null = null

watch(
  () => props.open,
  (open) => {
    const el = dialog.value
    if (!el) return
    if (open && !el.open) {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
      closing.value = false
      el.showModal()
    } else if (!open && el.open) {
      // Let the fade-out play before removing it from the top layer.
      closing.value = true
      const delay = reducedMotion.value === 'reduce' ? 0 : 180
      window.setTimeout(() => {
        el.close()
        closing.value = false
        opener?.focus({ preventScroll: true })
        opener = null
      }, delay)
    }
  },
  { flush: 'post' },
)

// Esc fires `cancel`; route it through the parent so its state stays in sync.
function onCancel(event: Event) {
  event.preventDefault()
  emit('close')
}

// A click whose target is the <dialog> itself landed on the backdrop.
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal m-auto w-[min(440px,calc(100vw-32px))] max-w-none rounded-panel border border-line bg-surface p-0 text-ink"
    :class="{ 'is-closing': closing }"
    :aria-labelledby="labelledby"
    @cancel="onCancel"
    @click="onClick"
  >
    <div class="relative p-6 sm:p-8">
      <button
        type="button"
        class="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        :aria-label="t('contact.modal.close')"
        @click="emit('close')"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-[18px]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.modal::backdrop {
  background: rgb(var(--color-night) / 0.6);
  backdrop-filter: blur(4px);
}

.modal[open] {
  animation: modal-in 0.2s ease-out;
}

.modal[open]::backdrop {
  animation: backdrop-in 0.2s ease-out;
}

.modal.is-closing {
  animation: modal-out 0.18s ease-in forwards;
}

.modal.is-closing::backdrop {
  animation: backdrop-out 0.18s ease-in forwards;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
}

@keyframes modal-out {
  to {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
}

@keyframes backdrop-in {
  from {
    opacity: 0;
  }
}

@keyframes backdrop-out {
  to {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal[open],
  .modal[open]::backdrop,
  .modal.is-closing,
  .modal.is-closing::backdrop {
    animation: none;
  }
}
</style>
