# syntax=docker/dockerfile:1

# Build-Stage: Bun installiert die Abhängigkeiten, gebaut wird mit Node.
# Alpine, damit die nativen Module (better-sqlite3, sharp, @takumi-rs) gegen
# musl gebaut werden und im Alpine-Runtime-Image laufen.
ARG BUN_VERSION=1.3.14
ARG NODE_VERSION=22

# Bun kommt nur als Paketmanager mit — als Laufzeit scheitert es unter musl
# beim Laden von @nuxt/vite-builder. Gebaut wird deshalb mit demselben Node,
# das nachher auch das Output ausführt.
FROM oven/bun:${BUN_VERSION}-alpine AS bun

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

# better-sqlite3 liefert keine musl-Prebuilds und wird hier aus dem Quellcode
# gebaut. Nur in dieser Stage — im Runtime-Image bleibt davon nichts übrig.
RUN apk add --no-cache python3 make g++

# Eigene Layer für die Dependencies: ändert sich nur bei package.json/bun.lock.
# Das root-postinstall (`nuxt prepare`) wird hier neutralisiert, weil der
# Quellcode noch fehlt — `nuxt build` erledigt den prepare-Schritt ohnehin.
COPY package.json bun.lock ./
RUN sed -i 's/"nuxt prepare"/"true"/' package.json \
 && bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1
RUN node node_modules/nuxt/bin/nuxt.mjs build

# Runtime-Stage: nur das .output-Verzeichnis auf einem nackten node-alpine.
FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=node:node /app/.output ./.output

# Nuxt Content legt seine SQLite-Datei zur Laufzeit unter ./contents.sqlite an
# (relativ zum WORKDIR, siehe runtimeConfig im Output). Ohne schreibbares /app
# scheitert der erste Content-Request.
RUN chown node:node /app

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
