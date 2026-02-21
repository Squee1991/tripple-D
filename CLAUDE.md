# CLAUDE.md — SkillUp German (tripple-D)

## Project Overview

A gamified German language learning web app. Users practice articles, verbs, adjectives, prepositions, take exams, compete in duels/battles, earn achievements and ranks. Deployed at **skillupgerman.com**.

## Tech Stack

- **Framework:** Nuxt 3 (Vue 3, Composition API with `<script setup>`)
- **State:** Pinia (`store/` directory, 27 stores)
- **Backend:** Firebase (Auth, Firestore) via `nuxt-vuefire`, Firebase Admin SDK on server
- **Payments:** Stripe (checkout, confirm, cancel endpoints)
- **AI:** Groq API (homework checking, vision), Whisper (speech-to-text)
- **Realtime:** Socket.io (battles, duels)
- **Animations:** GSAP, Lottie (`assets/animation/`), Three.js, Phaser (mini-games)
- **i18n:** 11 locales — EN, PL, HI, TR, RO, ES, FR, RU, UK, UZ, AR
- **Hosting:** Vercel (Nitro preset), SPA mode (`ssr: false` for all routes except `/`)
- **Styling:** CSS custom properties with light/dark mode (`assets/styles/theme.css`)
- **Node:** v22, npm v10

## Commands

```bash
npm run dev          # Start dev server (NODE_ENV=development)
npm run build        # Production build (NODE_ENV=production)
npm run start        # Run production build
npm run socket       # Start Socket.io server (server/server.js)
npm run generate     # Static generation
npm run preview      # Preview production build
```

## Project Structure

```
app.vue                  # Root — layouts, global stores init, SEO head
pages/                   # Nuxt file-based routing (60+ pages)
src/components/          # Vue components (110+), NOT in components/ auto-import dir
store/                   # Pinia stores (authStore, learningStore, BattleStore, etc.)
composables/             # Vue composables (useSocket, useGroqCheck, useSfx, etc.)
server/
  api/                   # Nitro API routes (groq, whisper, stripe/)
  api/utils/             # firebase-admin.js helper
  server.js              # Standalone Socket.io server
layouts/                 # default.vue, footerlayout.vue
plugins/                 # Client-only plugins (.client.js): auth, firebase, analytics
config/                  # Firebase config (dev/prod)
utils/                   # Shared helpers (achievements, awards, dates, sounds, errors)
src/achieveGroup/        # Achievement definitions grouped by category
src/awards/              # Awards mapping
public/                  # Static JSON data files (verbs, adjectives, prepositions, exams, events)
assets/
  styles/                # CSS: theme.css (variables), reset.css, variables.css
  images/                # SVG/PNG assets organized by feature
  animation/             # Lottie JSON files
  awards/                # Award icon SVGs
i18n/locales/            # Translation JSON files per locale
types/                   # TypeScript declarations (runtime-config.d.ts)
```

## Key Architecture Decisions

### Components are in `src/components/`, NOT `components/`
Components live in `src/components/` and are imported explicitly — they are **not** auto-imported by Nuxt. Always use explicit imports:
```js
import MyComponent from '~/src/components/MyComponent.vue'
```

### Store naming conventions
Stores use inconsistent naming (legacy). Examples:
- `userlangStore` (not `useLangStore`) in `learningStore.js`
- `userAuthStore` in `authStore.js`
- `useAchievementStore` in `achievementStore.js`
Follow existing patterns per store when importing.

### Routing
- Dynamic routes use `[param]` syntax: `pages/tenses/[topicId].vue`, `pages/event-[id]/index.vue`
- JSON data for exercises is in `public/` and fetched client-side
- Route `pages/location/quest-[id].vue` — quest chain pages

### Styling
- CSS custom properties defined in `assets/styles/theme.css` (`:root` for light, `.dark` for dark mode)
- Color mode managed by `@nuxtjs/color-mode`
- Font: Nunito (primary), Fredoka, Kurale, Uncial Antiqua (decorative)
- No CSS preprocessor — plain CSS only

### Firebase
- Client SDK initialized via `nuxt-vuefire` module and `plugins/firebase.client.js`
- Admin SDK in `server/api/utils/firebase-admin.js` for server routes
- Auth state watched in `app.vue`, redirects on logout

### Environment Variables
Configured in `.env.development` (gitignored). Key variables:
- `FIREBASE_*` — Firebase config
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `GROQ_API_KEY`
- `ADMIN_UID1`, `ADMIN_UID2`
- Accessed via `runtimeConfig` in `nuxt.config.js`

## Conventions

- **Language:** JavaScript (not TypeScript), `<script setup>` style
- **File naming:** camelCase for stores/utils/composables, PascalCase or kebab-case for components (mixed, follow existing pattern per directory)
- **Imports:** Use `~/` alias for project root
- **No auto-import of components** — always import explicitly from `~/src/components/`
- **Composables and stores ARE auto-imported** by Nuxt from `composables/` and `store/`
- **Data files:** Static JSON in `public/`, fetched via `$fetch` or `useFetch`
- **All plugins are client-only** (`.client.js` suffix)
- **RTL support:** Arabic locale sets `dir="rtl"` on `<html>`
- **Console logs stripped in production** via Terser config

## Git

- **Main branch:** `master`
- **Dev branch:** `firstdev`
- **Sensitive files are gitignored:** `.env.*`, `service-account*.json`
- **No test suite** currently configured
