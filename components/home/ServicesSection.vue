<template>
  <section id="services" class="py-[72px] md:py-24" aria-labelledby="services-title">
    <div class="page-wrap">
      <UiSectionIntro
        heading-id="services-title"
        :title="t('services.title')"
        :text="t('services.intro')"
      />

      <div class="mb-10 grid items-start gap-x-8 gap-y-3.5 md:grid-cols-[auto_1fr]">
        <h3 id="finder-title" class="pt-1.5 text-xl">
          {{ t('services.finderTitle') }}
          <span class="mt-1 block text-[13px] font-normal text-muted [font-stretch:100%]">
            {{ t('services.finderHint') }}
          </span>
        </h3>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="finder-title">
          <UiChip
            v-for="(s, i) in SYMPTOMS"
            :key="s.key"
            :active="symptom === i"
            @click="chooseSymptom(i)"
          >
            {{ t(`symptoms.${s.key}`) }}
          </UiChip>
        </div>
        <p class="m-0 min-h-[1.6em] text-muted md:col-start-2" role="status" aria-live="polite">
          {{ finderResult }}
        </p>
      </div>

      <div
        class="grid items-start gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]"
      >
        <HomeServiceCard
          v-for="service in SERVICES"
          :key="service.id"
          :service="service"
          :matched="matches ? matches.includes(service.id) : null"
          :open="expanded.has(service.id)"
          :loaded="reviews.loaded"
          :review-count="reviews.serviceSummary(service.id).count"
          :review-average="reviews.serviceSummary(service.id).average"
          @update:open="onToggle(service.id, $event)"
          @clear="clearSelection"
          @see-reviews="seeReviews(service.id)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ServiceId } from '~/types/review'

const { t } = useI18n()
const reviews = useReviewsStore()
const ui = useUiStore()
const scrollTo = useScrollToSection()

const symptom = ref(-1)
const expanded = ref(new Set<ServiceId>())

/** Services the chosen symptom points to (null when no symptom is chosen). */
const matches = computed<ServiceId[] | null>(() =>
  symptom.value >= 0 ? SYMPTOMS[symptom.value]!.services : null,
)

const finderResult = computed(() => {
  if (symptom.value < 0) return ''
  const names = SYMPTOMS[symptom.value]!.services.map((id) => t(`services.items.${id}.name`))
  return t('services.finderResult', { services: names.join(t('services.or')) })
})

function setExpanded(id: ServiceId, open: boolean) {
  const next = new Set(expanded.value)
  if (open) next.add(id)
  else next.delete(id)
  expanded.value = next
}

/** Closing a card from its arrow also clears the symptom selection. */
function onToggle(id: ServiceId, open: boolean) {
  setExpanded(id, open)
  if (!open) clearSelection()
}

/** Clears the symptom and slides every open card's details back up. */
function clearSelection() {
  symptom.value = -1
  expanded.value = new Set()
}

function chooseSymptom(index: number) {
  if (symptom.value === index) {
    clearSelection()
    return
  }
  symptom.value = index
  // Show only the cards for this symptom opened.
  const services = SYMPTOMS[index]!.services
  expanded.value = new Set(services)
  scrollTo(`svc-${services[0]}`)
}

function seeReviews(id: ServiceId) {
  ui.showReviewsFor(id)
  scrollTo('reviews')
}
</script>
