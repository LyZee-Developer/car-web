import { defineStore } from 'pinia'
import {
  ASPECT_KEYS,
  type AspectKey,
  type Review,
  type ReviewInput,
  type ServiceId,
} from '~/types/review'
import { getDailyReviews } from '~/data/reviews'

export type ReviewsStatus = 'idle' | 'loading' | 'ready' | 'error'

const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

/**
 * Reviews come from fixed data in `data/reviews.ts` for now (no API calls); the order and
 * dates change once a day. A review written in the form is kept in memory only and is gone
 * after a page reload.
 */
export const useReviewsStore = defineStore('reviews', () => {
  // Built on the server during SSR and handed to the browser, so both render the same list.
  const items = ref<Review[]>(getDailyReviews())
  const status = ref<ReviewsStatus>('ready')

  async function load() {
    // Nothing to fetch yet: the fixed reviews are already in `items`.
  }

  async function saveMine(input: ReviewInput) {
    const existing = items.value.find((r) => r.mine)
    const now = Date.now()
    const saved: Review = {
      ...input,
      id: existing?.id ?? 'mine',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      mine: true,
    }
    const index = items.value.findIndex((r) => r.id === saved.id)
    if (index >= 0) items.value.splice(index, 1, saved)
    else items.value.push(saved)
    return saved
  }

  async function deleteMine() {
    items.value = items.value.filter((r) => !r.mine)
  }

  const loaded = computed(() => status.value === 'ready')
  const mine = computed(() => items.value.find((r) => r.mine) ?? null)
  const count = computed(() => items.value.length)
  const averageRating = computed(() => average(items.value.map((r) => r.rating)))
  const recommendPercent = computed(() =>
    count.value
      ? Math.round((items.value.filter((r) => r.recommend).length / count.value) * 100)
      : 0,
  )

  const aspectAverages = computed(
    () =>
      Object.fromEntries(
        ASPECT_KEYS.map((key) => {
          const values = items.value
            .map((r) => r.aspects[key])
            .filter((v): v is number => typeof v === 'number' && v >= 1 && v <= 5)
          return [key, values.length ? average(values) : null]
        }),
      ) as Record<AspectKey, number | null>,
  )

  const latest = computed(
    () => [...items.value].sort((a, b) => b.createdAt - a.createdAt)[0] ?? null,
  )

  /** Count of reviews per star value (index 1–5). */
  const starCounts = computed(() => {
    const counts = [0, 0, 0, 0, 0, 0]
    items.value.forEach((r) => counts[r.rating]!++)
    return counts
  })

  function serviceSummary(service: ServiceId) {
    const reviews = items.value.filter((r) => r.service === service)
    return { count: reviews.length, average: average(reviews.map((r) => r.rating)) }
  }

  return {
    items,
    status,
    loaded,
    mine,
    count,
    averageRating,
    recommendPercent,
    aspectAverages,
    latest,
    starCounts,
    serviceSummary,
    load,
    saveMine,
    deleteMine,
  }
})
