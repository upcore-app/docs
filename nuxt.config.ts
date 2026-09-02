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

  nitro: {
    hooks: {
      // Nitro remembers a prerendered route under the Content-Type of the
      // response it saw while crawling. IPX answers an SVG with a string body,
      // and on that path the header comes back as `text/plain` instead of
      // `image/svg+xml` — which a browser refuses to paint inside an <img>, so
      // the header wordmark rendered as a broken image. The written file is
      // fine; only the remembered type is wrong. Handing the type back that the
      // extension implies makes Nitro drop its override and serve the file the
      // same way it serves every other SVG in public/.
      'prerender:generate'(route) {
        if (route.fileName?.endsWith('.svg')) {
          route.contentType = 'image/svg+xml'
        }
      },
    },
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
