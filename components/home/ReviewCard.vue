<script setup lang="ts">
import { ASPECT_KEYS, type ReviewCardData } from '~/types/review'

const props = withDefaults(
  defineProps<{
    review: ReviewCardData
    /** Live preview in the write-a-review panel: no actions, "Today" as the date. */
    preview?: boolean
    /** Placeholder body text is shown muted. */
    placeholder?: boolean
    /** `night` for the always-dark write-a-review panel. */
    tone?: 'default' | 'night'
  }>(),
  { preview: false, placeholder: false, tone: 'default' },
)

const emit = defineEmits<{ delete: [] }>()

const { t } = useI18n()
const formatDate = useFormatDate()

const night = computed(() => props.tone === 'night')

/**
 * Reviews are written by customers in either language, whatever the page language is.
 * Text containing Khmer script gets lang="km" so it uses the Khmer font and line height.
 */
const KHMER = /[ក-៿]/
const langOf = (text: string | undefined) => (text && KHMER.test(text) ? 'km' : undefined)
const mine = computed(() => !props.preview && !!props.review.mine)
const initial = computed(() => ((props.review.name || 'C').trim()[0] || 'C').toUpperCase())
const aspects = computed(() =>
  ASPECT_KEYS.filter((k) => (props.review.aspects[k] ?? 0) >= 1).map((k) => ({
    key: k,
    value: props.review.aspects[k]!,
  })),
)
const edited = computed(
  () =>
    !!props.review.updatedAt &&
    !!props.review.createdAt &&
    props.review.updatedAt - props.review.createdAt > 60_000,
)
const dateText = computed(() =>
  props.preview
    ? t('common.today')
    : [formatDate(props.review.createdAt), edited.value ? t('reviews.edited') : '']
        .filter(Boolean)
        .join(' · '),
)

// Colour classes swap to the "night" palette inside the dark panel.
const c = computed(() =>
  night.value
    ? {
        card: 'bg-night-panel text-night-text border-night-line',
        muted: 'text-night-muted',
        line: 'border-night-line',
        chip: 'bg-night-text/10 text-night-muted',
        chipStrong: 'text-night-text',
        accent: 'text-night-accent',
      }
    : {
        card: `bg-surface text-ink hover:border-muted ${mine.value ? 'border-primary' : 'border-line'}`,
        muted: 'text-muted',
        line: 'border-line',
        chip: 'bg-surface-2 text-muted',
        chipStrong: 'text-ink',
        accent: 'text-primary',
      },
)
</script>

<template>
  <article
    class="flex min-w-0 flex-col gap-4 rounded-card border p-[26px] transition-colors"
    :class="c.card"
  >
    <div class="flex min-w-0 items-center gap-3">
      <div
        class="grid size-11 flex-none place-items-center rounded-full border font-semibold [font-stretch:112%]"
        :class="[c.line, night ? 'bg-night-text/10' : 'bg-surface-2']"
        aria-hidden="true"
      >
        {{ initial }}
      </div>
      <div class="min-w-0">
        <div
          class="font-semibold leading-tight [overflow-wrap:anywhere]"
          :lang="langOf(review.name)"
        >
          {{ review.name || t('common.customer') }}
        </div>
        <div v-if="review.car" class="text-[13px] [overflow-wrap:anywhere]" :class="c.muted">
          {{ review.car }}
        </div>
      </div>
      <UiStars class="ml-auto flex-none" :value="review.rating" :tone="tone" />
    </div>

    <p
      class="quote m-0 whitespace-pre-wrap font-quote text-[17px] leading-[1.8] [overflow-wrap:anywhere]"
      :class="placeholder && c.muted"
      :lang="langOf(review.body)"
    >
      <span
        class="quote-mark block font-medium [font-stretch:125%]"
        :class="c.accent"
        aria-hidden="true"
        >“</span
      >
      {{ review.body }}
    </p>

    <div class="flex flex-wrap gap-1.5">
      <span
        v-if="review.service"
        class="inline-flex items-center rounded-full border px-[11px] py-[5px] text-xs"
        :class="[c.line, c.chipStrong]"
      >
        {{ t(`services.items.${review.service}.name`) }}
      </span>
      <span
        v-for="a in aspects"
        :key="a.key"
        class="inline-flex items-center gap-1 rounded-full px-[11px] py-[5px] text-xs"
        :class="c.chip"
      >
        {{ t(`aspects.${a.key}`) }} <b class="font-semibold" :class="c.chipStrong">{{ a.value }}</b>
      </span>
      <span
        v-if="review.recommend"
        class="inline-flex items-center gap-1 rounded-full px-[11px] py-[5px] text-xs"
        :class="[night ? 'bg-night-accent/15 text-night-text' : 'bg-primary/10 text-ink']"
      >
        <UiIcon name="check" :stroke-width="3" class="size-3" :class="c.accent" />
        {{ t('reviews.recommends') }}
      </span>
    </div>

    <div
      class="flex flex-wrap justify-between gap-2.5 border-t pt-3.5 text-[12.5px]"
      :class="[c.line, c.muted]"
    >
      <span>{{ dateText }}</span>
      <span v-if="mine">{{ t('reviews.yours') }}</span>
    </div>

    <div v-if="mine" class="flex flex-wrap gap-3.5">
      <NuxtLinkLocale
        :to="{ path: '/', hash: '#write' }"
        class="text-[13px] underline underline-offset-[3px] hover:text-ink"
        :class="c.muted"
      >
        {{ t('reviews.editMine') }}
      </NuxtLinkLocale>
      <button
        type="button"
        class="text-[13px] underline underline-offset-[3px] hover:text-danger"
        :class="c.muted"
        @click="emit('delete')"
      >
        {{ t('reviews.delete') }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.quote-mark {
  font-size: 46px;
  line-height: 0.55;
  margin-bottom: 10px;
}
</style>
