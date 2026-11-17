<script setup lang="ts">
const { t } = useI18n()
const { contact, links, alwaysOpen } = useContact()
const { developer, developerUrl } = useAppConfig()
const year = new Date().getFullYear()

const hoursSummary = computed(() => {
  if (alwaysOpen.value) return t('contact.hours.everyDay')
  const days = contact.hours.filter((h) => !h.closed)
  const first = days[0]
  if (days.length === 6 && contact.hours[0]?.closed && first?.open && first.close) {
    return t('contact.hours.monSat', { hours: `${first.open}–${first.close}` })
  }
  return t('contact.hours.seeHours')
})

const linkClass = 'my-1.5 block text-night-text no-underline hover:underline'
</script>

<template>
  <footer class="mt-24 bg-night pb-7 pt-16 text-sm text-night-muted">
    <div class="page-wrap">
      <div
        class="grid grid-cols-2 gap-8 border-b border-night-line pb-10 md:grid-cols-[2fr_1fr_1fr_1fr]"
      >
        <div class="col-span-2 md:col-span-1">
          <div class="mb-2.5">
            <BrandLogo />
          </div>
          {{ t('footer.tagline') }}
        </div>
        <div>
          <h4 class="mb-3 text-[13px] font-medium">{{ t('footer.website') }}</h4>
          <NuxtLinkLocale :to="{ path: '/', hash: '#services' }" :class="linkClass">
            {{ t('nav.services') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale :to="{ path: '/', hash: '#rating' }" :class="linkClass">
            {{ t('nav.rating') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale :to="{ path: '/', hash: '#reviews' }" :class="linkClass">
            {{ t('nav.reviews') }}
          </NuxtLinkLocale>
        </div>
        <div>
          <h4 class="mb-3 text-[13px] font-medium">{{ t('footer.contact') }}</h4>
          <a v-if="contact.phone" :href="links.phone" :class="linkClass">{{ contact.phone }}</a>
          <a v-if="contact.email" :href="links.email" :class="linkClass">{{ contact.email }}</a>
          <span class="mt-1.5 block">{{ hoursSummary }}</span>
          <span v-if="contact.address" class="block">{{ contact.address }}</span>
          <NuxtLinkLocale :to="{ path: '/', hash: '#contact' }" :class="linkClass">
            {{ t('contact.allDetails') }}
          </NuxtLinkLocale>
        </div>
        <div>
          <h4 class="mb-3 text-[13px] font-medium">{{ t('footer.customers') }}</h4>
          <NuxtLinkLocale :to="{ path: '/', hash: '#write' }" :class="linkClass">
            {{ t('common.buttons.writeReview') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale :to="{ path: '/', hash: '#services' }" :class="linkClass">
            {{ t('footer.findProblem') }}
          </NuxtLinkLocale>
        </div>
      </div>
      <div class="flex flex-wrap justify-between gap-4 pt-5">
        <span>{{ t('footer.copyright', { year }) }}</span>
        <span>{{ t('footer.note') }}</span>
      </div>
      <!-- {name} is filled by the slot so the developer's name can be styled. -->
      <i18n-t
        keypath="footer.developedBy"
        tag="p"
        scope="global"
        class="m-0 pt-4 text-center text-[13px] text-night-muted"
      >
        <template #name>
          <a
            :href="developerUrl"
            target="_blank"
            rel="noopener"
            lang="en"
            :aria-label="t('footer.developerLink', { name: developer })"
            :title="t('footer.developerLink', { name: developer })"
            class="inline-flex items-center gap-1 font-medium text-night-text no-underline underline-offset-[3px] [font-stretch:112%] hover:text-night-accent hover:underline"
          >
            <UiIcon name="telegram" class="size-3.5" />
            {{ developer }}
          </a>
        </template>
      </i18n-t>
    </div>
  </footer>
</template>
