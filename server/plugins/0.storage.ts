import upstashDriver from 'unstorage/drivers/upstash'

/**
 * Where reviews and visitor counts are stored.
 *
 * - Locally: files in `.data/db` (configured in nuxt.config.ts).
 * - On Vercel (or any host with a read-only file system): an Upstash Redis database.
 *   Connect one in Vercel → Storage → Upstash for Redis; it adds the environment variables below.
 *
 * The credentials are read at runtime from environment variables, so they are never bundled
 * into the build. The file name starts with "0." so this runs before the other server plugins.
 */
export default defineNitroPlugin(async () => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (url && token) {
    const storage = useStorage()
    // Replace the local-file mount from nuxt.config.ts (mounting twice on one base throws).
    await storage.unmount('db', false)
    storage.mount(
      'db',
      // One quick retry only, so a database outage fails fast instead of stalling page loads.
      upstashDriver({ url, token, base: 'heng-auto', retry: { retries: 1, backoff: () => 200 } }),
    )
    console.info('[storage] Using Upstash Redis for reviews and visitor counts.')
  } else if (process.env.VERCEL) {
    console.warn(
      '[storage] No Upstash Redis connected: reviews and visitor counts cannot be saved on Vercel. ' +
        'Add Upstash for Redis in Vercel → Storage.',
    )
  }
})
