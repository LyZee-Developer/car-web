<template>
  <section id="rating" class="pb-[72px] md:pb-24" aria-labelledby="rating-title">
    <div class="page-wrap">
      <UiSectionIntro heading-id="rating-title" :title="t('rating.title')" :text="intro" />

      <div
        class="dash relative grid overflow-hidden rounded-panel border border-night-edge text-night-text lg:grid-cols-[1.05fr_1fr]"
      >
        <div
          class="relative flex flex-col items-center justify-center border-b border-night-line px-5 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:pb-10 lg:pt-11"
        >
          <HomeRatingGauge :average="reviews.averageRating" :count="reviews.count" />
          <div class="-mt-1 flex flex-col items-center gap-1.5">
            <UiStars
              v-if="reviews.count"
              :value="reviews.averageRating"
              :size="20"
              tone="night"
              :label="t('rating.averageLabel', { avg: formatDecimal(reviews.averageRating) })"
            />
            <span class="text-sm text-night-muted">{{ subtitle }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="tile min-w-0 border-b border-night-line">
            <h3 class="tile-title">{{ t('rating.count') }}</h3>
            <div class="big">{{ reviews.loaded ? reviews.count : '–' }}</div>
          </div>
          <div class="tile min-w-0 border-b border-l border-night-line">
            <h3 class="tile-title">{{ t('rating.recommend') }}</h3>
            <div class="flex items-center gap-2.5 xs:gap-4">
              <UiRing
                :value="reviews.count ? reviews.recommendPercent / 100 : 0"
                class="size-[46px] flex-none xs:size-16"
              />
              <div class="big">
                <template v-if="reviews.count">
                  {{ reviews.recommendPercent }}<small>%</small>
                </template>
                <template v-else>–</template>
              </div>
            </div>
          </div>
          <div class="tile col-span-2 min-w-0 border-b border-night-line">
            <h3 class="tile-title">{{ t('rating.byArea') }}</h3>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="key in ASPECT_KEYS"
                :key="key"
                class="flex flex-col items-center gap-2 text-center"
              >
                <div class="relative size-[68px] xs:size-[84px]">
                  <UiRing
                    :value="(reviews.aspectAverages[key] ?? 0) / 5"
                    :radius="30"
                    class="size-full"
                  />
                  <b
                    class="absolute inset-0 grid place-items-center text-lg font-medium [font-stretch:125%] xs:text-[22px]"
                  >
                    {{
                      reviews.aspectAverages[key]
                        ? formatDecimal(reviews.aspectAverages[key]!)
                        : '–'
                    }}
                  </b>
                </div>
                <span class="text-[13px] text-night-muted">{{ t(`aspects.${key}`) }}</span>
              </div>
            </div>
          </div>
          <div class="tile col-span-2 min-w-0">
            <h3 class="tile-title">{{ t('rating.latest') }}</h3>
            <div v-if="reviews.latest">
              <UiStars :value="reviews.latest.rating" :size="15" tone="night" />
              <q
                class="my-2 mb-2.5 block font-quote text-[17px] leading-[1.75] text-night-text [overflow-wrap:anywhere] [quotes:none]"
                :lang="/[ក-៿]/.test(latestQuote) ? 'km' : undefined"
              >
                {{ latestQuote }}
              </q>
              <div class="text-[13px] text-night-muted">{{ latestBy }}</div>
            </div>
            <p v-else class="m-0 text-night-muted">
              {{ reviews.loaded ? t('rating.latestNone') : t('rating.latestPending') }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p class="m-0 text-sm text-muted">{{ t('rating.liveNote') }}</p>
        <div class="flex flex-wrap gap-3">
          <UiButton :to="{ path: '/', hash: '#write' }">{{
            t('common.buttons.writeReview')
          }}</UiButton>
          <UiButton :to="{ path: '/', hash: '#reviews' }" variant="line">
            {{ t('common.buttons.readAllReviews') }}
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASPECT_KEYS } from '~/types/review'

const { t } = useI18n()
const reviews = useReviewsStore()
const formatDecimal = useFormatDecimal()
const formatDate = useFormatDate()

const subtitle = computed(() => {
  if (reviews.status === 'error') return t('rating.unavailable')
  if (!reviews.loaded) return t('rating.loading')
  return reviews.count
    ? t('rating.average', { n: reviews.count }, reviews.count)
    : t('rating.noReviews')
})

const intro = computed(() =>
  reviews.loaded && reviews.count
    ? t('rating.summary', { pct: reviews.recommendPercent, n: reviews.count }, reviews.count)
    : t('rating.intro'),
)

const latestQuote = computed(() => {
  const body = reviews.latest?.body ?? ''
  return body.length > 180 ? `${body.slice(0, 177).trimEnd()}…` : body
})

const latestBy = computed(() => {
  const r = reviews.latest
  if (!r) return ''
  return [
    r.name || t('common.customer'),
    r.car,
    t(`services.items.${r.service}.name`),
    formatDate(r.createdAt),
  ]
    .filter(Boolean)
    .join(' · ')
})
</script>

<style scoped>
.dash {
  background: radial-gradient(
    55% 80% at 22% 30%,
    rgb(var(--color-night-raised)) 0%,
    rgb(var(--color-night-2) / 0.7) 60%,
    rgb(var(--color-night)) 100%
  );
}

.dash::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    90deg,
    rgb(var(--color-night-text) / 0.025) 0 1px,
    transparent 1px 80px
  );
  mask-image: linear-gradient(90deg, #000, transparent 55%);
}

.tile {
  padding: 22px 20px;
}

@media (min-width: 480px) {
  .tile {
    padding: 28px 30px;
  }
}

.tile-title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  font-stretch: 100%;
  letter-spacing: 0;
  line-height: 1.5;
  color: rgb(var(--color-night-muted));
}

.big {
  font-stretch: 125%;
  font-weight: 500;
  font-size: 36px;
  line-height: 1;
  letter-spacing: -0.03em;
}

@media (min-width: 480px) {
  .big {
    font-size: 44px;
  }
}

.big small {
  margin-left: 4px;
  font-size: 18px;
  letter-spacing: 0;
  color: rgb(var(--color-night-muted));
}
</style>
