import type { LocaleObject } from '@nuxtjs/i18n'

/** Current locale plus the list of configured locales, for switchers and formatting. */
export function useAppLocale() {
  const { locale, locales } = useI18n()

  const available = computed(() => locales.value as LocaleObject[])
  const current = computed(
    () => available.value.find((l) => l.code === locale.value) ?? available.value[0]!,
  )
  /** BCP 47 tag for Intl APIs, e.g. km-KH or en-US. */
  const language = computed(() => current.value.language ?? current.value.code)

  return { locale, available, current, language }
}
