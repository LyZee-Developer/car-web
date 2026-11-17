/**
 * Scrolls to an element by id, respecting reduced-motion. Client-only (no-op during SSR).
 */
export function useScrollToSection() {
  const reducedMotion = usePreferredReducedMotion()

  return (id: string, options: { focus?: boolean } = {}) => {
    if (!import.meta.client) return
    const el = document.getElementById(id)
    if (!el) return
    if (options.focus) el.focus({ preventScroll: true })
    window.setTimeout(() => {
      el.scrollIntoView({
        behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 60)
  }
}
