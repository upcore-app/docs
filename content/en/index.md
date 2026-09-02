---
seo:
  title: Self-hosted uptime monitoring
  description: upcore watches your services, records every check, and publishes what
    it finds on a status page you can hand to your users. One container, one file,
    no database server to run.
---

::u-page-hero
---
orientation: horizontal
---
```bash [Terminal]
git clone https://github.com/upcore-app/upcore.git
cd upcore
cp .env.example .env          # then set NUXT_SESSION_PASSWORD
docker compose up -d
```

#title
Uptime monitoring you [actually own]{.text-primary}

#description
upcore watches your services, records every check, and publishes what it finds on a status page you can hand to your users.

It runs as a single container against a SQLite file — or against PostgreSQL when you outgrow that. Both paths are fully supported, not one plus an afterthought.

#headline
  :::u-button
  ---
  size: sm
  to: https://github.com/upcore-app/upcore/blob/development/LICENSE.md
  target: _blank
  variant: subtle
  trailing-icon: i-lucide-arrow-right
  ---
  Source-available under FSL-1.1-ALv2
  :::

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: https://github.com/upcore-app/upcore
  target: _blank
  variant: outline
  ---
  Source on GitHub
  :::
::

::u-page-section
---
title: One deployment, no moving parts
description: A single container against a file. Nothing to provision, nothing to
  tune, and nothing that stops working when you forget it exists.
---
  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-activity
    spotlight: true
    to: /guide/monitors
    ---
    #title
    Eight check types

    #description
    `http`, `keyword`, `ping`, `tcp`, `dns`, `ssl`, `push` and `group` — each with
    its own interval, timeout and failure threshold.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-layout-dashboard
    spotlight: true
    to: /guide/status-pages
    ---
    #title
    Status pages you design

    #description
    Logo, colours, font, corner radius and custom CSS. Any number of pages, each
    with its own slug and its own monitors.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-database
    spotlight: true
    to: /operations/databases
    ---
    #title
    SQLite or PostgreSQL

    #description
    Both first-class. Start on the file, move to the server when you outgrow it —
    the code does not have a preferred half.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-globe
    spotlight: true
    to: /guide/outposts
    ---
    #title
    Check from more than one place

    #description
    Outposts run the same checks from elsewhere and vote. A location that cannot
    be reached does not get a say.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-bell
    spotlight: true
    to: /guide/notifications
    ---
    #title
    Nine notification channels

    #description
    Discord, Slack, Teams, Google Chat, Telegram, ntfy, Gotify, Pushover and
    generic webhooks.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-code-2
    spotlight: true
    to: /api/authentication
    ---
    #title
    A REST API with real scopes

    #description
    `/api/v1`, described by an OpenAPI document generated from the same schemas
    the endpoints validate against.
    ::::
  :::
::

::u-page-section
---
orientation: horizontal
reverse: true
title: Every check, from every place you put one
description: An outpost is the same binary run somewhere else. Your instance
  dispatches the check batch, each outpost probes your services from where it
  stands, and the results come back to one timeline — so "down" means down
  everywhere, not down from one network.
links:
  - label: Outposts
    to: /guide/outposts
    trailingIcon: i-lucide-arrow-right
    color: primary
  - label: upcore Cloud
    to: /cloud/overview
    variant: subtle
    color: neutral
---
  :the-globe
::

::u-page-section
---
title: Built to be run by one person
description: The parts that usually need an operator have an answer that does not.
---
  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-play
    variant: subtle
    ---
    #title
    Migrations run themselves

    #description
    A `migrate` service runs on every `up`, brings the schema up to date and
    exits. The app only starts once it has finished. An update is
    `docker compose pull && docker compose up -d`, nothing else.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-layers
    variant: subtle
    ---
    #title
    Scaling needs no configuration

    #description
    The background schedules are leased in the database, so exactly one process
    runs them however many replicas you have — and a dead holder is replaced
    within seconds.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-mail
    variant: subtle
    ---
    #title
    Mail is opt-in, all of it

    #description
    Leave `NUXT_SMTP_HOST` empty and upcore sends nothing at all. No relay means
    no confirmation gate, so nobody is ever locked out by a server you never set up.
    ::::
  :::
::

::u-page-section
---
title: Or let somebody else run it
description: upcore Cloud is the same application, operated by onesrv. Free to
  start, upgradeable when you outgrow it, and nothing to install.
---
  :::u-page-card
  ---
  icon: i-lucide-cloud
  spotlight: true
  to: /cloud/overview
  ---
  #title
  upcore Cloud

  #description
  Sign up at [go.upcore.app](https://go.upcore.app) and add a monitor. No container, no
  database, no certificate and no update is yours to look after — and shared
  probe locations come with the plan. Self-hosting stays the default everywhere
  else in these docs.
  :::
::

::u-page-cta
---
title: Run it in four commands
description: SQLite in a volume, no database server, no build tooling. Open it and
  the first run asks you to create the admin account.
links:
  - label: Installation
    to: /getting-started/installation
    trailingIcon: i-lucide-arrow-right
    color: primary
  - label: Configuration reference
    to: /getting-started/configuration
    variant: subtle
    color: neutral
---
::
