// Number and date formats for both locales. Use them through useI18n().n() / d()
// or the useFormatCurrency / useFormatDate composables.
const numberFormats = {
  decimal: { style: 'decimal', minimumFractionDigits: 1, maximumFractionDigits: 1 },
  integer: { style: 'decimal', maximumFractionDigits: 0 },
  percent: { style: 'percent', maximumFractionDigits: 0 },
  // US dollar: two decimals.
  usd: { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' },
  // Khmer riel: no minor unit in everyday use, shown with the ៛ sign.
  khr: {
    style: 'currency',
    currency: 'KHR',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
} as const

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'km',
  numberFormats: {
    km: numberFormats,
    en: numberFormats,
  },
  datetimeFormats: {
    km: {
      short: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit', hour12: false },
    },
    en: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit', hour12: false },
    },
  },
}))
