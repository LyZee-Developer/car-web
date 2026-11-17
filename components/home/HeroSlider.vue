<script setup lang="ts">
const { t } = useI18n()
const reducedMotion = usePreferredReducedMotion()

const INTERVAL_MS = 6500
const current = ref(0)
const paused = ref(false)
const hovering = ref(false)
const pageVisible = useDocumentVisibility()
const total = SLIDES.length

const slides = computed(() =>
  SLIDES.map((s) => ({
    ...s,
    title: t(`hero.slides.${s.key}.title`),
    text: t(`hero.slides.${s.key}.text`),
    cta: t(`hero.slides.${s.key}.cta`),
  })),
)

function go(index: number) {
  current.value = (index + total) % total
}

const { pause: stopTimer, resume: startTimer } = useIntervalFn(
  () => {
    if (!hovering.value && pageVisible.value === 'visible') go(current.value + 1)
  },
  INTERVAL_MS,
  { immediate: false },
)

/** Restart the countdown after a manual change so the next slide gets its full time. */
function restart() {
  stopTimer()
  if (!paused.value) startTimer()
}

function setPaused(value: boolean) {
  paused.value = value
  restart()
}

function select(index: number) {
  go(index)
  restart()
}

function step(delta: number) {
  go(current.value + delta)
  restart()
}

onMounted(() => {
  // Respect reduced motion: start paused, the user can still press play.
  setPaused(reducedMotion.value === 'reduce')
})

// Swipe left/right on touch screens.
let startX: number | null = null
function onPointerDown(event: PointerEvent) {
  startX = event.clientX
}
function onPointerUp(event: PointerEvent) {
  if (startX === null) return
  const dx = event.clientX - startX
  startX = null
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
}

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div
    class="relative touch-pan-y"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="hovering = true"
    @focusout="hovering = false"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    <div class="grid" aria-live="off">
      <div
        v-for="(slide, i) in slides"
        :key="slide.key"
        role="group"
        :aria-roledescription="t('hero.slideRoledescription')"
        :aria-label="t('hero.slideOf', { current: i + 1, total })"
        :aria-hidden="i !== current"
        :inert="i !== current"
        class="text-center transition-opacity duration-[900ms] ease-in-out [grid-area:1/1] motion-reduce:transition-none"
        :class="i === current ? 'opacity-100' : 'opacity-0'"
      >
        <h2 class="hero-title mx-auto max-w-[18ch] text-balance">{{ slide.title }}</h2>
        <p class="mx-auto mb-[22px] mt-5 max-w-[46ch] text-[17px] text-night-muted">
          {{ slide.text }}
        </p>
        <UiArrowLink :to="{ path: '/', hash: slide.hash }">{{ slide.cta }}</UiArrowLink>
        <div class="mx-auto mt-1 max-w-[980px]">
          <HomeCarArt :paint="slide.paint" />
        </div>
      </div>
    </div>

    <div class="mt-1 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <button
          v-for="(slide, i) in slides"
          :key="slide.key"
          type="button"
          class="h-[18px] w-6 bg-[length:100%_2px] bg-center bg-no-repeat sm:w-9"
          :class="
            i === current
              ? 'bg-[linear-gradient(rgb(var(--color-night-text)),rgb(var(--color-night-text)))]'
              : 'bg-[linear-gradient(rgb(var(--color-night-line)),rgb(var(--color-night-line)))]'
          "
          :aria-current="i === current"
          :aria-label="t('hero.showSlide', { n: i + 1, title: slide.title })"
          @click="select(i)"
        />
        <span
          class="ml-2.5 hidden whitespace-nowrap text-[13px] tabular-nums text-night-muted sm:inline"
          aria-hidden="true"
        >
          {{ pad(current + 1) }} / {{ pad(total) }}
        </span>
      </div>
      <div class="flex gap-2">
        <button type="button" class="hero-arrow" :aria-label="t('hero.prev')" @click="step(-1)">
          <UiIcon name="chevron-left" class="size-4" :stroke-width="2" />
        </button>
        <button
          type="button"
          class="hero-arrow"
          :aria-label="paused ? t('hero.play') : t('hero.pause')"
          @click="setPaused(!paused)"
        >
          <UiIcon :name="paused ? 'play' : 'pause'" class="size-4" />
        </button>
        <button type="button" class="hero-arrow" :aria-label="t('hero.next')" @click="step(1)">
          <UiIcon name="chevron-right" class="size-4" :stroke-width="2" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-title {
  font-size: clamp(34px, 6vw, 76px);
}

/* English headings are tighter and can be larger, as in the design. */
:lang(en) .hero-title {
  font-size: clamp(38px, 7vw, 92px);
  max-width: 16ch;
}

.hero-arrow {
  @apply grid size-[42px] place-items-center rounded-full border border-night-line bg-transparent text-night-text transition-colors hover:border-night-text;
}
</style>
