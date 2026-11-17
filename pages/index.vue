<script setup lang="ts">
const { t } = useI18n()
const reviews = useReviewsStore()

// Reviews are rendered on the server, then refreshed every 30 s so scores stay live.
await useAsyncData('reviews', () => reviews.load().then(() => true))

const pageVisible = useDocumentVisibility()
useIntervalFn(() => {
  if (pageVisible.value === 'visible') reviews.load()
}, 30_000)
</script>

<template>
  <main id="top">
    <section
      class="hero relative overflow-hidden bg-night pb-9 pt-11 text-night-text sm:pt-[72px]"
      :aria-roledescription="t('hero.roledescription')"
      :aria-label="t('hero.label')"
    >
      <!-- Interactive glowing dots behind the hero content. -->
      <DotGrid class="hero-dots" />
      <div class="page-wrap relative z-[1]">
        <HomeHeroSlider />
        <HomeVisitorStats />
      </div>
    </section>

    <HomeServicesSection />
    <HomeRatingSection />
    <HomeReviewsSection />
    <HomeCtaBand />
    <HomeWriteReviewSection />
    <HomeContactSection />
  </main>
</template>

<style scoped>
/* Soft glow at the top of the hero. */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    60% 50% at 50% 0%,
    rgb(var(--color-night-text) / 0.1),
    transparent 70%
  );
}

/* Dots fade out towards the visitor stats at the bottom. */
.hero-dots {
  mask-image: linear-gradient(black 55%, transparent 95%);
}
</style>
