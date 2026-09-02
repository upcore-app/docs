export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/i18n'],

  // Off on purpose: the docs are screenshotted and demoed, and the devtools
  // button sits on top of every one of those shots.
  devtools: { enabled: false },

  colorMode: {
    // upcore renders dark only; the docs keep the toggle but start where the
    // product does.
    preference: 'dark',
    fallback: 'dark',
  },

  site: {
    name: 'upcore',
    url: 'https://docs.upcore.app',
  },

  // English is the documentation language of the project (README, SECURITY,
  // the OpenAPI descriptions); German mirrors it because the admin UI itself
  // ships German-first. `en` stays unprefixed so existing links keep working.
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'de', language: 'de-DE', name: 'Deutsch' },
    ],
  },
})
