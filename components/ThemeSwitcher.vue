<script setup lang="ts">
import type { IconName } from '~/types/ui'

const { t } = useI18n()
const { preference, setPreference } = useAppTheme()

const ICONS: Record<ThemePreference, IconName> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
}

const options = computed(() =>
  THEME_OPTIONS.map((value) => ({ value, icon: ICONS[value], label: t(`theme.${value}`) })),
)

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuId = useId()

onClickOutside(root, () => {
  open.value = false
})

function focusItem(index: number) {
  const items = menu.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]')
  if (!items?.length) return
  items[(index + items.length) % items.length]!.focus()
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    focusItem(THEME_OPTIONS.indexOf(preference.value))
  }
}

function choose(value: ThemePreference) {
  setPreference(value)
  open.value = false
  trigger.value?.focus()
}

function onMenuKeydown(event: KeyboardEvent) {
  const items = [...(menu.value?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])]
  const index = items.indexOf(document.activeElement as HTMLElement)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusItem(index + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusItem(index - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusItem(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusItem(items.length - 1)
  } else if (event.key === 'Escape' || event.key === 'Tab') {
    open.value = false
    if (event.key === 'Escape') trigger.value?.focus()
  }
}
</script>

<template>
  <!-- color-mode only knows the stored preference on the client; the fallback keeps the same size. -->
  <ClientOnly>
    <div ref="root" class="relative flex-none">
      <button
        ref="trigger"
        type="button"
        class="grid size-10 place-items-center rounded-full border border-night-line text-night-text transition-colors hover:border-night-text hover:bg-night-text/5"
        aria-haspopup="menu"
        :aria-expanded="open"
        :aria-controls="menuId"
        :aria-label="`${t('theme.label')}: ${t(`theme.${preference}`)}`"
        :title="t('theme.label')"
        @click="toggle"
      >
        <UiIcon :name="ICONS[preference]" class="size-[18px]" />
      </button>

      <Transition
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-show="open"
          :id="menuId"
          ref="menu"
          role="menu"
          :aria-label="t('theme.label')"
          class="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[210px] rounded-2xl border border-night-line bg-night-2 p-1.5 text-night-text shadow-2xl"
          @keydown="onMenuKeydown"
        >
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="menuitemradio"
            :aria-checked="preference === option.value"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-night-text/10 focus-visible:bg-night-text/10"
            @click="choose(option.value)"
          >
            <UiIcon :name="option.icon" class="size-[18px] flex-none" />
            <span class="flex-1">{{ option.label }}</span>
            <UiIcon
              v-if="preference === option.value"
              name="check"
              class="size-4 flex-none text-night-accent"
              :stroke-width="2.6"
            />
          </button>
        </div>
      </Transition>
    </div>
    <template #fallback>
      <div class="size-10 flex-none rounded-full border border-night-line" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
