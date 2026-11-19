/**
 * Runs a storage operation with a time limit. If the database is slow or unreachable,
 * the request fails with 503 after `ms` instead of hanging the page.
 */
export async function withStorageTimeout<T>(work: Promise<T>, ms = 3000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(createError({ statusCode: 503, statusMessage: 'Storage unavailable' })),
      ms,
    )
  })
  try {
    return await Promise.race([work, timeout])
  } finally {
    clearTimeout(timer)
  }
}
