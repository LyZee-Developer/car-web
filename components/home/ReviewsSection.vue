<script setup lang="ts">
import { SERVICE_IDS } from '~/types/review'

/** Reviews shown at first, and added per "Show more" click. */
const PAGE_SIZE = 4

const { t } = useI18n()
const reviews = useReviewsStore()
const ui = useUiStore()
const filter = ui.reviewFilter

const shownCount = ref(PAGE_SIZE)
// Changing a filter starts the list from the top again.
watch(
  () => [filter.service, filter.stars, filter.sort],
  () => (shownCount.value = PAGE_SIZE),
)

/** Only services that have reviews, plus the current choice so the select never goes blank. */
const serviceOptions = computed(() => {
  const used = new Set(reviews.items.map((r) => r.service))
  const ids = SERVICE_IDS.filter((id) => used.has(id) || id === filter.service)
  return [
    { value: 'all', label: t('reviews.allServices') },
    ...ids.map((id) => ({ value: id, label: t(`services.items.${id}.name`) })),
  ]
})

const filtered = computed(() => {
  const list = reviews.items.filter(
    (r) =>
      (filter.service === 'all' || r.service === filter.service) &&
      (!filter.stars || r.rating === filter.stars),
  )
  const byDate = (a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt
  return list.sort((a, b) =>
    filter.sort === 'high'
      ? b.rating - a.rating || byDate(a, b)
      : filter.sort === 'low'
        ? a.rating - b.rating || byDate(a, b)
        : byDate(a, b),
  )
})

const visible = computed(() => filtered.value.slice(0, shownCount.value))
const remaining = computed(() => Math.max(0, filtered.value.length - shownCount.value))
/** Initials of the next few hidden reviewers, for the avatar stack in the "more" row. */
const hiddenInitials = computed(() =>
  filtered.value
    .slice(shownCount.value, shownCount.value + 3)
    .map((r) => ((r.name || 'C').trim()[0] || 'C').toUpperCase()),
)

const listTop = ref<HTMLElement | null>(null)
function showMore() {
  shownCount.value += PAGE_SIZE
}
/** Collapse back to the first 4 and bring the list top back into view. */
function showFewer() {
  shownCount.value = PAGE_SIZE
  nextTick(() => listTop.value?.scrollIntoView({ block: 'start' }))
}

function toggleStars(stars: number) {
  filter.stars = filter.stars === stars ? 0 : stars
}

const deleteError = ref('')
async function deleteMine() {
  if (!window.confirm(t('reviews.confirmDelete'))) return
  deleteError.value = ''
  try {
    await reviews.deleteMine()
  } catch {
    deleteError.value = t('reviews.actionFailed')
  }
}

const selectClass =
  'cursor-pointer appearance-none rounded-full border-0 bg-surface-2 py-2.5 pl-4 pr-[38px] text-sm'
</script>

<template>
  <section id="reviews" class="pb-[72px] md:pb-24" aria-labelledby="reviews-title">
    <div class="page-wrap">
      <UiSectionIntro
        heading-id="reviews-title"
        :title="t('reviews.title')"
        :text="t('reviews.intro')"
      />

      <div
        class="mb-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[22px] border border-line bg-surface p-2.5 md:rounded-full md:p-2"
      >
        <div class="flex flex-wrap gap-1" role="group" :aria-label="t('reviews.filterStars')">
          <button
            type="button"
            class="star-btn"
            :aria-pressed="!filter.stars"
            @click="filter.stars = 0"
          >
            {{ t('reviews.all') }} <span class="text-xs opacity-60">{{ reviews.count }}</span>
          </button>
          <button
            v-for="stars in [5, 4, 3, 2, 1]"
            :key="stars"
            type="button"
            class="star-btn"
            :aria-pressed="filter.stars === stars"
            :aria-label="t('reviews.starFilter', { stars, count: reviews.starCounts[stars] })"
            @click="toggleStars(stars)"
          >
            {{ stars }}
            <svg viewBox="0 0 24 24" aria-hidden="true" class="size-[13px] fill-primary">
              <path
                d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
              />
            </svg>
            <span class="text-xs opacity-60">{{ reviews.starCounts[stars] }}</span>
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <label class="select-wrap">
            <span class="sr-only">{{ t('reviews.service') }}</span>
            <select v-model="filter.service" :class="selectClass">
              <option v-for="o in serviceOptions" :key="o.value" :value="o.value">
                {{ o.label }}
              </option>
            </select>
          </label>
          <label class="select-wrap">
            <span class="sr-only">{{ t('reviews.sortBy') }}</span>
            <select v-model="filter.sort" :class="selectClass">
              <option value="new">{{ t('reviews.sort.new') }}</option>
              <option value="high">{{ t('reviews.sort.high') }}</option>
              <option value="low">{{ t('reviews.sort.low') }}</option>
            </select>
          </label>
        </div>
      </div>

      <div role="status" aria-live="polite">
        <div v-if="reviews.status === 'error'" class="notice">{{ t('reviews.loadFailed') }}</div>
        <div v-if="deleteError" class="notice">{{ deleteError }}</div>
      </div>

      <div ref="listTop" class="grid scroll-mt-28 items-start gap-[18px] lg:grid-cols-2">
        <div v-if="!reviews.loaded && reviews.status !== 'error'" class="empty lg:col-span-2">
          <p class="m-0">{{ t('rating.loading') }}</p>
        </div>
        <div v-else-if="reviews.loaded && !reviews.count" class="empty lg:col-span-2">
          <h3 class="mb-2 text-2xl">{{ t('reviews.empty.title') }}</h3>
          <p class="mb-5 mt-0 text-muted">{{ t('reviews.empty.text') }}</p>
          <UiButton :to="{ path: '/', hash: '#write' }">{{ t('reviews.empty.cta') }}</UiButton>
        </div>
        <div v-else-if="reviews.loaded && !filtered.length" class="empty lg:col-span-2">
          <h3 class="mb-2 text-2xl">{{ t('reviews.noMatch.title') }}</h3>
          <p class="mb-5 mt-0 text-muted">{{ t('reviews.noMatch.text') }}</p>
          <UiButton variant="line" @click="ui.clearReviewFilters()">
            {{ t('reviews.noMatch.cta') }}
          </UiButton>
        </div>
        <template v-else>
          <HomeReviewCard
            v-for="review in visible"
            :key="review.id"
            :review="review"
            @delete="deleteMine"
          />
        </template>
      </div>

      <!-- When there are more than 4 reviews: show how many more customers have reviewed. -->
      <div
        v-if="reviews.loaded && (remaining > 0 || shownCount > PAGE_SIZE)"
        class="mt-6 flex flex-col items-center justify-between gap-4 rounded-card border border-line bg-surface px-5 py-4 sm:flex-row"
      >
        <div class="flex items-center gap-3">
          <div v-if="remaining > 0" class="flex -space-x-2.5" aria-hidden="true">
            <span
              v-for="(initial, i) in hiddenInitials"
              :key="i"
              class="grid size-9 place-items-center rounded-full border-2 border-surface bg-surface-2 text-sm font-semibold [font-stretch:112%]"
            >
              {{ initial }}
            </span>
            <span
              v-if="remaining > hiddenInitials.length"
              class="grid size-9 place-items-center rounded-full border-2 border-surface bg-ink text-xs font-semibold text-bg"
            >
              +{{ remaining - hiddenInitials.length }}
            </span>
          </div>
          <p class="m-0 text-sm" role="status" aria-live="polite">
            <template v-if="remaining > 0">
              <b class="font-semibold">{{ t('reviews.moreCount', { n: remaining }, remaining) }}</b>
              <span class="text-muted">
                · {{ t('reviews.showing', { shown: visible.length, total: filtered.length }) }}
              </span>
            </template>
            <span v-else class="text-muted">
              {{ t('reviews.showingAll', { total: filtered.length }) }}
            </span>
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-2">
          <UiButton v-if="shownCount > PAGE_SIZE" variant="line" size="sm" @click="showFewer">
            {{ t('reviews.showFewer') }}
          </UiButton>
          <UiButton v-if="remaining > 0" size="sm" @click="showMore">
            {{ t('reviews.showMore') }}
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.star-btn {
  @apply inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-[15px] py-[9px] text-sm transition-colors hover:bg-surface-2;
}

.star-btn[aria-pressed='true'] {
  @apply bg-ink text-bg;
}

.select-wrap {
  position: relative;
  display: inline-block;
}

.select-wrap::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  width: 7px;
  height: 7px;
  border-right: 1.5px solid rgb(var(--color-muted));
  border-bottom: 1.5px solid rgb(var(--color-muted));
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.notice {
  @apply mb-4 rounded-[14px] bg-primary/10 px-[18px] py-3.5 text-[15px];
}

.empty {
  @apply rounded-card border border-dashed border-line px-6 py-12 text-center;
}
</style>
