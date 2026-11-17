export type ThemePreference = 'light' | 'dark' | 'system'

export const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system']

/**
 * Wraps @nuxtjs/color-mode. `system` follows the OS and updates live when the OS setting changes.
 * The choice is persisted by color-mode (localStorage) and applied before paint, so there is no flash.
 */
export function useAppTheme() {
  const colorMode = useColorMode()
  const reducedMotion = usePreferredReducedMotion()

  const preference = computed<ThemePreference>(() => colorMode.preference as ThemePreference)
  const isDark = computed(() => colorMode.value === 'dark')

  function setPreference(value: ThemePreference) {
    if (import.meta.client && reducedMotion.value !== 'reduce') {
      // Brief colour fade while switching (see main.css).
      const root = document.documentElement
      root.classList.add('theme-anim')
      window.setTimeout(() => root.classList.remove('theme-anim'), 400)
    }
    colorMode.preference = value
  }

  return { preference, isDark, setPreference }
}
