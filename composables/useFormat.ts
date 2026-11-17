export type CurrencyCode = 'USD' | 'KHR'

/** Formats prices in US dollars ($) or Khmer riel (៛) using the i18n number formats. */
export function useFormatCurrency() {
  const { n } = useI18n()
  return (value: number, currency: CurrencyCode = 'USD') =>
    n(value, currency === 'KHR' ? 'khr' : 'usd')
}

const PHNOM_PENH_OFFSET_MS = 7 * 60 * 60 * 1000

/**
 * Formats a timestamp as a date ("17 វិច្ឆិកា 2026" / "November 17, 2026").
 * Built from translated month names rather than Intl, because some browsers ship
 * without Khmer locale data while Node has it — that would cause hydration mismatches.
 */
export function useFormatDate() {
  const { t } = useI18n()
  return (timestamp: number | null | undefined) => {
    if (!timestamp) return ''
    // Shown in workshop time (Phnom Penh, UTC+7, no DST) so server and browser agree.
    const date = new Date(timestamp + PHNOM_PENH_OFFSET_MS)
    return t('date.pattern', {
      day: date.getUTCDate(),
      month: t(`date.months.${date.getUTCMonth()}`),
      year: date.getUTCFullYear(),
    })
  }
}

/** One decimal place, e.g. 4.6 — used for ratings. */
export function useFormatDecimal() {
  const { n } = useI18n()
  return (value: number) => n(value, 'decimal')
}
