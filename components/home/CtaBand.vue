<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="pb-24">
    <div class="page-wrap">
      <div
        class="band relative grid min-h-[380px] items-center overflow-hidden rounded-3xl text-night-text md:grid-cols-[1fr_1.2fr]"
      >
        <div class="relative z-[1] px-[26px] pt-9 md:px-12 md:py-14">
          <h2 class="text-[clamp(32px,4.2vw,50px)]">{{ t('band.title') }}</h2>
          <p class="mb-[26px] mt-[18px] max-w-[36ch] text-night-muted">{{ t('band.text') }}</p>
          <UiArrowLink :to="{ path: '/', hash: '#write' }">{{ t('band.cta') }}</UiArrowLink>
        </div>
        <div class="-mr-[20%] ml-[10%] self-end md:-mr-[14%] md:ml-0">
          <HomeCarArt paint="graphite" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band {
  background:
    radial-gradient(
      70% 90% at 80% 60%,
      rgb(var(--color-night-raised) / 0.9),
      rgb(var(--color-night-2) / 0.6) 70%
    ),
    rgb(var(--color-night-2));
}
</style>
