# Tech Stack
- Vue 3 + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- Bun (package manager)

# Build & Development
```bash
npm run dev          # Vite dev server
npm run build        # Typecheck then build (vue-tsc -b && vite build)
npm run preview      # Preview production build
```

# TypeScript
- Strict mode with `noUnusedLocals` and `noUnusedParameters`
- Components use `<script setup lang="ts">` syntax
- Typecheck runs before every build

# Project Structure
- `src/main.ts` - App entry point
- `src/App.vue` - Root component
- `src/components/` - Vue components

# Notes
- No test framework, linter, or CI configured
- Tailwind v4 imported via `@import "tailwindcss"` in style.css
