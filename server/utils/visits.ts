import type { VisitStats } from '~/types/review'

interface StoredVisit {
  views: number
  first: number
  last: number
  seen: number
}

/** A visitor counts as "online" if their page sent a heartbeat in the last 2.5 minutes. */
const ONLINE_WINDOW_MS = 150_000

const db = () => useStorage('db')

export async function recordVisit(id: string, countView: boolean) {
  const key = `visits:${id}`
  const now = Date.now()
  const existing = await db().getItem<StoredVisit>(key)
  await db().setItem<StoredVisit>(key, {
    views: (existing?.views ?? 0) + (countView || !existing ? 1 : 0),
    first: existing?.first ?? now,
    last: now,
    seen: now,
  })
}

export async function getVisitStats(): Promise<VisitStats> {
  const keys = await db().getKeys('visits')
  const visits = (await Promise.all(keys.map((k) => db().getItem<StoredVisit>(k)))).filter(
    (v): v is StoredVisit => !!v && typeof v.views === 'number',
  )
  const now = Date.now()
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  // Real recorded visits are added on top of the demo baseline (see visitBaseline.ts).
  const base = getVisitBaseline(now)
  return {
    views: base.views + visits.reduce((sum, v) => sum + Math.max(0, v.views), 0),
    unique: base.unique + visits.length,
    today: base.today + visits.filter((v) => v.last >= startOfDay.getTime()).length,
    online: base.online + visits.filter((v) => v.seen >= now - ONLINE_WINDOW_MS).length,
  }
}
