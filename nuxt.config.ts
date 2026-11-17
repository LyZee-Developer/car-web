// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-17',
  devtools: { enabled: true },

  typescript: {
    strict: true,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  // Global styles: theme tokens first so every other file can use them.
  css: ['~/assets/css/theme.css', '~/assets/css/fonts.css', '~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  runtimeConfig: {
    // Development only: seed 4 sample reviews into an empty board (see server/plugins/seed-demo-reviews.ts).
    // Off in production builds; never ship sample reviews as real ones.
    seedDemoReviews: process.env.NODE_ENV !== 'production',
    public: {
      // Absolute site URL, used for hreflang / og:url. Override with NUXT_PUBLIC_SITE_URL.
      siteUrl: 'http://localhost:3000',
    },
  },

  // Light / Dark / System. classSuffix '' puts a plain `dark` or `light` class on <html>.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'heng-color-mode',
  },

  // Khmer is the default (no prefix); English lives under /en.
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    strategy: 'prefix_except_default',
    defaultLocale: 'km',
    locales: [
      // `short` is the compact label shown in the header switcher.
      { code: 'km', language: 'km-KH', name: 'ខ្មែរ', short: 'ខ្មែរ', file: 'km.json' },
      { code: 'en', language: 'en-US', name: 'English', short: 'EN', file: 'en.json' },
    ],
    // Locale files are lazy-loaded from /i18n/locales.
    langDir: 'locales',
    vueI18n: './i18n.config.ts',
    // Always open in Khmer: no redirect based on the browser language.
    // English is only shown when the visitor picks EN (it stays in the /en URL while they browse).
    detectBrowserLanguage: false,
  },

  // Fonts are downloaded from Google Fonts at build time and self-hosted (no requests to Google at runtime).
  // English: Archivo (width axis requested so headings can use font-stretch: 125% like the design).
  // Khmer:   Battambang (body), Nokora (headings), Hanuman (customer review quotes),
  //          Google Sans Flex for the Latin characters inside Khmer text. See assets/css/fonts.css.
  fonts: {
    google: {
      experimental: {
        variableAxis: {
          Archivo: { wdth: [['62', '125']] },
        },
      },
    },
    families: [
      { name: 'Archivo', provider: 'google', weights: ['300 700'], styles: ['normal'] },
      // `global: true` always emits the @font-face. Without it @nuxt/fonts only picks up the first
      // family of each stack, so the Khmer fonts (2nd in the stacks) would never be loaded.
      {
        name: 'Google Sans Flex',
        provider: 'google',
        weights: ['400', '500', '600', '700'],
        global: true,
      },
      {
        name: 'Battambang',
        provider: 'google',
        weights: ['100', '300', '400', '700', '900'],
        subsets: ['khmer', 'latin'],
        global: true,
      },
      {
        name: 'Nokora',
        provider: 'google',
        weights: ['100 900'],
        subsets: ['khmer', 'latin'],
        global: true,
      },
      {
        name: 'Hanuman',
        provider: 'google',
        weights: ['100 900'],
        subsets: ['khmer', 'latin'],
        global: true,
      },
    ],
  },

  tailwindcss: {
    cssPath: false, // Tailwind layers are imported from main.css instead.
  },

  // Reviews and visitor counts are kept in local file storage (.data/db).
  // Swap the driver (e.g. redis, cloudflare-kv) for production hosting.
  nitro: {
    storage: {
      db: { driver: 'fs', base: './.data/db' },
    },
  },

  eslint: {
    config: {
      stylistic: false, // Prettier handles formatting.
    },
  },
})
