/** Deletes the current visitor's review. */
export default defineEventHandler(async (event) => {
  const id = getVisitorId(event)
  const existing = id ? await withStorageTimeout(getStoredReview(id)) : null
  if (!id || !existing) {
    throw createError({ statusCode: 404, statusMessage: 'No review to delete' })
  }
  await withStorageTimeout(deleteReview(id))
  setResponseStatus(event, 204)
  return null
})
