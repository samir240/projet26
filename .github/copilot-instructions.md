## Purpose
This file gives AI coding agents the minimal, actionable context needed to be productive in this repository.

## Big picture
- Framework: Next.js (App Router) app lives in `app/`. There are some legacy `pages/` artifacts in `pages/`.
- Backend: API routes are implemented as Next.js route handlers (`app/api/**/route.ts`) and a few legacy JS endpoints (`pages/api/*.js`).
- Database: MySQL used directly via `mysql2` in some endpoints and via Prisma in others. Prisma schema is in `prisma/schema.prisma` and the generated client is under `app/generated/prisma/`.

## Key files to read first
- `app/page.tsx` — primary app entry page.
- `app/api/*/route.ts` — canonical server-side API route implementations (use `NextResponse`). Example: `app/api/test/route.ts`.
- `app/lib/db.js` — direct `mysql2` pool; contains hard-coded credentials (sensitive).
- `prisma/schema.prisma` — Prisma schema and generator config; uses `env("DATABASE_URL")`.
- `app/generated/prisma/client.ts` — generated Prisma client (inspect to understand model usage).
- `package.json` — available npm scripts: `dev`, `build`, `start`, `lint`.

## Local dev & database workflows
- Start dev server: `npm install` then `npm run dev` (Next.js listens on :3000).
- Prisma: set `DATABASE_URL` in `.env` before running Prisma commands. Example:
  `DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"`
- Useful Prisma commands:
  - `npx prisma generate` — (re)generate client.
  - `npx prisma validate` — validate the schema.
  - `npx prisma db pull` / `npx prisma migrate dev` — sync or migrate DB (use carefully).

## Patterns & conventions in this repo
- App Router first: prefer `app/api/.../route.ts` handlers which export `GET`, `POST`, etc. Use `NextResponse` for responses.
- Legacy pages: `pages/api/*.js` exists in parallel; when changing API behavior check both `app/api` and `pages/api` for duplicates.
- Two DB approaches coexist:
  - Direct `mysql2` pools (see `app/lib/db.js` and `app/api/test/route.ts`).
  - Prisma client usage in `app/api/test/prisma/route.ts`.
  When introducing DB code, prefer Prisma where possible for consistency with `prisma/schema.prisma` and the generated client.

## Common pitfalls and gotchas
- Sensitive data: `app/lib/db.js` currently contains hard-coded credentials. Prefer using `.env` and `DATABASE_URL` — avoid committing secrets.
- Incorrect imports: there are a few broken/typo imports (example: `app/api/test.js` has `import db from '.db./lib/db';`). Fix relative paths carefully and prefer TypeScript `route.ts` handlers.
- Mixed JS/TS and app/pages routers: identify which route to edit — tests may call one or the other.
- Prisma client lifecycle: create a single `PrismaClient` per process where possible and call `$disconnect()` only when appropriate (e.g., server shutdown) to avoid connection churn in serverless environments.

## Integration points
- MySQL: used directly in some API routes and via Prisma.
- Prisma: generated client in `app/generated/prisma/` — if changing `prisma/schema.prisma` run `npx prisma generate`.
- Frontend ↔ API: `app/` pages call API routes under `app/api/*` — follow existing route signatures (e.g., `GET` handlers returning JSON via `NextResponse.json`).

## Editing guidance for AI agents
- When adding or modifying API routes, follow the `app/api/**/route.ts` pattern (export named methods like `GET`, `POST`) and return `NextResponse` objects.
- Prefer TypeScript `route.ts` files for new endpoints. If updating `pages/api/*` JS endpoints, keep consistent with their existing style.
- When touching DB code:
  - Use `prisma` client for model-level operations; use `mysql2` only for raw/legacy queries.
  - Ensure `DATABASE_URL` is used; do not leave credentials hard-coded.
- Run `npx prisma generate` after any `schema.prisma` change and before running the app.

## Debugging & tests
- Run dev and reproduce endpoints locally: `npm run dev` then visit `http://localhost:3000/api/test` or equivalent `app/api` routes.
- For Prisma errors, check `.env` `DATABASE_URL` and generated client under `app/generated/prisma`.

## Security & housekeeping
- Remove secrets from source — move credentials from `app/lib/db.js` into `.env` and update code to read `process.env` or `DATABASE_URL`.
- Consolidate DB usage (prefer Prisma) to reduce duplicated connection code.

## If you're unsure / ask this repo owner
- Which routes are canonical (app vs pages) for feature X? Point me to failing endpoint URLs or the intended route to update.
- Confirm where secrets (DB creds) should live for development vs production.

---
If anything here is unclear or you want more/less detail in any section, tell me which area to expand or correct.
