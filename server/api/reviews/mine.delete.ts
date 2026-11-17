/** Deletes the current visitor's review. */
export default defineEventHandler(async (event) => {
  const id = getVisitorId(event)
  if (!id || !(await getStoredReview(id))) {
    throw createError({ statusCode: 404, statusMessage: 'No review to delete' })
  }
  await deleteReview(id)
  setResponseStatus(event, 204)
  return null
})
