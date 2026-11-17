import {
  REVIEW_LIMITS,
  type AspectKey,
  type Review,
  type ReviewCardData,
  type ReviewInput,
  type ServiceId,
} from '~/types/review'

type FormMessage = { kind: 'error' | 'success' | 'info'; text: string } | null

/** State, progress and submit logic for the write-a-review form. */
export function useReviewForm() {
  const { t } = useI18n()
  const reviews = useReviewsStore()

  const form = reactive({
    rating: 0,
    name: '',
    car: '',
    service: '' as ServiceId | '',
    aspects: { quality: 0, price: 0, time: 0 } as Record<AspectKey, number>,
    body: '',
    recommend: true,
  })
  const submitting = ref(false)
  const message = ref<FormMessage>(null)
  const editing = computed(() => !!reviews.mine)

  /** Fill the form from the visitor's existing review (once, when it first appears). */
  function fill(review: Review | null) {
    if (!review) return
    form.rating = review.rating
    form.name = review.name
    form.car = review.car
    form.service = review.service
    form.aspects = { quality: 0, price: 0, time: 0, ...review.aspects }
    form.body = review.body
    form.recommend = review.recommend
  }
  let filledFor: string | null = null
  watch(
    () => reviews.mine,
    (mine) => {
      if (mine && filledFor !== mine.id) {
        filledFor = mine.id
        fill(mine)
      }
      if (!mine) filledFor = null
    },
    { immediate: true },
  )

  function reset() {
    Object.assign(form, {
      rating: 0,
      name: '',
      car: '',
      service: '',
      aspects: { quality: 0, price: 0, time: 0 },
      body: '',
      recommend: true,
    })
    message.value = null
  }

  const steps = computed(() => ({
    rating: form.rating > 0,
    visit: !!form.name.trim() && !!form.service,
    body: form.body.trim().length >= REVIEW_LIMITS.bodyMin,
  }))
  const stepsDone = computed(() => Object.values(steps.value).filter(Boolean).length)

  const preview = computed<ReviewCardData>(() => ({
    name: form.name.trim() || t('write.name'),
    car: form.car.trim(),
    service: form.service,
    rating: form.rating,
    body: form.body.trim() || t('write.previewBody'),
    aspects: { ...form.aspects },
    recommend: form.recommend,
  }))
  const previewIsPlaceholder = computed(() => !form.body.trim())

  /** Returns the id of the field to focus when validation fails. */
  async function submit(): Promise<string | null> {
    message.value = null
    const name = form.name.trim()
    const body = form.body.trim()
    const fail = (key: string, focus: string) => {
      message.value = { kind: 'error', text: t(`write.errors.${key}`) }
      return focus
    }
    if (!form.rating) return fail('rating', 'star-input')
    if (!name) return fail('name', 'f-name')
    if (!form.service) return fail('service', 'svc-input')
    if (body.length < REVIEW_LIMITS.bodyMin) return fail('body', 'f-body')

    const input: ReviewInput = {
      rating: form.rating,
      name,
      car: form.car.trim(),
      service: form.service,
      body,
      aspects: Object.fromEntries(Object.entries(form.aspects).filter(([, v]) => v >= 1)),
      recommend: form.recommend,
    }

    const wasEditing = editing.value
    submitting.value = true
    message.value = { kind: 'info', text: t('write.posting') }
    try {
      await reviews.saveMine(input)
      message.value = { kind: 'success', text: t(wasEditing ? 'write.updated' : 'write.posted') }
    } catch {
      message.value = { kind: 'error', text: t('write.errors.generic') }
    } finally {
      submitting.value = false
    }
    return null
  }

  // A deleted review empties the form again.
  watch(editing, (now, before) => {
    if (before && !now) reset()
  })

  return {
    form,
    steps,
    stepsDone,
    preview,
    previewIsPlaceholder,
    editing,
    submitting,
    message,
    submit,
  }
}
