import type { StoredReview } from '~/server/utils/reviews'

/**
 * DEVELOPMENT ONLY: writes 14 sample reviews (refreshed on every start) so the
 * "What customers say" section, the rating gauge and the service cards can be previewed.
 *
 * These are not real customer reviews. They are only written when
 * runtimeConfig.seedDemoReviews is true (on in `nuxt dev`, off in production builds)
 * and no real database (Upstash) is connected. To remove them, delete the `.data/db` folder.
 */
const DAY = 24 * 60 * 60 * 1000

function demoReviews(now: number): { id: string; review: StoredReview }[] {
  return [
    {
      id: 'demo-brakes',
      review: {
        name: 'សុខា',
        car: 'Toyota Camry 2018',
        service: 'brakes',
        rating: 5,
        body: 'អរគុណបងៗជាងច្រើន ដែលបានពិនិត្យហ្វ្រាំងឡានខ្ញុំ។ ឥឡូវឈប់ល្អហើយ។',
        aspects: { quality: 5, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 2 * DAY,
        updatedAt: now - 2 * DAY,
      },
    },
    {
      id: 'demo-ac',
      review: {
        name: 'Dara',
        car: 'Honda CR-V 2020',
        service: 'ac',
        rating: 5,
        body: 'Thank you for fixing my A/C. It is very cold now.',
        aspects: { quality: 5, price: 4, time: 5 },
        recommend: true,
        createdAt: now - 5 * DAY,
        updatedAt: now - 5 * DAY,
      },
    },
    {
      id: 'demo-diag',
      review: {
        name: 'ចាន់ធី',
        car: 'Lexus RX 350',
        service: 'diag',
        rating: 5,
        body: 'អរគុណដែលបានជួយពិនិត្យឡានខ្ញុំ ហើយពន្យល់ច្បាស់ណាស់។',
        aspects: { quality: 5, price: 5, time: 4 },
        recommend: true,
        createdAt: now - 9 * DAY,
        updatedAt: now - 9 * DAY,
      },
    },
    {
      id: 'demo-oil',
      review: {
        name: 'Vicheka',
        car: 'Mazda CX-5 2019',
        service: 'oil',
        rating: 4,
        body: 'Thanks for the quick oil change. Good service.',
        aspects: { quality: 4, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 14 * DAY,
        updatedAt: now - 14 * DAY,
      },
    },
    {
      id: 'demo-tires',
      review: {
        name: 'Sophea',
        car: 'Ford Ranger 2021',
        service: 'tires',
        rating: 5,
        body: 'Thank you for checking my car. It drives straight again.',
        aspects: { quality: 5, price: 4, time: 5 },
        recommend: true,
        createdAt: now - 1 * DAY,
        updatedAt: now - 1 * DAY,
      },
    },
    {
      id: 'demo-electrical',
      review: {
        name: 'វណ្ណា',
        car: 'Toyota Prius 2015',
        service: 'electrical',
        rating: 5,
        body: 'អរគុណច្រើន ឡានឆេះស្រួលវិញហើយ។',
        aspects: { quality: 5, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 3 * DAY,
        updatedAt: now - 3 * DAY,
      },
    },
    {
      id: 'demo-body',
      review: {
        name: 'Rachana',
        car: 'Hyundai Tucson 2019',
        service: 'body',
        rating: 5,
        body: 'Thank you, the paint looks like new. Very happy.',
        aspects: { quality: 5, price: 4, time: 5 },
        recommend: true,
        createdAt: now - 4 * DAY,
        updatedAt: now - 4 * DAY,
      },
    },
    {
      id: 'demo-general',
      review: {
        name: 'ពិសិដ្ឋ',
        car: 'Toyota Highlander 2017',
        service: 'general',
        rating: 5,
        body: 'អរគុណដែលបានពិនិត្យឡានមុនខ្ញុំធ្វើដំណើរ។ សេវាល្អណាស់។',
        aspects: { quality: 5, price: 5, time: 4 },
        recommend: true,
        createdAt: now - 6 * DAY,
        updatedAt: now - 6 * DAY,
      },
    },
    {
      id: 'demo-engine',
      review: {
        name: 'Kimheng',
        car: 'Nissan Navara 2016',
        service: 'engine',
        rating: 4,
        body: 'Thanks for checking my engine. It runs well now.',
        aspects: { quality: 5, price: 4, time: 4 },
        recommend: true,
        createdAt: now - 7 * DAY,
        updatedAt: now - 7 * DAY,
      },
    },
    {
      id: 'demo-brakes-2',
      review: {
        name: 'ស្រីនាង',
        car: 'Honda Civic 2018',
        service: 'brakes',
        rating: 5,
        body: 'អរគុណបង សេវាល្អ និងរហ័ស។',
        aspects: { quality: 5, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 10 * DAY,
        updatedAt: now - 10 * DAY,
      },
    },
    {
      id: 'demo-ac-2',
      review: {
        name: 'Bunthoeun',
        car: 'Kia Sportage 2020',
        service: 'ac',
        rating: 4,
        body: 'Thank you, no more bad smell from the A/C.',
        aspects: { quality: 4, price: 4, time: 5 },
        recommend: true,
        createdAt: now - 12 * DAY,
        updatedAt: now - 12 * DAY,
      },
    },
    {
      id: 'demo-diag-2',
      review: {
        name: 'Malis',
        car: 'Toyota Corolla 2014',
        service: 'diag',
        rating: 5,
        body: 'Thank you for checking my car before I bought it.',
        aspects: { quality: 5, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 16 * DAY,
        updatedAt: now - 16 * DAY,
      },
    },
    {
      id: 'demo-oil-2',
      review: {
        name: 'សុភ័ក្ត្រ',
        car: 'Lexus ES 300h',
        service: 'oil',
        rating: 5,
        body: 'អរគុណសម្រាប់ការប្តូរប្រេង។ នឹងមកម្តងទៀត។',
        aspects: { quality: 5, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 19 * DAY,
        updatedAt: now - 19 * DAY,
      },
    },
    {
      id: 'demo-general-2',
      review: {
        name: 'Narith',
        car: 'Mitsubishi Pajero 2018',
        service: 'general',
        rating: 5,
        body: 'Thank you for checking my car. Good price and friendly staff.',
        aspects: { quality: 5, price: 4, time: 5 },
        recommend: true,
        createdAt: now - 23 * DAY,
        updatedAt: now - 23 * DAY,
      },
    },
  ]
}

export default defineNitroPlugin(async () => {
  if (!useRuntimeConfig().seedDemoReviews) return
  // Never write samples into a real database (e.g. Upstash env vars pulled from Vercel).
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.VERCEL) {
    console.warn('[seed] Skipped sample reviews: a real database is connected.')
    return
  }

  const db = useStorage('db')
  const now = Date.now()
  const reviews = demoReviews(now)
  // Write every sample on each start, so edits to their text show up on an existing local board.
  for (const { id, review } of reviews) {
    await db.setItem(`reviews:${id}`, review)
  }
  console.info(
    `[seed] Wrote ${reviews.length} sample reviews for development (delete .data/db to remove).`,
  )
})
