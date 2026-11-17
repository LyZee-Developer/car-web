/** All reviews, with a `mine` flag for the current visitor. */
export default defineEventHandler(async (event) => {
  return listReviews(getVisitorId(event))
})
