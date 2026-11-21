<template>
  <section id="contact" class="pt-24" aria-labelledby="contact-title">
    <div class="page-wrap">
      <UiSectionIntro
        heading-id="contact-title"
        :title="t('contact.title')"
        :text="t('contact.intro')"
      />

      <div class="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div class="grid gap-3.5 sm:grid-cols-2">
          <div
            v-for="item in items"
            :key="item.key"
            class="flex min-w-0 flex-col gap-3.5 rounded-card border border-line bg-surface p-[22px]"
          >
            <div class="grid size-11 place-items-center rounded-full bg-ink text-bg">
              <UiIcon :name="item.icon" class="size-5" />
            </div>
            <div>
              <h3 class="m-0 text-[13px] font-medium text-muted [font-stretch:100%]">
                {{ t(`contact.${item.key}.label`) }}
              </h3>
              <div
                v-if="item.value"
                class="text-lg font-medium leading-relaxed [font-stretch:112%] [overflow-wrap:anywhere]"
              >
                {{ item.value }}
              </div>
              <div v-else class="text-[15px] text-muted">
                {{ t(`contact.${item.key}.missing`) }}
              </div>
            </div>
            <UiButton
              variant="line"
              size="sm"
              class="mt-auto self-start"
              :disabled="!item.value"
              aria-haspopup="dialog"
              @click="openModal(item.key)"
            >
              {{ t(`contact.${item.key}.cta`) }}
            </UiButton>
          </div>
        </div>

        <div class="night-card flex flex-col gap-5 rounded-panel p-[30px]">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-2xl">{{ t('contact.hours.title') }}</h3>
            <!-- Depends on the visitor's clock, so it appears after hydration. -->
            <span
              v-if="status"
              class="inline-flex items-center gap-2 rounded-full bg-night-text/10 px-3 py-1.5 text-[13px]"
            >
              <i
                class="size-2 rounded-full"
                :class="
                  status.open
                    ? 'bg-night-success shadow-[0_0_10px_rgb(var(--color-night-success))]'
                    : 'bg-night-danger shadow-[0_0_10px_rgb(var(--color-night-danger))]'
                "
                aria-hidden="true"
              />
              {{ status.label }}
            </span>
          </div>

          <div v-if="alwaysOpen" class="flex flex-1 flex-col justify-center gap-2.5 py-2">
            <b class="always-big">08/7</b>
            <p class="m-0 text-night-muted">{{ t('contact.hours.alwaysText') }}</p>
            <div class="mt-2 grid grid-cols-7 gap-1.5" aria-hidden="true">
              <span
                v-for="day in WEEK_ORDER"
                :key="day"
                class="rounded-[10px] border py-2 text-center text-sm"
                :class="
                  day === today
                    ? 'border-night-accent bg-night-accent font-semibold text-night'
                    : 'border-night-accent/25 bg-night-accent/10 text-night-accent'
                "
                :title="t(`contact.days.${day}`)"
              >
                {{ t(`contact.daysShort.${day}`) }}
              </span>
            </div>
          </div>
          <table v-else class="w-full border-collapse text-[15px]">
            <tbody>
              <tr
                v-for="day in WEEK_ORDER"
                :key="day"
                :class="day === today ? 'font-semibold text-night-text' : 'text-night-muted'"
              >
                <td class="border-b border-night-line py-2.5">
                  {{
                    day === today
                      ? t('contact.hours.todaySuffix', { day: t(`contact.days.${day}`) })
                      : t(`contact.days.${day}`)
                  }}
                </td>
                <td class="border-b border-night-line py-2.5 text-right tabular-nums">
                  {{ hoursText(day) }}
                </td>
              </tr>
            </tbody>
          </table>

          <p class="m-0 text-[13px] text-night-muted">{{ t('contact.hours.note') }}</p>
        </div>
      </div>
    </div>
    <UiModal :open="!!active" :labelledby="modalTitleId" @close="activeKey = null">
      <div v-if="shown" class="flex flex-col gap-5">
        <div class="grid size-12 place-items-center rounded-full bg-ink text-bg">
          <UiIcon :name="shown.icon" class="size-[22px]" />
        </div>
        <div>
          <h2 :id="modalTitleId" class="text-2xl">{{ t(`contact.${shown.key}.label`) }}</h2>
          <p class="mb-0 mt-1.5 text-[15px] text-muted">{{ t(`contact.${shown.key}.hint`) }}</p>
        </div>

        <div class="rounded-2xl border border-line bg-bg px-4 py-3.5">
          <div
            class="select-all text-[22px] font-medium leading-snug [font-stretch:112%] [overflow-wrap:anywhere]"
          >
            {{ shown.value }}
          </div>
          <a
            v-if="shown.link"
            :href="shown.link"
            target="_blank"
            rel="noopener"
            class="mt-1 block text-sm text-muted underline underline-offset-[3px] [overflow-wrap:anywhere] hover:text-ink"
          >
            {{ shown.link }}
          </a>
        </div>

        <div class="flex flex-col gap-2.5 sm:flex-row">
          <UiButton :href="shown.href" :external="shown.external" class="sm:flex-1">
            <UiIcon :name="shown.icon" class="size-[18px]" />
            {{ t(`contact.${shown.key}.cta`) }}
          </UiButton>
          <UiButton v-if="isSupported" variant="line" class="sm:flex-1" @click="copyActive">
            <UiIcon v-if="copied" name="check" :stroke-width="2.4" class="size-4" />
            {{ copied ? t('contact.modal.copied') : t('contact.modal.copy') }}
          </UiButton>
        </div>
        <p
          role="status"
          aria-live="polite"
          class="m-0 min-h-0 text-center text-sm"
          :class="copyFailed ? 'text-danger' : 'sr-only'"
        >
          {{ copyFailed ? t('contact.modal.copyFailed') : copied ? t('contact.modal.copied') : '' }}
        </p>
      </div>
    </UiModal>
  </section>
</template>

<script setup lang="ts">
import type { IconName } from '~/types/ui'

const { t } = useI18n()
const { contact, links, alwaysOpen } = useContact()
const { today, status } = useOpeningStatus()

// Monday first, as people read the week.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

type ContactKey = 'phone' | 'telegram' | 'email' | 'address'

interface ContactItem {
  key: ContactKey
  icon: IconName
  /** What the card and modal show. */
  value: string
  /** Where the modal's main button goes (tel:, t.me, mailto:, Maps). */
  href: string
  external: boolean
  /** Link shown under the value in the modal (Telegram / Maps). */
  link: string
  /** What the Copy button copies. */
  copy: string
}

const items = computed<ContactItem[]>(() => {
  const telegram = contact.telegram.replace(/^@/, '')
  return [
    {
      key: 'phone',
      icon: 'phone',
      value: contact.phone,
      href: links.value.phone,
      external: false,
      link: '',
      copy: contact.phone,
    },
    {
      key: 'telegram',
      icon: 'telegram',
      value: telegram ? `@${telegram}` : '',
      href: links.value.telegram,
      external: true,
      link: links.value.telegram,
      copy: links.value.telegram,
    },
    {
      key: 'email',
      icon: 'email',
      value: contact.email,
      href: links.value.email,
      external: false,
      link: '',
      copy: contact.email,
    },
    {
      key: 'address',
      icon: 'address',
      // With only a Maps link saved, show "Google Maps" as the value.
      value: contact.address || (links.value.map ? t('contact.address.value') : ''),
      href: links.value.map,
      external: true,
      link: links.value.map,
      copy: [contact.address, links.value.map].filter(Boolean).join('\n'),
    },
  ]
})

// Contact detail modal.
const activeKey = ref<ContactKey | null>(null)
const active = computed(() => items.value.find((i) => i.key === activeKey.value) ?? null)
// Keeps the last item on screen while the modal fades out.
const shown = ref<ContactItem | null>(null)
watch(active, (item) => {
  if (item) shown.value = item
})
const modalTitleId = useId()

const { copy, copied, isSupported } = useClipboard({ copiedDuring: 2000, legacy: true })
const copyFailed = ref(false)
async function copyActive() {
  if (!shown.value) return
  copyFailed.value = false
  try {
    await copy(shown.value.copy)
  } catch {
    copyFailed.value = true
  }
}

function openModal(key: ContactKey) {
  copyFailed.value = false
  activeKey.value = key
}

function hoursText(day: number) {
  const h = contact.hours[day]!
  if (h.closed) return t('contact.hours.closed')
  if (h.allDay) return t('contact.hours.open24')
  return `${h.open}–${h.close}`
}
</script>

<style scoped>
.always-big {
  font-stretch: 125%;
  font-weight: 500;
  font-size: clamp(72px, 9vw, 112px);
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(
    180deg,
    rgb(var(--color-night-strong)),
    rgb(var(--color-night-accent))
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
