import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'visitor_id'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * Anonymous visitor id kept in an httpOnly cookie. It identifies "my review" and
 * de-duplicates the visitor counter. It is not authentication.
 */
export function getVisitorId(event: H3Event, create: true): string
export function getVisitorId(event: H3Event, create?: false): string | null
export function getVisitorId(event: H3Event, create = false): string | null {
  const existing = getCookie(event, COOKIE)
  if (existing && UUID.test(existing)) return existing
  if (!create) return null

  const id = randomUUID()
  setCookie(event, COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: !import.meta.dev,
    maxAge: 60 * 60 * 24 * 400,
  })
  return id
}
