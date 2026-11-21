<template>
  <svg viewBox="0 40 800 300" aria-hidden="true" focusable="false" class="block h-auto w-full">
    <defs>
      <linearGradient :id="id('body')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :style="{ stopColor: paints[0] }" />
        <stop offset=".5" :style="{ stopColor: paints[1] }" />
        <stop offset="1" :style="{ stopColor: paints[2] }" />
      </linearGradient>
      <linearGradient :id="id('shade')" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" :style="{ stopColor: art('black', 0.45) }" />
        <stop offset=".35" :style="{ stopColor: art('black', 0) }" />
        <stop offset=".7" :style="{ stopColor: art('white', 0.12) }" />
        <stop offset="1" :style="{ stopColor: art('black', 0.3) }" />
      </linearGradient>
      <linearGradient :id="id('fade')" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :style="{ stopColor: art('white', 0.32) }" />
        <stop offset=".55" :style="{ stopColor: art('white', 0) }" />
      </linearGradient>
      <mask :id="id('mask')">
        <rect x="0" y="240" width="800" height="110" :fill="`url(#${id('fade')})`" />
      </mask>
      <radialGradient :id="id('glow')">
        <stop offset="0" :style="{ stopColor: art('white', 0.16) }" />
        <stop offset="1" :style="{ stopColor: art('white', 0) }" />
      </radialGradient>
    </defs>

    <ellipse cx="404" cy="240" rx="390" ry="46" :fill="`url(#${id('glow')})`" />
    <g :id="id('car')">
      <ellipse cx="404" cy="240" rx="330" ry="7" :style="{ fill: art('black', 0.8) }" />
      <path :d="BODY" :fill="`url(#${id('body')})`" />
      <path :d="BODY" :fill="`url(#${id('shade')})`" />
      <path
        d="M296 136 C326 112 356 100 398 98 L452 98 L452 136 Z"
        :style="{ fill: art('glass') }"
      />
      <path
        d="M462 98 L488 98 C522 100 550 114 574 136 L462 136 Z"
        :style="{ fill: art('glass') }"
      />
      <path
        d="M316 128 C340 112 362 104 392 102"
        :style="{ stroke: art('white', 0.22) }"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />
      <path
        d="M118 166 C300 146 520 146 712 160"
        :style="{ stroke: art('white', 0.45) }"
        stroke-width="1.4"
        fill="none"
      />
      <path d="M457 138 L460 204" :style="{ stroke: art('black', 0.35) }" stroke-width="1.5" />
      <path d="M708 160 L734 168 L730 175 L704 168 Z" :style="{ fill: art('white', 0.9) }" />
      <rect x="72" y="168" width="16" height="5" rx="2" :style="{ fill: art('taillight') }" />
      <g v-for="wheel in wheels" :key="wheel.cx">
        <circle :cx="wheel.cx" :cy="WHEEL_Y" r="49" :style="{ fill: art('black') }" />
        <circle :cx="wheel.cx" :cy="WHEEL_Y" r="44" :style="{ fill: art('tire') }" />
        <circle
          :cx="wheel.cx"
          :cy="WHEEL_Y"
          r="31"
          :style="{ fill: art('rim'), stroke: art('rim-edge') }"
          stroke-width="1.6"
        />
        <line
          v-for="(s, k) in wheel.spokes"
          :key="k"
          v-bind="s"
          :style="{ stroke: art('spoke') }"
          stroke-width="2.4"
        />
        <circle :cx="wheel.cx" :cy="WHEEL_Y" r="7" :style="{ fill: art('hub') }" />
      </g>
    </g>
    <g :mask="`url(#${id('mask')})`">
      <use :href="`#${id('car')}`" transform="translate(0,480) scale(1,-1)" />
    </g>
    <line x1="10" y1="240" x2="790" y2="240" :style="{ stroke: art('white', 0.07) }" />
    <circle
      v-for="([x, y], k) in GLINTS"
      :key="k"
      :cx="x"
      :cy="y"
      :r="k % 3 ? 1 : 1.6"
      :style="{ fill: art('white'), opacity: k % 2 ? 0.35 : 0.6 }"
    />
  </svg>
</template>

<script setup lang="ts">
import type { CarPaint } from '~/utils/catalog'

/** Side-view sports car with floor reflection, ported from the design's inline SVG. Decorative. */
const props = defineProps<{ paint: CarPaint }>()

const uid = useId()
const id = (name: string) => `${name}-${uid}`
const art = (name: string, alpha?: number) =>
  alpha === undefined ? `rgb(var(--art-${name}))` : `rgb(var(--art-${name}) / ${alpha})`

const paints = computed(() => [1, 2, 3].map((n) => art(`${props.paint}-${n}`)))

const WHEEL_Y = 196
const spokes = (cx: number) =>
  Array.from({ length: 10 }, (_, k) => {
    const a = (k * 36 * Math.PI) / 180
    return {
      x1: (cx + 8 * Math.cos(a)).toFixed(1),
      y1: (WHEEL_Y + 8 * Math.sin(a)).toFixed(1),
      x2: (cx + 29 * Math.cos(a)).toFixed(1),
      y2: (WHEEL_Y + 29 * Math.sin(a)).toFixed(1),
    }
  })
const wheels = [210, 606].map((cx) => ({ cx, spokes: spokes(cx) }))

const GLINTS: [number, number][] = [
  [120, 262],
  [188, 276],
  [260, 255],
  [331, 290],
  [402, 262],
  [455, 281],
  [520, 258],
  [588, 284],
  [650, 266],
  [716, 278],
  [90, 300],
  [700, 304],
  [300, 310],
  [560, 312],
]

const BODY =
  'M70 206 C70 182 80 166 104 160 L214 146 C256 118 304 94 362 88 L470 86 C522 86 562 106 602 132 L688 146 C722 152 738 168 740 190 L740 214 L70 214 Z'
</script>
