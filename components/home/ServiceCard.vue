<script setup lang="ts">
import type { ServiceInfo } from '~/utils/catalog'

const props = defineProps<{
  service: ServiceInfo
  /** Symptom finder: true = likely fix (highlighted), false = dimmed, null = finder not in use. */
  matched: boolean | null
  open: boolean
  loaded: boolean
  reviewCount: number
  reviewAverage: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  seeReviews: []
  /** Clear the symptom-finder selection. */
  clear: []
}>()

/** While a symptom is selected, the image works as a "clear selection" button. */
const canClear = computed(() => props.matched !== null)

const { t } = useI18n()
const formatDecimal = useFormatDecimal()
const key = computed(() => `services.items.${props.service.id}`)
const panelId = useId()

const ratingText = computed(() => {
  if (!props.loaded) return ''
  if (!props.reviewCount) return t('services.noReviews')
  return t(
    'services.ratingFrom',
    { avg: formatDecimal(props.reviewAverage), n: props.reviewCount },
    props.reviewCount,
  )
})

// Only the arrow button opens/closes the details.
function toggle() {
  emit('update:open', !props.open)
}
</script>

<template>
  <article
    :id="`svc-${service.id}`"
    class="flex flex-col gap-3.5 rounded-card border bg-surface px-3 pb-[18px] pt-3 transition-[opacity,border-color] duration-200"
    :class="[
      matched === true ? 'border-primary' : 'border-line',
      matched === false && 'opacity-30',
    ]"
  >
    <component
      :is="canClear ? 'button' : 'div'"
      :type="canClear ? 'button' : undefined"
      :aria-label="canClear ? t('services.clearSelection') : undefined"
      :title="canClear ? t('services.clearSelection') : undefined"
      class="svc-visual relative grid aspect-video w-full place-items-center overflow-hidden rounded-[14px] text-night-text/85"
      :class="canClear && 'cursor-pointer'"
      @click="canClear && emit('clear')"
    >
      <UiIcon
        :name="service.id"
        :stroke-width="1.1"
        class="h-auto w-[22%] drop-shadow-[0_0_18px_rgb(var(--color-night-text)/0.18)]"
      />
      <span
        v-if="matched === true"
        class="absolute left-3.5 top-3.5 rounded-full bg-night-accent px-2.5 py-1 text-xs font-semibold text-night"
      >
        {{ t('services.likelyFix') }}
      </span>
    </component>

    <div class="px-2">
      <h3 class="text-[22px]">{{ t(`${key}.name`) }}</h3>
      <div class="mt-1 flex flex-wrap gap-2.5 text-[13px] text-muted">
        <span>{{ t(`${key}.time`) }}</span>
        <span v-if="ratingText" class="text-ink">{{ ratingText }}</span>
      </div>
    </div>

    <p class="m-0 px-2 text-[15px] leading-normal text-muted">{{ t(`${key}.short`) }}</p>

    <div class="mx-2 border-t border-line pt-1">
      <div class="flex items-center justify-between gap-3 py-1.5 text-sm font-medium">
        <span :id="`${panelId}-label`">{{ t('services.moreInfo') }}</span>
        <button
          type="button"
          class="grid size-8 flex-none place-items-center rounded-full transition-colors hover:bg-surface-2"
          :aria-expanded="open"
          :aria-controls="panelId"
          :aria-labelledby="`${panelId}-label`"
          @click="toggle"
        >
          <span class="chevron" :class="{ 'is-open': open }" aria-hidden="true" />
        </button>
      </div>

      <!-- Slides open/closed by animating the grid row from 0fr to 1fr. -->
      <div
        :id="panelId"
        class="collapse-panel"
        :class="{ 'is-open': open }"
        :inert="!open"
        :aria-hidden="!open"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="grid cursor-auto gap-[18px] pb-2 pt-1 xs:grid-cols-2">
            <div>
              <h4 class="mb-1.5 text-xs font-medium text-muted">{{ t('services.signsTitle') }}</h4>
              <ul class="m-0 list-disc pl-[18px] text-sm">
                <li v-for="i in service.signs" :key="i" class="my-[3px]">
                  {{ t(`${key}.signs.${i - 1}`) }}
                </li>
              </ul>
            </div>
            <div>
              <h4 class="mb-1.5 text-xs font-medium text-muted">{{ t('services.stepsTitle') }}</h4>
              <ol class="m-0 list-decimal pl-[18px] text-sm">
                <li v-for="i in service.steps" :key="i" class="my-[3px]">
                  {{ t(`${key}.steps.${i - 1}`) }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UiArrowLink v-if="reviewCount" class="ml-2 self-start text-[13px]" @click="emit('seeReviews')">
      {{ t('services.readReviews') }}
    </UiArrowLink>
  </article>
</template>

<style scoped>
.svc-visual {
  background: radial-gradient(
    80% 70% at 50% 35%,
    rgb(var(--color-night-raised)),
    rgb(var(--color-night)) 75%
  );
}

.svc-visual::after {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 18%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(var(--color-night-text) / 0.25), transparent);
}

.chevron {
  width: 8px;
  height: 8px;
  flex: none;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-3px) rotate(45deg);
  transition: transform 0.35s ease;
}

.chevron.is-open {
  transform: translateY(2px) rotate(-135deg);
}

.collapse-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.35s ease,
    opacity 0.25s ease;
}

.collapse-panel.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .chevron,
  .collapse-panel {
    transition: none;
  }
}
</style>
