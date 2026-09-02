export default defineAppConfig({
  seo: {
    title: 'upcore',
    titleTemplate: '%s · upcore',
    description:
      'Self-hosted uptime monitoring with public status pages. One container, one file, no database server to run.',
  },

  header: {
    title: 'upcore',
    logo: {
      // The duotone icon carries both brand colours, so it needs no per-mode
      // twin; the wordmark does — its lettering is ink, not brand colour.
      light: '/logo/icon.svg',
      dark: '/logo/icon.svg',
      alt: 'upcore',
      display: 'wordmark',
      wordmark: {
        light: '/logo/wordmark-dark.svg',
        dark: '/logo/wordmark-light.svg',
      },
      class: 'h-6 w-auto',
      favicon: '/favicon.svg',
    },
  },

  footer: {
    // Imprint, privacy policy and terms live on the product site; the docs sit
    // under the same legal entity, so they link there instead of duplicating
    // the pages here.
    legal: [
      { label: 'Impressum', to: 'https://upcore.app/impressum' },
      { label: 'Datenschutz', to: 'https://upcore.app/datenschutz' },
      { label: 'AGB', to: 'https://upcore.app/agb' },
    ],
  },

  github: {
    url: 'https://github.com/upcore-app/upcore',
    branch: 'main',
    rootDir: '',
  },

  socials: {
    github: 'https://github.com/upcore-app/upcore',
  },

  toc: {
    title: 'On this page',
    bottom: {
      title: 'upcore',
      links: [
        {
          icon: 'i-simple-icons-github',
          label: 'Source on GitHub',
          to: 'https://github.com/upcore-app/upcore',
          target: '_blank',
        },
        {
          icon: 'i-lucide-shield-check',
          label: 'Report a vulnerability',
          to: 'https://github.com/upcore-app/upcore/blob/main/SECURITY.md',
          target: '_blank',
        },
      ],
    },
  },

  ui: {
    colors: {
      // The four status colours upcore paints its heartbeats with, reused as
      // the semantic palette so a warning here is the same amber as a degraded
      // monitor there. Scales are defined in app/app.css.
      primary: 'upcore',
      neutral: 'carbon',
      success: 'upcore',
      error: 'down',
      warning: 'degraded',
      info: 'maintenance',
    },
  },
})
