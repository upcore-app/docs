<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/logo/wordmark-light.svg">
  <img src="public/logo/wordmark-dark.svg" alt="upcore" width="280">
</picture>

<br>

**The documentation site for [upcore](https://github.com/upcore-app/upcore)** — self-hosted uptime
monitoring with public status pages.

[docs.upcore.app](https://docs.upcore.app) · [Product repo](https://github.com/upcore-app/upcore) · [upcore Cloud](https://go.upcore.app/register) · [Discord](https://discord.gg/eWeaQZYcyd)

</div>

---

## What this is

A [Docus](https://docus.dev) site on Nuxt 4. Everything readers see lives in `content/` as Markdown —
no build step to learn, no components to wire up for a normal page.

## Develop

```bash
bun install
bun run dev          # http://localhost:3000
```

| Command | Does |
| --- | --- |
| `bun run dev` | Dev server with hot reload |
| `bun run build` | Production build into `.output/` |
| `bun run preview` | Serve the built output |
| `bun run generate` | Static export |

## Layout

```
content/
  en/                 # English — the source of truth
  de/                 # German — mirrors en/
    1.getting-started/
    2.guide/
    3.operations/
    4.api/
    5.cloud/
    6.development/
app/
  app.config.ts       # Header, logo, socials, colours
  components/content/ # MDC components usable from Markdown (:the-globe, …)
public/logo/          # Wordmarks and icons
nuxt.config.ts        # Docus, i18n, colour mode
```

Numeric prefixes (`2.guide`) set the sidebar order and are stripped from the URL.
Each directory carries a `.navigation.yml` for its title and icon.

## Writing docs

- Write the English page first, then mirror it under `content/de/` at the same path.
- `en` is unprefixed (`/guide/monitors`), German is prefixed (`/de/guide/monitors`).
- Pages support [MDC](https://content.nuxt.com/docs/files/markdown) — the `::u-page-section`,
  `::u-page-card` and friends used across the site.
- The site renders dark by default; check both modes before opening a PR.

## Deploy

The included `Dockerfile` builds the Nitro output onto a bare `node:alpine`:

```bash
docker build -t upcore-docs .
docker run -p 3000:3000 upcore-docs
```

CI publishes the image to `ghcr.io/upcore-app/docs` on every push to `main`.

## Contributing

Issues and pull requests are welcome. For anything about upcore itself — features, bugs,
security — use the [product repo](https://github.com/upcore-app/upcore).

## Support

Questions and support run through our Discord:
[discord.gg/eWeaQZYcyd](https://discord.gg/eWeaQZYcyd). Want upcore without hosting it
yourself? [upcore Cloud](https://go.upcore.app/register) is free to start.
