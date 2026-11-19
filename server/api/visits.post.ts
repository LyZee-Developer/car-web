/**
 * Records a page view (`{ view: true }`, once per browser session) or a heartbeat
 * (`{ view: false }`, every minute while the page is visible). Returns the updated totals.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ view?: unknown } | null>(event)
  const id = getVisitorId(event, true)
  return withStorageTimeout(recordVisit(id, body?.view === true).then(() => getVisitStats()))
})
