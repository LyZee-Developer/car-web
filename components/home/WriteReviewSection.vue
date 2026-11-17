<script setup lang="ts">
import { ASPECT_KEYS, REVIEW_LIMITS, SERVICE_IDS } from '~/types/review'

const { t } = useI18n()
const {
  form,
  steps,
  stepsDone,
  preview,
  previewIsPlaceholder,
  editing,
  submitting,
  message,
  submit,
} = useReviewForm()

const STEP_KEYS = ['rating', 'visit', 'body'] as const

const starGroup = ref<HTMLElement | null>(null)

function setRating(value: number) {
  form.rating = Math.min(5, Math.max(1, value))
  nextTick(() =>
    starGroup.value?.querySelector<HTMLElement>(`[data-rate="${form.rating}"]`)?.focus(),
  )
}

function onStarKeydown(event: KeyboardEvent) {
  const up = ['ArrowRight', 'ArrowUp']
  const down = ['ArrowLeft', 'ArrowDown']
  if (![...up, ...down].includes(event.key)) return
  event.preventDefault()
  setRating((form.rating || 0) + (up.includes(event.key) ? 1 : -1))
}

/** Clicking the selected score again clears it (aspect scores are optional). */
function toggleAspect(key: (typeof ASPECT_KEYS)[number], value: number) {
  form.aspects[key] = form.aspects[key] === value ? 0 : value
}

async function onSubmit() {
  const focusId = await submit()
  if (focusId) {
    const el = document.getElementById(focusId)
    const target = el?.matches('input, textarea')
      ? el
      : (el?.querySelector<HTMLElement>('button') ?? el)
    target?.focus()
  }
}

const inputClass =
  'w-full rounded-[14px] border border-line bg-bg px-[15px] py-[13px] transition-colors focus:border-ink focus:outline-none'
</script>

<template>
  <section id="write" aria-labelledby="form-title">
    <div class="page-wrap">
      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
        <aside
          class="night-card flex flex-col gap-7 rounded-panel px-[30px] py-9 lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+90px)]"
        >
          <div>
            <h2 id="form-title" class="text-[clamp(32px,3.6vw,46px)]">
              {{ editing ? t('write.titleEdit') : t('write.title') }}
            </h2>
            <p class="mb-0 mt-3 text-night-muted">{{ t('write.lead') }}</p>
          </div>

          <ol class="m-0 list-none p-0">
            <li
              v-for="(key, i) in STEP_KEYS"
              :key="key"
              class="flex items-center gap-3 border-b border-night-line py-[11px] text-[15px] transition-colors last:border-b-0"
              :class="steps[key] ? 'text-night-text' : 'text-night-muted'"
            >
              <span
                class="grid size-[26px] flex-none place-items-center rounded-full border text-xs transition-colors"
                :class="
                  steps[key]
                    ? 'border-night-accent bg-night-accent text-night'
                    : 'border-night-tick'
                "
              >
                <UiIcon v-if="steps[key]" name="check" :stroke-width="3" class="size-[13px]" />
                <span v-else>{{ i + 1 }}</span>
              </span>
              {{ t(`write.steps.${key}`) }}
            </li>
          </ol>

          <div aria-hidden="true">
            <div class="mb-2.5 text-[13px] text-night-muted">{{ t('write.preview') }}</div>
            <HomeReviewCard
              :review="preview"
              preview
              :placeholder="previewIsPlaceholder"
              tone="night"
            />
          </div>
        </aside>

        <form
          class="rounded-panel border border-line bg-surface px-5 py-6 sm:px-9 sm:py-[34px]"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="flex items-center gap-3.5 pb-2 text-[13px] text-muted">
            <span>{{
              stepsDone === 3 ? t('write.ready') : t('write.progress', { n: stepsDone })
            }}</span>
            <div class="h-[3px] flex-1 overflow-hidden rounded-sm bg-line">
              <i
                class="block h-full bg-primary transition-[width] duration-[400ms] ease-out motion-reduce:transition-none"
                :style="{ width: `${(stepsDone / 3) * 100}%` }"
              />
            </div>
          </div>

          <!-- 01 overall rating -->
          <fieldset class="group-set">
            <legend id="rating-label" class="group-legend">
              <span class="num">01</span>{{ t('write.overall') }}
            </legend>
            <div
              id="star-input"
              ref="starGroup"
              class="flex gap-1.5"
              role="radiogroup"
              aria-labelledby="rating-label"
              @keydown="onStarKeydown"
            >
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                role="radio"
                :data-rate="i"
                :aria-checked="form.rating === i"
                :aria-label="t('common.stars', { n: i }, i)"
                :tabindex="(form.rating || 1) === i ? 0 : -1"
                class="star rounded-[10px] border-0 bg-transparent p-0.5"
                @click="setRating(i)"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="size-[46px]"
                  :class="i <= form.rating ? 'fill-primary' : 'fill-line'"
                >
                  <path
                    d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
                  />
                </svg>
              </button>
            </div>
            <div class="mt-2 min-h-[1.5em] text-sm text-muted">
              {{ form.rating ? t(`write.captions.${form.rating}`) : t('write.tapStar') }}
            </div>
          </fieldset>

          <!-- 02 about the visit -->
          <fieldset class="group-set">
            <legend class="group-legend"><span class="num">02</span>{{ t('write.visit') }}</legend>
            <div class="mb-[22px] grid gap-4 sm:grid-cols-2">
              <div>
                <label class="field-label" for="f-name">
                  {{ t('write.name') }} <span class="hint">{{ t('write.nameHint') }}</span>
                </label>
                <input
                  id="f-name"
                  v-model="form.name"
                  type="text"
                  :maxlength="REVIEW_LIMITS.name"
                  autocomplete="given-name"
                  :placeholder="t('write.namePlaceholder')"
                  :class="inputClass"
                />
              </div>
              <div>
                <label class="field-label" for="f-car">
                  {{ t('write.car') }} <span class="hint">{{ t('write.optional') }}</span>
                </label>
                <input
                  id="f-car"
                  v-model="form.car"
                  type="text"
                  :maxlength="REVIEW_LIMITS.car"
                  :placeholder="t('write.carPlaceholder')"
                  :class="inputClass"
                />
              </div>
            </div>
            <span id="svc-label" class="field-label">{{ t('write.whatWorked') }}</span>
            <div
              id="svc-input"
              class="flex flex-wrap gap-2"
              role="radiogroup"
              aria-labelledby="svc-label"
            >
              <UiChip
                v-for="id in SERVICE_IDS"
                :key="id"
                role="radio"
                :active="form.service === id"
                @click="form.service = id"
              >
                {{ t(`services.items.${id}.name`) }}
              </UiChip>
            </div>
          </fieldset>

          <!-- 03 per-area scores (optional) -->
          <fieldset class="group-set">
            <legend class="group-legend">
              <span class="num">03</span>{{ t('write.perArea') }}
              <span class="opt">{{ t('write.perAreaHint') }}</span>
            </legend>
            <div
              v-for="key in ASPECT_KEYS"
              :key="key"
              class="flex flex-wrap items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0 last:pb-0"
            >
              <span :id="`al-${key}`">{{ t(`aspects.${key}`) }}</span>
              <div
                class="inline-flex gap-1 rounded-full bg-surface-2 p-1"
                role="radiogroup"
                :aria-labelledby="`al-${key}`"
              >
                <button
                  v-for="v in 5"
                  :key="v"
                  type="button"
                  role="radio"
                  :aria-checked="form.aspects[key] === v"
                  class="h-[34px] w-10 rounded-full border-0 text-sm transition-colors"
                  :class="
                    form.aspects[key] === v ? 'bg-ink text-bg' : 'bg-transparent hover:bg-surface'
                  "
                  @click="toggleAspect(key, v)"
                >
                  {{ v }}
                </button>
              </div>
            </div>
          </fieldset>

          <!-- 04 review text -->
          <fieldset class="group-set border-b-0">
            <legend class="group-legend">
              <span class="num">04</span>{{ t('write.yourReview') }}
            </legend>
            <label class="sr-only" for="f-body">{{ t('write.yourReview') }}</label>
            <textarea
              id="f-body"
              v-model="form.body"
              :maxlength="REVIEW_LIMITS.body"
              :placeholder="t('write.bodyPlaceholder')"
              :class="[inputClass, 'min-h-[150px] resize-y']"
            />
            <div class="mt-1.5 text-right text-xs text-muted">
              {{ t('write.count', { n: form.body.length, max: REVIEW_LIMITS.body }) }}
            </div>
            <label
              class="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line px-[18px] py-[15px]"
            >
              <span>{{ t('write.recommend') }}</span>
              <input v-model="form.recommend" type="checkbox" class="switch" />
            </label>
          </fieldset>

          <div class="flex flex-col gap-3 pt-[26px]">
            <UiButton type="submit" size="lg" block :disabled="submitting">
              {{ editing ? t('write.submitEdit') : t('write.submit') }}
            </UiButton>
            <span
              role="status"
              aria-live="polite"
              class="min-h-[1.5em] text-center"
              :class="{
                'text-sm text-danger': message?.kind === 'error',
                'font-medium text-success': message?.kind === 'success',
              }"
            >
              {{ message?.text }}
            </span>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.group-set {
  min-width: 0;
  margin: 0;
  padding: 26px 0;
  border: 0;
  border-bottom: 1px solid rgb(var(--color-border));
}

.group-set.border-b-0 {
  border-bottom: 0;
}

.group-legend {
  float: left;
  width: 100%;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 0;
  margin-bottom: 18px;
  font-stretch: 125%;
  font-weight: 500;
  font-size: 21px;
  letter-spacing: var(--letter-spacing-heading);
  line-height: var(--line-height-heading);
}

.group-legend + * {
  clear: both;
}

.group-legend .num {
  width: 22px;
  flex: none;
  font-size: 12px;
  font-stretch: 100%;
  letter-spacing: 0;
  color: rgb(var(--color-muted));
}

.group-legend .opt {
  font-size: 13px;
  font-weight: 400;
  font-stretch: 100%;
  letter-spacing: 0;
  color: rgb(var(--color-muted));
}

.field-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.hint {
  font-weight: 400;
  font-size: 13px;
  color: rgb(var(--color-muted));
}

.star svg {
  transition: transform 0.15s;
}

.star:hover svg {
  transform: scale(1.08);
}

.switch {
  appearance: none;
  position: relative;
  flex: none;
  width: 46px;
  height: 26px;
  margin: 0;
  border-radius: 999px;
  background: rgb(var(--color-border));
  cursor: pointer;
  transition: background 0.2s;
}

.switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  /* Light knob in both modes, as in the design. */
  background: rgb(var(--color-night-strong));
  box-shadow: 0 1px 3px rgb(var(--color-night) / 0.3);
  transition: transform 0.2s;
}

.switch:checked {
  background: rgb(var(--color-primary));
}

.switch:checked::after {
  transform: translateX(20px);
}

@media (prefers-reduced-motion: reduce) {
  .star svg,
  .switch,
  .switch::after {
    transition: none;
  }
}
</style>
