import { defineStore } from 'pinia'
import {
  ASPECT_KEYS,
  type AspectKey,
  type Review,
  type ReviewInput,
  type ServiceId,
} from '~/types/review'

export type ReviewsStatus = 'idle' | 'loading' | 'ready' | 'error'

const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

export const useReviewsStore = defineStore('reviews', () => {
  // Forwards the visitor cookie during SSR so `mine` is correct on first render.
  const requestFetch = useRequestFetch()

  const items = ref<Review[]>([])
  const status = ref<ReviewsStatus>('idle')

  async function load() {
    if (status.value === 'idle') status.value = 'loading'
    try {
      // Give up after 5 s so a slow database never stalls the page.
      items.value = await requestFetch<Review[]>('/api/reviews', { timeout: 5000, retry: 0 })
      status.value = 'ready'
    } catch {
      // Keep showing what we already have; only flag an error if nothing ever loaded.
      if (status.value !== 'ready') status.value = 'error'
    }
  }

  async function saveMine(input: ReviewInput) {
    const saved = await $fetch<Review>('/api/reviews/mine', { method: 'PUT', body: input })
    const index = items.value.findIndex((r) => r.id === saved.id)
    if (index >= 0) items.value.splice(index, 1, saved)
    else items.value.push(saved)
    return saved
  }

  async function deleteMine() {
    await $fetch('/api/reviews/mine', { method: 'DELETE' })
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
