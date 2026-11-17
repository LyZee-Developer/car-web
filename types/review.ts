export const SERVICE_IDS = [
  'oil',
  'brakes',
  'engine',
  'tires',
  'ac',
  'electrical',
  'body',
  'diag',
  'general',
] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

export const ASPECT_KEYS = ['quality', 'price', 'time'] as const
export type AspectKey = (typeof ASPECT_KEYS)[number]
export type AspectScores = Partial<Record<AspectKey, number>>

/** A review as the API returns it to the browser. */
export interface Review {
  id: string
  name: string
  car: string
  service: ServiceId
  rating: number
  body: string
  aspects: AspectScores
  recommend: boolean
  createdAt: number
  updatedAt: number
  /** True when the review belongs to the current visitor (cookie). */
  mine: boolean
}

/** What the browser sends to create or update its review. */
export interface ReviewInput {
  name: string
  car: string
  service: ServiceId
  rating: number
  body: string
  aspects: AspectScores
  recommend: boolean
}

export interface VisitStats {
  views: number
  unique: number
  today: number
  online: number
}

export const REVIEW_LIMITS = {
  name: 40,
  car: 40,
  body: 800,
  bodyMin: 10,
} as const

/** Data the card needs; the live preview passes a partial review with no id/dates. */
export interface ReviewCardData {
  name: string
  car: string
  service: ServiceId | ''
  rating: number
  body: string
  aspects: AspectScores
  recommend: boolean
  createdAt?: number
  updatedAt?: number
  mine?: boolean
}
