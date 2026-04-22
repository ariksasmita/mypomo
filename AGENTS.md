# Tech Stack
- Vue 3 + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- Bun (package manager)
- vite-plugin-pwa (PWA support)
- IndexedDB (data persistence)

# Build & Development
```bash
npm run dev          # Vite dev server
npm run build        # Typecheck then build (vue-tsc -b && vite build)
npm run preview      # Preview production build
```

# PWA (Progressive Web App)
- App can be installed as a native app on supported devices
- Service worker provides offline support
- Manifest with app name, description, and icons
- Build generates `dist/sw.js` service worker and `manifest.webmanifest`

# TypeScript
- Strict mode with `noUnusedLocals` and `noUnusedParameters`
- Components use `<script setup lang="ts">` syntax
- Typecheck runs before every build
- Custom type declaration in `src/vite-env.d.ts` for virtual:pwa-register

# Project Structure
- `src/main.ts` - App entry point + service worker registration
- `src/App.vue` - Root component
- `src/components/` - Vue components
  - `Timer.vue` - Timer with mode toggle (FOCUS/REST)
  - `SessionDetails.vue` - Task inputs (title, category, description)
  - `Stats.vue` - Statistics panel and session history
- `src/utils/indexedDB.ts` - IndexedDB service for data persistence
- `src/types/index.ts` - TypeScript interfaces
- `public/` - Static assets including PWA icons

# Data Persistence
- IndexedDB stores sessions, category stats, and categories
- Real elapsed time tracking with Date.now() timestamps
- Category fuzzy matching (exact + Levenshtein distance 80%)
- JSON export functionality
- Auto-refresh stats after session saves

# Notes
- No test framework, linter, or CI configured
- Tailwind v4 imported via `@import "tailwindcss"` in style.css
- PWA requires HTTPS to work (except on localhost)
