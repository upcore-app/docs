---
seo:
  title: Self-hosted Uptime-Monitoring
  description: upcore überwacht deine Dienste, hält jeden Check fest und veröffentlicht
    das Ergebnis auf einer Statusseite, die du deinen Nutzern geben kannst. Ein
    Container, eine Datei, kein Datenbankserver.
---

::u-page-hero
---
orientation: horizontal
---
```bash [Terminal]
git clone https://github.com/upcore-app/upcore.git
cd upcore
cp .env.example .env          # dann NUXT_SESSION_PASSWORD setzen
docker compose up -d
```

#title
Uptime-Monitoring, das [dir gehört]{.text-primary}

#description
upcore überwacht deine Dienste, hält jeden Check fest und veröffentlicht das Ergebnis auf einer Statusseite, die du deinen Nutzern geben kannst.

Es läuft als einzelner Container gegen eine SQLite-Datei — oder gegen PostgreSQL, wenn dir das zu klein wird. Beide Wege sind vollwertig, nicht einer plus ein Nachgedanke.

#headline
  :::u-button
  ---
  size: sm
  to: https://github.com/upcore-app/upcore/blob/development/LICENSE.md
  target: _blank
  variant: subtle
  trailing-icon: i-lucide-arrow-right
  ---
  Source-available unter FSL-1.1-ALv2
  :::

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /de/getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Loslegen
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
  Quellcode auf GitHub
  :::
::

::u-page-section
---
title: Ein Deployment, keine beweglichen Teile
description: Ein Container gegen eine Datei. Nichts bereitzustellen, nichts zu
  tunen, und nichts, das aufhört zu funktionieren, wenn du es vergisst.
---
  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-activity
    spotlight: true
    to: /de/guide/monitors
    ---
    #title
    Acht Check-Typen

    #description
    `http`, `keyword`, `ping`, `tcp`, `dns`, `ssl`, `push` und `group` — jeder mit
    eigenem Intervall, Timeout und Fehlerschwelle.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-layout-dashboard
    spotlight: true
    to: /de/guide/status-pages
    ---
    #title
    Statusseiten, die du gestaltest

    #description
    Logo, Farben, Schrift, Eckenradius und eigenes CSS. Beliebig viele Seiten,
    jede mit eigenem Slug und eigenen Monitoren.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-database
    spotlight: true
    to: /de/operations/databases
    ---
    #title
    SQLite oder PostgreSQL

    #description
    Beides erstklassig. Fang mit der Datei an, wechsle auf den Server, wenn du
    herauswächst — der Code hat keine Lieblingshälfte.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-globe
    spotlight: true
    to: /de/guide/outposts
    ---
    #title
    Von mehr als einem Ort prüfen

    #description
    Outposts führen dieselben Checks anderswo aus und stimmen ab. Ein Standort,
    der nicht erreichbar ist, hat keine Stimme.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-bell
    spotlight: true
    to: /de/guide/notifications
    ---
    #title
    Neun Benachrichtigungskanäle

    #description
    Discord, Slack, Teams, Google Chat, Telegram, ntfy, Gotify, Pushover und
    generische Webhooks.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-code-2
    spotlight: true
    to: /de/api/authentication
    ---
    #title
    Eine REST-API mit echten Scopes

    #description
    `/api/v1`, beschrieben durch ein OpenAPI-Dokument, das aus denselben Schemas
    erzeugt wird, gegen die die Endpunkte validieren.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-network
    spotlight: true
    to: /de/guide/topology
    ---
    #title
    Ein Bild davon, wer was prüft

    #description
    Ein Graph aus allen Standorten und allen Monitoren — samt denen, die still auf
    den zentralen Check zurückgefallen sind.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-shield-check
    spotlight: true
    to: /de/guide/account-security
    ---
    #title
    Passkeys und zweiter Faktor

    #description
    WebAuthn, TOTP mit Wiederherstellungscodes, eine Pflicht, die eine
    Organisation allen Mitgliedern auferlegen kann, und jedes angemeldete Gerät.
    ::::
  :::
::

::u-page-section
---
orientation: horizontal
reverse: true
title: Jeder Check, von jedem Ort, an den du einen stellst
description: Ein Outpost ist dasselbe Binary, nur woanders. Deine Instanz
  verteilt den Check-Batch, jeder Outpost prüft deine Dienste von seinem
  Standort aus, und die Ergebnisse laufen in einer Zeitleiste zusammen — down
  heißt damit überall down, nicht down aus einem Netz.
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
title: Gebaut, um von einer Person betrieben zu werden
description: Die Teile, die sonst einen Operator brauchen, haben hier eine Antwort,
  die keinen braucht.
---
  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-play
    variant: subtle
    ---
    #title
    Migrationen laufen von selbst

    #description
    Ein `migrate`-Service läuft bei jedem `up`, bringt das Schema auf Stand und
    beendet sich. Die App startet erst danach. Ein Update ist
    `docker compose pull && docker compose up -d`, sonst nichts.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-layers
    variant: subtle
    ---
    #title
    Skalieren braucht keine Konfiguration

    #description
    Die Hintergrund-Schedules werden in der Datenbank geleast: genau ein Prozess
    führt sie aus, egal wie viele Replicas laufen — und ein toter Halter wird in
    Sekunden ersetzt.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-mail
    variant: subtle
    ---
    #title
    Mail ist optional, komplett

    #description
    Lass `NUXT_SMTP_HOST` leer und upcore verschickt gar nichts. Kein Relay heißt
    keine Bestätigungspflicht — niemand wird von einem Server ausgesperrt, den du
    nie eingerichtet hast.
    ::::
  :::
::

::u-page-section
---
title: Oder betreiben lassen
description: upcore Cloud ist dieselbe Anwendung, betrieben von onesrv. Kostenlos
  starten, upgraden wenn es eng wird, nichts zu installieren.
---
  :::u-page-card
  ---
  icon: i-lucide-cloud
  spotlight: true
  to: /de/cloud/overview
  ---
  #title
  upcore Cloud

  #description
  Auf [go.upcore.app](https://go.upcore.app/register) registrieren und einen Monitor anlegen.
  Kein Container, keine Datenbank, kein Zertifikat und kein Update, um das du
  dich kümmerst — geteilte Probe-Standorte kommen mit dem Tarif. Überall sonst
  in dieser Doku bleibt Self-Hosting der Standard.
  :::
::

::u-page-cta
---
title: In vier Befehlen am Laufen
description: SQLite in einem Volume, kein Datenbankserver, kein Build-Tooling. Beim
  ersten Aufruf legst du das Admin-Konto an.
links:
  - label: Installation
    to: /de/getting-started/installation
    trailingIcon: i-lucide-arrow-right
    color: primary
  - label: Konfigurationsreferenz
    to: /de/getting-started/configuration
    variant: subtle
    color: neutral
---
::
