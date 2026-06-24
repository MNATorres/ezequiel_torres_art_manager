# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`, project references) then build with Vite
- `npm run lint` — run oxlint
- `npm run preview` — serve the production build locally

There is no test runner configured yet.

## Architecture

A React 19 + Vite + TypeScript + Material UI (MUI v9, Emotion) single-page admin app for managing users. It is a frontend client only — it talks to an external REST API.

- **Routing** (`src/App.tsx`): `react-router-dom` v7. `<AuthProvider>` wraps all routes. `/dashboard` is wrapped in `<ProtectedRoute>`; `/` redirects to `/dashboard`.
- **Auth** (`src/context/AuthContext.tsx`): the single source of truth for session state. JWT token + user are persisted to `localStorage` (`token`, `user`) and rehydrated on mount. Consume via the `useAuth()` hook — it throws if used outside `AuthProvider`. `ProtectedRoute` gates on `isAuthenticated`, showing a loading state until rehydration finishes (`isLoading`).
- **API layer** (`src/services/api.ts`): a single shared axios instance. A request interceptor reads `token` from `localStorage` and sets the `Authorization: Bearer` header on every request. All HTTP calls go through the exported `authService` / `userService` objects — add new endpoints there rather than calling axios from components. Base URL comes from `VITE_API_BASE_URL` (defaults to `http://localhost:3000`); the backend mounts routes under `/api`.
- **Types** (`src/types/index.ts`): shared `User`, `AuthResponse`, `ApiError`. Note the backend uses MongoDB-style `_id` (not `id`).

## Conventions

- Pages live in `src/pages`, reusable components in `src/components`. Components are exported as named (non-default) exports.
- Some inline comments are in Spanish; the app is bilingual (Spanish/English) in places.
- Linting is oxlint with the react/typescript/oxc plugins; `react/rules-of-hooks` is an error.
