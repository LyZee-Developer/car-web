<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const title = computed(() =>
  props.error.statusCode === 404 ? t('error.notFound') : t('error.generic'),
)
useHead({ title })
</script>

<template>
  <NuxtLayout>
    <main class="page-wrap flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <p class="m-0 text-sm text-muted">{{ error.statusCode }}</p>
      <h1 class="text-[clamp(32px,4.4vw,52px)]">{{ title }}</h1>
      <UiButton @click="clearError({ redirect: '/' })">{{ t('error.home') }}</UiButton>
    </main>
  </NuxtLayout>
</template>
