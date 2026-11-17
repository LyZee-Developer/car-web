/** Contact links built from app.config.ts, plus opening-hours status. */
export function useContact() {
  const { contact } = useAppConfig()

  const links = computed(() => ({
    // International form (+855…) dials correctly from any phone.
    phone: contact.phone
      ? `tel:${(contact.phoneIntl || contact.phone).replace(/[^\d+]/g, '')}`
      : '',
    telegram: contact.telegram
      ? `https://t.me/${encodeURIComponent(contact.telegram.replace(/^@/, ''))}`
      : '',
    email: contact.email ? `mailto:${contact.email}` : '',
    // A saved Maps link wins; otherwise search Google Maps for the address text.
    map:
      contact.mapUrl ||
      (contact.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
        : ''),
  }))

  const alwaysOpen = computed(() => contact.hours.every((h) => h.allDay))

  return { contact, links, alwaysOpen }
}

const toMinutes = (time: string) => {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * "Open now / closed" label for the current time. Depends on the visitor's clock,
 * so it is only computed on the client (null during SSR) to avoid hydration mismatches.
 */
export function useOpeningStatus() {
  const { t } = useI18n()
  const { contact, alwaysOpen } = useContact()
  const now = ref<Date | null>(null)

  onMounted(() => {
    now.value = new Date()
  })
  useIntervalFn(() => {
    now.value = new Date()
  }, 60_000)

  const today = computed(() => now.value?.getDay() ?? null)

  const status = computed<{ open: boolean; label: string } | null>(() => {
    if (!now.value || today.value === null) return null
    const hours = contact.hours
    const day = today.value
    const minutes = now.value.getHours() * 60 + now.value.getMinutes()
    const h = hours[day]!
    const open =
      !h.closed &&
      (!!h.allDay ||
        (!!h.open && !!h.close && minutes >= toMinutes(h.open) && minutes < toMinutes(h.close)))

    if (alwaysOpen.value) return { open: true, label: t('contact.hours.openNowAlways') }
    if (open && h.allDay) return { open: true, label: t('contact.hours.openNowToday') }
    if (open) return { open: true, label: t('contact.hours.openNowCloses', { time: h.close }) }

    if (!h.closed && h.open && minutes < toMinutes(h.open)) {
      return {
        open: false,
        label: t('contact.hours.closedOpens', { day: t('contact.hours.today'), time: h.open }),
      }
    }
    for (let k = 1; k <= 7; k++) {
      const index = (day + k) % 7
      const next = hours[index]!
      if (next.closed) continue
      const dayLabel = k === 1 ? t('contact.hours.tomorrow') : t(`contact.days.${index}`)
      return {
        open: false,
        label: t('contact.hours.closedOpens', {
          day: dayLabel,
          time: next.allDay ? '00:00' : next.open,
        }),
      }
    }
    return { open: false, label: t('contact.hours.closed') }
  })

  return { today, status }
}
