<script setup lang="ts">
import type { VisitStats } from '~/types/review'

const { t } = useI18n()

const stats = ref<VisitStats | null>(null)
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const pageVisible = useDocumentVisibility()

// Digits roll in once the counter scrolls into view.
const { stop } = useIntersectionObserver(
  root,
  ([entry]) => {
    if (entry?.isIntersecting) {
      visible.value = true
      stop()
    }
  },
  { threshold: 0.3 },
)

async function ping(view: boolean) {
  try {
    stats.value = await $fetch<VisitStats>('/api/visits', { method: 'POST', body: { view } })
  } catch {
    // The counter is decorative; keep the last numbers if the request fails.
  }
}

onMounted(() => {
  // Count one view per browser session; later loads only refresh "last seen".
  let counted = false
  try {
    counted = sessionStorage.getItem('visit-counted') === '1'
    sessionStorage.setItem('visit-counted', '1')
  } catch {
    // Storage blocked (private mode): count the view.
  }
  ping(!counted)
})

// Heartbeat keeps "online now" accurate while the tab is visible.
useIntervalFn(() => {
  if (pageVisible.value === 'visible') ping(false)
}, 60_000)

const items = computed(() => [
  { key: 'views', label: t('stats.views'), value: stats.value?.views ?? null, live: false },
  { key: 'unique', label: t('stats.unique'), value: stats.value?.unique ?? null, live: false },
  { key: 'today', label: t('stats.today'), value: stats.value?.today ?? null, live: false },
  { key: 'online', label: t('stats.online'), value: stats.value?.online ?? null, live: true },
])
</script>

<template>
  <div
    ref="root"
    role="group"
    :aria-label="t('stats.label')"
    class="mt-8 grid grid-cols-2 border-t border-night-line md:grid-cols-4"
  >
    <div
      v-for="(item, i) in items"
      :key="item.key"
      class="flex min-w-0 flex-col gap-3.5 px-4 pb-3.5 pt-[18px] md:px-[22px] md:pb-[18px] md:pt-[26px]"
      :class="[
        i % 2 === 0 ? 'pl-0' : 'border-l border-night-line',
        i >= 2 && 'border-t border-night-line md:border-t-0',
        i === 2 && 'md:border-l md:pl-[22px]',
      ]"
    >
      <HomeOdometerNumber
        :value="item.value"
        :active="visible"
        :class="item.live ? 'text-night-success' : 'text-night-text'"
      />
      <span class="flex items-center gap-2 text-sm leading-normal text-night-muted">
        <i v-if="item.live" class="live-dot" aria-hidden="true" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.live-dot {
  position: relative;
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
  background: rgb(var(--color-night-success));
}

.live-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgb(var(--color-night-success));
  animation: live-ping 1.6s ease-out infinite;
}

@keyframes live-ping {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(3.2);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot::after {
    animation: none;
  }
}
</style>
