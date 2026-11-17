import type { Config } from 'tailwindcss'

/** Maps a theme token (RGB channels in assets/css/theme.css) to a Tailwind color with opacity support. */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

export default {
  // @nuxtjs/color-mode adds `dark` to <html>. Use `dark:` only where a token cannot cover the case.
  darkMode: 'class',
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './utils/**/*.ts',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        ink: token('text'),
        muted: token('muted'),
        line: token('border'),
        primary: { DEFAULT: token('primary'), contrast: token('primary-contrast') },
        success: token('success'),
        danger: token('danger'),
        warning: token('warning'),
        night: {
          DEFAULT: token('night'),
          2: token('night-2'),
          panel: token('night-panel'),
          raised: token('night-raised'),
          text: token('night-text'),
          strong: token('night-strong'),
          muted: token('night-muted'),
          line: token('night-line'),
          edge: token('night-edge'),
          accent: token('night-accent'),
          'accent-deep': token('night-accent-deep'),
          success: token('night-success'),
          danger: token('night-danger'),
          off: token('night-off'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        quote: ['var(--font-quote)'],
      },
      maxWidth: {
        page: '1180px',
      },
      borderRadius: {
        card: '22px',
        panel: '28px',
      },
      lineHeight: {
        body: 'var(--line-height-body)',
        heading: 'var(--line-height-heading)',
      },
      letterSpacing: {
        heading: 'var(--letter-spacing-heading)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config
