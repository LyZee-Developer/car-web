/**
 * Business details shown in the contact section, footer and mobile call bar.
 * Empty values show a "coming soon" note and disable the matching button.
 */
export interface OpeningDay {
  /** Open around the clock. */
  allDay?: boolean
  closed?: boolean
  /** 24h "HH:MM", used when not allDay/closed. */
  open?: string
  close?: string
}

export default defineAppConfig({
  /** Credited in the footer. */
  developer: 'Ly Leangseng',
  /** Clicking the developer name opens this chat in Telegram Web (in the browser, not the app). */
  developerUrl: 'https://web.telegram.org/k/#@LyZeeVlogger',
  contact: {
    phone: '015 844 712', // shown to visitors
    phoneIntl: '+85515844712', // used for the tel: link (Cambodia +855, leading 0 dropped)
    telegram: 'LyZeeVlogger', // Telegram username without @
    email: 'lyleangseng712@gmail.com',
    address: '', // street address text, e.g. "No. 12, Street 271, Phnom Penh"
    mapUrl: 'https://maps.app.goo.gl/g2eHPsvoZoA69UYv5', // Google Maps link to the workshop
    // Sunday first (index matches Date.getDay()).
    hours: [
      { allDay: true },
      { allDay: true },
      { allDay: true },
      { allDay: true },
      { allDay: true },
      { allDay: true },
      { allDay: true },
    ] as OpeningDay[],
  },
})
