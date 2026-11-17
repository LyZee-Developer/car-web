import type { StoredReview } from '~/server/utils/reviews'

/**
 * DEVELOPMENT ONLY: fills an empty review board with 4 sample reviews so the
 * "What customers say" section, the rating gauge and the service cards can be previewed.
 *
 * These are not real customer reviews. They are only written when
 * runtimeConfig.seedDemoReviews is true (on in `nuxt dev`, off in production builds)
 * and the board is empty. To remove them, delete the `.data/db` folder.
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
        body: 'ហ្វ្រាំងមានសំឡេងស្រែកខ្លាំង។ ជាងបានបង្ហាញសំបកហ្វ្រាំងដែលរេចរឹលមកខ្ញុំ ហើយប្រាប់តម្លៃមុនធ្វើ។ រួចរាល់ក្នុងរយៈពេលពីរម៉ោង ហើយឥឡូវហ្វ្រាំងស្ងាត់ និងឈប់ល្អណាស់។',
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
        body: 'The A/C was only blowing cool air in the afternoon heat. They found a small leak, recharged the gas and changed the cabin filter while I waited. Ice cold now.',
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
        body: 'ភ្លើងព្រមានម៉ាស៊ីនឆេះ ហើយខ្ញុំបារម្ភខ្លាំង។ គេស្កេនរកឃើញថាជាសេនស័រអុកស៊ីសែន ផ្តល់របាយការណ៍ជាលាយលក្ខណ៍អក្សរ ហើយមិនបង្ខំឱ្យជួសជុលភ្លាមៗទេ។ ស្មោះត្រង់ណាស់។',
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
        body: 'Quick oil and filter change, done in about 30 minutes. They also topped up the coolant and washer fluid without asking for extra. Engine is noticeably quieter.',
        aspects: { quality: 4, price: 5, time: 5 },
        recommend: true,
        createdAt: now - 14 * DAY,
        updatedAt: now - 14 * DAY,
      },
    },
  ]
}

export default defineNitroPlugin(async () => {
  if (!useRuntimeConfig().seedDemoReviews) return

  const db = useStorage('db')
  const existing = await db.getKeys('reviews')
  if (existing.length) return

  const now = Date.now()
  for (const { id, review } of demoReviews(now)) {
    await db.setItem(`reviews:${id}`, review)
  }
  console.info('[seed] Added 4 sample reviews for development (delete .data/db to remove).')
})
