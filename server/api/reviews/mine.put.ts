import type { Review } from '~/types/review'

/** Creates or updates the current visitor's review (one review per visitor). */
export default defineEventHandler(async (event): Promise<Review> => {
  const input = parseReviewInput(await readBody(event))
  const id = getVisitorId(event, true)

  return withStorageTimeout(
    (async () => {
      const existing = await getStoredReview(id)
      const now = Date.now()
      const stored = { ...input, createdAt: existing?.createdAt ?? now, updatedAt: now }
      await saveReview(id, stored)
      setResponseStatus(event, existing ? 200 : 201)
      return { ...stored, id, mine: true }
    })(),
  )
})
