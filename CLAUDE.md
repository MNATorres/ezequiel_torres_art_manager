# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`, project references) then build with Vite
- `npm run lint` — run oxlint
- `npm run preview` — serve the production build locally

There is no test runner configured yet.

## Architecture

A React 19 + Vite + TypeScript single-page admin app for managing the content shown on the public Ezequiel Torres site (users, the "Trayectoria" timeline, and the "Arte en Vivo" gallery). It is a frontend client only — it talks to the external REST backend. There is no component library: styling is plain inline styles plus a hand-written `src/global.css` of shared classes (`.btn`, `.input`, `.icon-btn`, `.exp-card`/`.exp-thumb`, `.features-grid`); animations use Framer Motion and icons come from `react-icons`. (The CLAUDE-historical mention of MUI/Emotion is obsolete — they are not dependencies.)

- **Routing** (`src/App.tsx`): `react-router-dom` v7. `<AuthProvider>` wraps everything. `/login` is public; `/dashboard`, `/trayectoria`, and `/artworks` are wrapped in `<ProtectedRoute>` (any authenticated user); `/users` is wrapped in `<AdminRoute>` (ADMIN only); `/` redirects to `/dashboard`. The dashboard (`src/pages/Home.tsx`) is just a launcher of feature cards into those sections.
- **Auth** (`src/context/AuthContext.tsx`): the single source of truth for session state. JWT token + user are persisted to `localStorage` (`token`, `user`) and rehydrated on mount. Consume via the `useAuth()` hook — it throws if used outside `AuthProvider`. `ProtectedRoute` gates on `isAuthenticated`, showing a loading state until rehydration finishes (`isLoading`).
- **API layer** (`src/services/api.ts`): a single shared axios instance. A request interceptor reads `token` from `localStorage` and sets the `Authorization: Bearer` header on every request (and strips `Content-Type` for `FormData` so uploads keep their multipart boundary). All HTTP calls go through an exported service object — `authService`, `userService`, `experienceService`, `artworkService`, `uploadService` — add new endpoints there rather than calling axios from components. Base URL comes from `VITE_API_BASE_URL` (defaults to `http://localhost:3000`); the backend mounts routes under `/api`.
- **Types** (`src/types/index.ts`): shared `User`, `Experience`, `Artwork` (plus their `*Data` create/update shapes), `AuthResponse`, `ApiError`. Note the backend uses MongoDB-style `_id` (not `id`).

### Content modules (Trayectoria & Arte en Vivo)
Both content sections follow the **same list-page + form-modal pattern**, and are the template for any new one:

- A page (`src/pages/Trayectoria.tsx`, `src/pages/Artworks.tsx`) that loads a list through its service, renders cards with edit/delete, and handles loading / empty / error states.
- A modal (`src/components/ExperienceFormModal.tsx`, `src/components/ArtworkFormModal.tsx`) for create/edit. On submit, **if the admin picked a new image file it is uploaded first** via `uploadService` (→ backend → Cloudinary) and the returned URL is sent alongside the rest of the payload.
- `artwork` carries an integer **`order`** field (lower shows first on the public site) where `experience` carries a `date`.

To add another section: clone the `Artworks` page + `ArtworkFormModal`, add a service in `api.ts`, a route in `App.tsx`, and a dashboard card in `Home.tsx`.

## Conventions

- Pages live in `src/pages`, reusable components in `src/components`. Components are exported as named (non-default) exports.
- The "Ver en el sitio" preview links point at `PUBLIC_SITE_URL` (`src/config.ts` / `VITE_PUBLIC_SITE_URL`) so an editor can open the live result of what they just edited.
- Some inline comments are in Spanish; the app is bilingual (Spanish/English) in places.
- Linting is oxlint with the react/typescript/oxc plugins; `react/rules-of-hooks` is an error.
