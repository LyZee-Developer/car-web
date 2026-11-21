import type { Review } from '~/types/review'

/**
 * Fixed reviews shown on the home page until the reviews API is switched on.
 * Use `getDailyReviews()`: it reshuffles the order and dates once per day (Cambodia time),
 * so the newest reviews at the top of the list change every day.
 */
const DAY = 24 * 60 * 60 * 1000
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000 // Cambodia (UTC+7)

function review(
  id: string,
  data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'mine'>,
): Review {
  return { id, ...data, createdAt: 0, updatedAt: 0, mine: false }
}

/** Small seeded random generator (mulberry32): same seed → same sequence. */
function random(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Today's reviews: the same for everyone all day, different the next day.
 * The order is shuffled and dates are spread over the last few weeks (newest first),
 * so a different set of reviews appears at the top each day.
 */
export function getDailyReviews(now = Date.now()): Review[] {
  const day = Math.floor((now + TZ_OFFSET_MS) / DAY)
  const rand = random(day * 2654435761)

  const list = REVIEW_POOL.map((r) => ({ ...r }))
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j]!, list[i]!]
  }

  // Newest review is from yesterday; each next one is 0–2 days older, at a daytime hour.
  const startOfToday = day * DAY - TZ_OFFSET_MS
  let daysAgo = 1
  for (const r of list) {
    const hour = 8 + Math.floor(rand() * 10) // 8:00–17:59
    r.createdAt = r.updatedAt =
      startOfToday - daysAgo * DAY + hour * 60 * 60 * 1000 + Math.floor(rand() * 60) * 60 * 1000
    daysAgo += Math.floor(rand() * 3)
  }
  return list
}

const REVIEW_POOL: Review[] = [
  review('demo-tires', {
    name: 'Sophea',
    car: 'Ford Ranger 2021',
    service: 'tires',
    rating: 5,
    body: 'Thank you for checking my car. It drives straight again.',
    aspects: { quality: 5, price: 4, time: 5 },
    recommend: true,
  }),
  review('demo-brakes', {
    name: 'សុខា',
    car: 'Toyota Camry 2018',
    service: 'brakes',
    rating: 5,
    body: 'អរគុណបងៗជាងច្រើន ដែលបានពិនិត្យហ្វ្រាំងឡានខ្ញុំ។ ឥឡូវឈប់ល្អហើយ។',
    aspects: { quality: 5, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-electrical', {
    name: 'វណ្ណា',
    car: 'Toyota Prius 2015',
    service: 'electrical',
    rating: 5,
    body: 'អរគុណច្រើន ឡានឆេះស្រួលវិញហើយ។',
    aspects: { quality: 5, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-body', {
    name: 'Rachana',
    car: 'Hyundai Tucson 2019',
    service: 'body',
    rating: 5,
    body: 'Thank you, the paint looks like new. Very happy.',
    aspects: { quality: 5, price: 4, time: 5 },
    recommend: true,
  }),
  review('demo-ac', {
    name: 'Dara',
    car: 'Honda CR-V 2020',
    service: 'ac',
    rating: 5,
    body: 'Thank you for fixing my A/C. It is very cold now.',
    aspects: { quality: 5, price: 4, time: 5 },
    recommend: true,
  }),
  review('demo-general', {
    name: 'ពិសិដ្ឋ',
    car: 'Toyota Highlander 2017',
    service: 'general',
    rating: 5,
    body: 'អរគុណដែលបានពិនិត្យឡានមុនខ្ញុំធ្វើដំណើរ។ សេវាល្អណាស់។',
    aspects: { quality: 5, price: 5, time: 4 },
    recommend: true,
  }),
  review('demo-engine', {
    name: 'Kimheng',
    car: 'Nissan Navara 2016',
    service: 'engine',
    rating: 4,
    body: 'Thanks for checking my engine. It runs well now.',
    aspects: { quality: 5, price: 4, time: 4 },
    recommend: true,
  }),
  review('demo-diag', {
    name: 'ចាន់ធី',
    car: 'Lexus RX 350',
    service: 'diag',
    rating: 5,
    body: 'អរគុណដែលបានជួយពិនិត្យឡានខ្ញុំ ហើយពន្យល់ច្បាស់ណាស់។',
    aspects: { quality: 5, price: 5, time: 4 },
    recommend: true,
  }),
  review('demo-brakes-2', {
    name: 'ស្រីនាង',
    car: 'Honda Civic 2018',
    service: 'brakes',
    rating: 5,
    body: 'អរគុណបង សេវាល្អ និងរហ័ស។',
    aspects: { quality: 5, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-ac-2', {
    name: 'Bunthoeun',
    car: 'Kia Sportage 2020',
    service: 'ac',
    rating: 4,
    body: 'Thank you, no more bad smell from the A/C.',
    aspects: { quality: 4, price: 4, time: 5 },
    recommend: true,
  }),
  review('demo-oil', {
    name: 'Vicheka',
    car: 'Mazda CX-5 2019',
    service: 'oil',
    rating: 4,
    body: 'Thanks for the quick oil change. Good service.',
    aspects: { quality: 4, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-diag-2', {
    name: 'Malis',
    car: 'Toyota Corolla 2014',
    service: 'diag',
    rating: 5,
    body: 'Thank you for checking my car before I bought it.',
    aspects: { quality: 5, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-oil-2', {
    name: 'សុភ័ក្ត្រ',
    car: 'Lexus ES 300h',
    service: 'oil',
    rating: 5,
    body: 'អរគុណសម្រាប់ការប្តូរប្រេង។ នឹងមកម្តងទៀត។',
    aspects: { quality: 5, price: 5, time: 5 },
    recommend: true,
  }),
  review('demo-general-2', {
    name: 'Narith',
    car: 'Mitsubishi Pajero 2018',
    service: 'general',
    rating: 5,
    body: 'Thank you for checking my car. Good price and friendly staff.',
    aspects: { quality: 5, price: 4, time: 5 },
    recommend: true,
  }),
]
