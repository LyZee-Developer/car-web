<script setup lang="ts">
/** Speedometer-style gauge for the 1–5 average rating. */
const props = defineProps<{ average: number; count: number }>()

const { t } = useI18n()
const formatDecimal = useFormatDecimal()
const uid = useId()
const id = (name: string) => `${name}-${uid}`

const R = 118
const CX = 150
const CY = 150

const point = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)]
}
const arc = (a0: number, a1: number) => {
  const [x0, y0] = point(a0, R)
  const [x1, y1] = point(a1, R)
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}
/** Rating 1–5 → angle -120°…120°. */
const angle = (v: number) => -120 + ((v - 1) / 4) * 240

const track = arc(-120, 120)

const ticks = (() => {
  const out: {
    x1: number
    y1: number
    x2: number
    y2: number
    major: boolean
    label?: { x: number; y: number; n: number }
  }[] = []
  for (let v = 1; v <= 5.001; v += 0.25) {
    const a = angle(v)
    const major = Math.abs(v - Math.round(v)) < 0.01
    const [x1, y1] = point(a, R - 14)
    const [x2, y2] = point(a, R - (major ? 28 : 21))
    const tick: (typeof out)[number] = { x1, y1, x2, y2, major }
    if (major) {
      const [lx, ly] = point(a, R - 42)
      tick.label = { x: lx, y: ly + 5, n: Math.round(v) }
    }
    out.push(tick)
  }
  return out
})()

const needleAngle = computed(() => (props.count ? angle(props.average) : -120))
const fill = computed(() =>
  props.count && needleAngle.value > -119.5 ? arc(-120, needleAngle.value) : '',
)
</script>

<template>
  <svg
    class="gauge block w-full max-w-[440px]"
    viewBox="0 0 300 236"
    role="img"
    :aria-labelledby="id('title')"
  >
    <title :id="id('title')">
      {{
        count ? t('rating.averageLabel', { avg: formatDecimal(average) }) : t('rating.gaugeTitle')
      }}
    </title>
    <defs>
      <linearGradient :id="id('fill')" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" style="stop-color: rgb(var(--color-night-accent-deep))" />
        <stop offset=".7" style="stop-color: rgb(var(--color-night-accent))" />
        <stop offset="1" style="stop-color: rgb(var(--art-white))" />
      </linearGradient>
      <filter :id="id('glow')" filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="236">
        <feGaussianBlur stdDeviation="3.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      :d="track"
      fill="none"
      stroke-width="10"
      stroke-linecap="round"
      class="stroke-night-text/10"
    />
    <path
      v-if="fill"
      :d="fill"
      fill="none"
      :stroke="`url(#${id('fill')})`"
      stroke-width="10"
      stroke-linecap="round"
      :filter="`url(#${id('glow')})`"
    />
    <g>
      <template v-for="(tick, i) in ticks" :key="i">
        <line
          :x1="tick.x1"
          :y1="tick.y1"
          :x2="tick.x2"
          :y2="tick.y2"
          :stroke-width="tick.major ? 2.5 : 1.5"
          :class="tick.major ? 'tick-major' : 'tick'"
        />
        <text
          v-if="tick.label"
          :x="tick.label.x"
          :y="tick.label.y"
          text-anchor="middle"
          class="fill-night-muted text-[13px] font-medium"
        >
          {{ tick.label.n }}
        </text>
      </template>
    </g>
    <g
      class="needle"
      :style="{ transform: `rotate(${needleAngle}deg)` }"
      :filter="`url(#${id('glow')})`"
    >
      <line
        x1="150"
        y1="164"
        x2="150"
        y2="58"
        stroke-width="3"
        stroke-linecap="round"
        class="stroke-night-accent"
      />
    </g>
    <circle cx="150" cy="150" r="13" stroke-width="1" fill="none" class="stroke-night-accent/40" />
    <circle cx="150" cy="150" r="6" class="fill-night-text" />
    <text x="150" y="214" text-anchor="middle" class="avg fill-night-strong">
      {{ count ? formatDecimal(average) : '–' }}
    </text>
  </svg>
</template>

<style scoped>
.tick {
  stroke: rgb(var(--color-night-tick));
}

.tick-major {
  stroke: rgb(var(--color-night-tick-major));
}

.needle {
  transform-box: view-box;
  transform-origin: 150px 150px;
  transition: transform 1.6s cubic-bezier(0.2, 0.9, 0.25, 1.12);
}

.avg {
  font-size: 58px;
  font-weight: 500;
  font-stretch: 125%;
  letter-spacing: -0.035em;
}

@media (prefers-reduced-motion: reduce) {
  .needle {
    transition: none;
  }
}
</style>
