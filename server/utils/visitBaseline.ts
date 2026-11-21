import type { VisitStats } from '~/types/review'

/**
 * Demo baseline for the visitor counter, added on top of the real recorded visits.
 *
 * - Total visits starts at 986 and unique visitors at 540 on START_DAY.
 * - Every day after that, total visits grows by 1–10 and unique visitors by 1–(that day's visits).
 * - "Visitors today" is that day's 1–10, filled in gradually over the day so it never goes down.
 * - "Online now" is 1–10 (never more than today's visitors) and changes every few minutes.
 *
 * All numbers come from a seeded random generator keyed on the date, so every visitor and
 * every server instance sees the same values and they never jump backwards on refresh.
 */
const BASE_VIEWS = 986
const BASE_UNIQUE = 540
/** Days are counted in Cambodia time (UTC+7), whatever the server's time zone is. */
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const START_DAY = Math.floor((Date.UTC(2026, 10, 21) + TZ_OFFSET_MS) / DAY_MS)
const ONLINE_BUCKET_MS = 3 * 60 * 1000

/** Deterministic 0–1 value for a key (FNV-1a hash + mulberry32 mix). */
function seeded(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  h += 0x6d2b79f5
  let t = h
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Integer from min to max (inclusive) for a key. */
const seededInt = (key: string, min: number, max: number) =>
  min + Math.floor(seeded(key) * (max - min + 1))

function dayTargets(day: number) {
  const views = seededInt(`views:${day}`, 1, 10)
  return { views, unique: seededInt(`unique:${day}`, 1, views) }
}

export function getVisitBaseline(now = Date.now()): VisitStats {
  const local = now + TZ_OFFSET_MS
  const today = Math.max(START_DAY, Math.floor(local / DAY_MS))
  // Share of today already passed (0–1), so today's numbers fill in through the day.
  const progress = today * DAY_MS <= local ? (local - today * DAY_MS) / DAY_MS : 0

  let views = BASE_VIEWS
  let unique = BASE_UNIQUE
  for (let day = START_DAY; day < today; day++) {
    const t = dayTargets(day)
    views += t.views
    unique += t.unique
  }

  const t = dayTargets(today)
  const todayViews = Math.max(1, Math.ceil(t.views * progress))
  const todayUnique = Math.min(todayViews, Math.max(1, Math.ceil(t.unique * progress)))
  const online = seededInt(`online:${Math.floor(now / ONLINE_BUCKET_MS)}`, 1, Math.min(10, todayViews))

  return {
    views: views + todayViews,
    unique: unique + todayUnique,
    today: todayViews,
    online,
  }
}
