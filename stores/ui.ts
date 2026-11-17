import { defineStore } from 'pinia'
import type { ServiceId } from '~/types/review'

/**
 * Cross-section page state: the review filter (set from service cards and the reviews section)
 * and which service cards are expanded / highlighted.
 */
export const useUiStore = defineStore('ui', () => {
  const reviewFilter = reactive({
    service: 'all' as ServiceId | 'all',
    stars: 0,
    sort: 'new' as 'new' | 'high' | 'low',
  })

  function showReviewsFor(service: ServiceId) {
    reviewFilter.service = service
    reviewFilter.stars = 0
  }

  function clearReviewFilters() {
    reviewFilter.service = 'all'
    reviewFilter.stars = 0
  }

  return { reviewFilter, showReviewsFor, clearReviewFilters }
})
