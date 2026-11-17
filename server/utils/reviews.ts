import {
  ASPECT_KEYS,
  REVIEW_LIMITS,
  SERVICE_IDS,
  type AspectScores,
  type Review,
  type ReviewInput,
  type ServiceId,
} from '~/types/review'

export type StoredReview = Omit<Review, 'id' | 'mine'>

const db = () => useStorage('db')

const isRating = (v: unknown): v is number =>
  Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 5

export async function listReviews(visitorId: string | null): Promise<Review[]> {
  const keys = await db().getKeys('reviews')
  const reviews = await Promise.all(
    keys.map(async (key) => {
      const id = key.split(':').pop()!
      const stored = await db().getItem<StoredReview>(key)
      if (!stored) return null
      return { ...stored, id, mine: id === visitorId } satisfies Review
    }),
  )
  return reviews.filter((r): r is Review => r !== null)
}

export async function getStoredReview(id: string) {
  return db().getItem<StoredReview>(`reviews:${id}`)
}

export async function saveReview(id: string, review: StoredReview) {
  await db().setItem(`reviews:${id}`, review)
}

export async function deleteReview(id: string) {
  await db().removeItem(`reviews:${id}`)
}

/** Validates and normalises a review body from the browser. Throws a 400 on bad input. */
export function parseReviewInput(body: unknown): ReviewInput {
  const fail = (field: string) => {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${field}` })
  }
  if (!body || typeof body !== 'object') fail('body')
  const input = body as Record<string, unknown>

  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

  const rating = input.rating
  if (!isRating(rating)) fail('rating')

  const name = text(input.name, REVIEW_LIMITS.name)
  if (!name) fail('name')

  const service = input.service as ServiceId
  if (!SERVICE_IDS.includes(service)) fail('service')

  const reviewBody = text(input.body, REVIEW_LIMITS.body)
  if (reviewBody.length < REVIEW_LIMITS.bodyMin) fail('body')

  const aspects: AspectScores = {}
  const rawAspects = (input.aspects ?? {}) as Record<string, unknown>
  for (const key of ASPECT_KEYS) {
    if (isRating(rawAspects[key])) aspects[key] = rawAspects[key]
  }

  return {
    rating: rating as number,
    name,
    car: text(input.car, REVIEW_LIMITS.car),
    service,
    body: reviewBody,
    aspects,
    recommend: input.recommend === true,
  }
}
