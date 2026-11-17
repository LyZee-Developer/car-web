<script setup lang="ts">
/**
 * Rolling-digit counter. Shows "–" until a value arrives, then rolls each digit into place.
 * `active` delays the roll until the counter scrolls into view.
 */
const props = withDefaults(defineProps<{ value: number | null; active?: boolean }>(), {
  active: true,
})

const { n } = useI18n()
const text = computed(() => (props.value === null ? '' : n(props.value, 'integer')))
const chars = computed(() => [...text.value].map((c) => ({ c, digit: /\d/.test(c) })))
const shape = computed(() => text.value.replace(/\d/g, '0'))

// New digit columns are first painted at 0, then rolled to their value on the next frames,
// so the roll also plays when the number first appears or gains a digit.
const settled = ref(false)
function settle() {
  settled.value = false
  if (!import.meta.client) return
  requestAnimationFrame(() => requestAnimationFrame(() => (settled.value = true)))
}
onMounted(settle)
watch(shape, settle)

const rolling = computed(() => props.active && settled.value)
const offset = (c: string) => (rolling.value ? Number(c) : 0)

const flashing = ref(false)
watch(
  () => props.value,
  (next, prev) => {
    if (props.active && next && prev && next !== prev) {
      flashing.value = false
      requestAnimationFrame(() => (flashing.value = true))
    }
  },
)
</script>

<template>
  <span class="odo" :class="{ 'is-flashing': flashing }" @animationend="flashing = false">
    <template v-if="value === null">–</template>
    <template v-else>
      <span class="sr-only">{{ text }}</span>
      <span class="inline-flex" aria-hidden="true">
        <template v-for="(ch, i) in chars" :key="i">
          <span v-if="ch.digit" class="odo__digit">
            <span
              class="odo__col"
              :style="{
                transform: `translateY(-${offset(ch.c)}em)`,
                transitionDelay: `${i * 90}ms`,
              }"
            >
              <span v-for="d in 10" :key="d">{{ d - 1 }}</span>
            </span>
          </span>
          <span v-else class="mx-[.02em] opacity-45">{{ ch.c }}</span>
        </template>
      </span>
    </template>
  </span>
</template>

<style scoped>
.odo {
  display: inline-flex;
  height: 1em;
  font-stretch: 125%;
  font-weight: 500;
  font-size: clamp(30px, 4.2vw, 50px);
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.odo__digit {
  display: inline-block;
  height: 1em;
  overflow: hidden;
}

.odo__col {
  display: flex;
  flex-direction: column;
  transition: transform 1.8s cubic-bezier(0.16, 0.84, 0.24, 1);
}

.odo__col > span {
  display: block;
  height: 1em;
  line-height: 1em;
}

.is-flashing {
  animation: odo-flash 0.9s ease;
}

@keyframes odo-flash {
  30% {
    text-shadow: 0 0 18px rgb(var(--color-night-accent) / 0.7);
  }
}

@media (prefers-reduced-motion: reduce) {
  .odo__col {
    transition: none;
  }
  .is-flashing {
    animation: none;
  }
}
</style>
