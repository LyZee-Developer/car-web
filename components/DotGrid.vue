<script setup lang="ts">
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

/**
 * Glowing interactive dot grid (decorative background).
 * - Dots near the pointer glow and grow.
 * - Moving the pointer fast flicks nearby dots away with GSAP Inertia; they spring back elastically.
 * - Clicking sends a shockwave through the grid.
 * Drawn on a canvas; colours come from the theme tokens. Respects reduced motion.
 *
 * `fixed` covers the whole viewport (site background); otherwise it fills its positioned parent.
 * `tone="theme"` follows light/dark mode; `tone="night"` is for the always-dark panels.
 */
const props = withDefaults(
  defineProps<{
    fixed?: boolean
    tone?: 'night' | 'theme'
    dotSize?: number
    gap?: number
    /** Radius (px) around the pointer where dots glow and react. */
    proximity?: number
    /** Pointer speed (px/s) above which dots get pushed. */
    speedTrigger?: number
    shockRadius?: number
    shockStrength?: number
    /** Inertia resistance: higher stops the dots sooner. */
    resistance?: number
    returnDuration?: number
  }>(),
  {
    fixed: false,
    tone: 'night',
    dotSize: 3,
    gap: 26,
    proximity: 150,
    speedTrigger: 120,
    shockRadius: 240,
    shockStrength: 4,
    resistance: 750,
    returnDuration: 1.5,
  },
)

interface Dot {
  cx: number
  cy: number
  xOffset: number
  yOffset: number
  pushed: boolean
}

type RGB = [number, number, number]

const wrapper = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const reducedMotion = usePreferredReducedMotion()
const colorMode = useColorMode()

let dots: Dot[] = []
let ctx: CanvasRenderingContext2D | null = null
let frame = 0
let running = false
let width = 0
let height = 0
/** Redraw only while something moves: until this time (ms) after the last pointer activity. */
let activeUntil = 0
const ACTIVE_MS = props.returnDuration * 1000 + 1500

// Pointer in canvas coordinates; far away when outside.
const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 }

let base: RGB = [242, 242, 242]
let active: RGB = [217, 199, 163]
let baseAlpha = 0.16

/** "217 199 163" token → [217, 199, 163] */
function readToken(name: string, fallback: RGB): RGB {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const parts = raw.split(/\s+/).map(Number)
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n)) ? (parts as RGB) : fallback
}

function readColors() {
  if (props.tone === 'theme') {
    base = readToken('--color-text', base)
    active = readToken('--color-primary', active)
    // Fainter on light pages so dots never compete with text; light dots on black need a bit more.
    baseAlpha = colorMode.value === 'dark' ? 0.16 : 0.12
  } else {
    base = readToken('--color-night-text', base)
    active = readToken('--color-night-accent', active)
    baseAlpha = 0.16
  }
}

function buildGrid() {
  const el = wrapper.value
  const cv = canvas.value
  if (!el || !cv) return
  const rect = el.getBoundingClientRect()
  width = rect.width
  height = rect.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = Math.round(width * dpr)
  cv.height = Math.round(height * dpr)
  cv.style.width = `${width}px`
  cv.style.height = `${height}px`
  ctx = cv.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

  const cell = props.dotSize + props.gap
  const cols = Math.floor((width + props.gap) / cell)
  const rows = Math.floor((height + props.gap) / cell)
  // Centre the grid in the available space.
  const startX = (width - (cols * cell - props.gap)) / 2 + props.dotSize / 2
  const startY = (height - (rows * cell - props.gap)) / 2 + props.dotSize / 2

  dots.forEach((d) => gsap.killTweensOf(d))
  dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        cx: startX + c * cell,
        cy: startY + r * cell,
        xOffset: 0,
        yOffset: 0,
        pushed: false,
      })
    }
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const prox = props.proximity
  const proxSq = prox * prox
  const radius = props.dotSize / 2
  const idleFill = `rgba(${base[0]},${base[1]},${base[2]},${baseAlpha})`

  for (const d of dots) {
    const x = d.cx + d.xOffset
    const y = d.cy + d.yOffset
    const dx = d.cx - pointer.x
    const dy = d.cy - pointer.y
    const distSq = dx * dx + dy * dy

    if (distSq < proxSq) {
      const t = 1 - Math.sqrt(distSq) / prox // 0 at the edge → 1 under the pointer
      const r = Math.round(base[0] + (active[0] - base[0]) * t)
      const g = Math.round(base[1] + (active[1] - base[1]) * t)
      const b = Math.round(base[2] + (active[2] - base[2]) * t)
      // Soft glow halo.
      const glow = radius * (3 + 5 * t)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow)
      gradient.addColorStop(0, `rgba(${active[0]},${active[1]},${active[2]},${0.45 * t})`)
      gradient.addColorStop(1, `rgba(${active[0]},${active[1]},${active[2]},0)`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, glow, 0, Math.PI * 2)
      ctx.fill()
      // The dot itself, brighter and larger near the pointer.
      ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha + (1 - baseAlpha) * t})`
      ctx.beginPath()
      ctx.arc(x, y, radius * (1 + 0.6 * t), 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = idleFill
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function loop() {
  if (!running) return
  // Skip drawing while nothing moves (a full-page grid would otherwise redraw every frame).
  if (performance.now() < activeUntil) draw()
  frame = requestAnimationFrame(loop)
}

function wake() {
  activeUntil = performance.now() + ACTIVE_MS
}

function start() {
  if (running) return
  running = true
  frame = requestAnimationFrame(loop)
}

function stop() {
  running = false
  cancelAnimationFrame(frame)
}

const canAnimate = () => reducedMotion.value !== 'reduce'

/** Flick a dot away with inertia, then spring it back to its place. */
function push(d: Dot, x: number, y: number) {
  d.pushed = true
  gsap.killTweensOf(d)
  gsap.to(d, {
    inertia: { xOffset: x, yOffset: y, resistance: props.resistance },
    onComplete: () => {
      wake()
      gsap.to(d, {
        xOffset: 0,
        yOffset: 0,
        duration: props.returnDuration,
        ease: 'elastic.out(1,0.75)',
      })
      d.pushed = false
    },
  })
}

function onPointerMove(event: PointerEvent) {
  const cv = canvas.value
  if (!cv) return
  const rect = cv.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height

  const now = performance.now()
  const dt = pointer.lastTime ? now - pointer.lastTime : 16
  pointer.vx = ((event.clientX - pointer.lastX) / Math.max(dt, 1)) * 1000
  pointer.vy = ((event.clientY - pointer.lastY) / Math.max(dt, 1)) * 1000
  pointer.lastX = event.clientX
  pointer.lastY = event.clientY
  pointer.lastTime = now

  if (!inside) {
    // Redraw once more so the glow fades away from the edge.
    if (pointer.x !== -9999) wake()
    pointer.x = -9999
    pointer.y = -9999
    return
  }
  wake()
  pointer.x = x
  pointer.y = y

  const speed = Math.hypot(pointer.vx, pointer.vy)
  if (!canAnimate() || speed < props.speedTrigger) return
  // Cap the velocity so a very fast flick does not throw dots off-screen.
  const scale = Math.min(1, 5000 / speed)
  const vx = pointer.vx * scale
  const vy = pointer.vy * scale
  const proxSq = props.proximity * props.proximity
  for (const d of dots) {
    if (d.pushed) continue
    const dx = d.cx - x
    const dy = d.cy - y
    if (dx * dx + dy * dy < proxSq) push(d, dx + vx * 0.005, dy + vy * 0.005)
  }
}

function onPointerDown(event: PointerEvent) {
  const cv = canvas.value
  if (!cv || !canAnimate()) return
  const rect = cv.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
  wake()
  for (const d of dots) {
    const dist = Math.hypot(d.cx - x, d.cy - y)
    if (dist < props.shockRadius && !d.pushed) {
      const falloff = Math.max(0, 1 - dist / props.shockRadius)
      push(
        d,
        (d.cx - x) * props.shockStrength * falloff,
        (d.cy - y) * props.shockStrength * falloff,
      )
    }
  }
}

function onPointerLeave() {
  pointer.x = -9999
  pointer.y = -9999
  wake()
}

function redraw() {
  buildGrid()
  draw()
}

// Theme switch: pick up the new token colours (after color-mode updates the <html> class).
watch(
  () => colorMode.value,
  () => {
    if (props.tone !== 'theme' || !import.meta.client) return
    nextTick(() => {
      readColors()
      draw()
    })
  },
)

let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null

onMounted(() => {
  gsap.registerPlugin(InertiaPlugin)
  readColors()
  redraw()

  resizeObserver = new ResizeObserver(redraw)
  if (wrapper.value) resizeObserver.observe(wrapper.value)

  // Only animate while the grid is on screen.
  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) start()
    else stop()
  })
  if (wrapper.value) visibilityObserver.observe(wrapper.value)

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerDown)
  document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  dots.forEach((d) => gsap.killTweensOf(d))
})
</script>

<template>
  <div
    ref="wrapper"
    class="pointer-events-none inset-0"
    :class="fixed ? 'fixed' : 'absolute'"
    aria-hidden="true"
  >
    <canvas ref="canvas" class="block" />
  </div>
</template>
