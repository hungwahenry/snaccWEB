<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Feature slice layout

Every folder under `features/` (the public app; `features/admin/*` for the admin panel) follows one shape. Do not invent a second one.

- `api/index.ts` — every call to the backend for the slice, one file. `api/public.ts` only where a slice also has server-side fetchers for signed-out pages.
- `types/index.ts` — the slice's types. Never a loose `types.ts`.
- `hooks/use-*.ts` — all logic: queries, mutations, form state, derived state. One concern per file; a file may export closely related hooks (e.g. `use-mark-read.ts` holds the three "mark" mutations).
- `components/*.tsx` — strictly presentational. Props in, callbacks out. No data fetching, no mutations, no router. Local UI state (open/closed, hover, reveal) and context reads (theme, tiers) are fine.
- `containers/*.tsx` — the only components allowed to call data hooks; each is a thin wrapper that runs one hook and renders one presentational component (e.g. a link preview that resolves itself, a comment that unfolds its replies). Use sparingly.
- `screens/*.tsx` — route-level wiring: call hooks, compose components, mount sheets. Pages in `app/` call `requireSession()` and render a screen; nothing else.
- `utils/*.ts` — pure helpers. Never `lib/` inside a slice, never loose helper files at the slice root.
- `schemas/*.ts` — zod schemas, only where a slice validates input (auth, onboarding).
- Allowed at the slice root only: `routes.ts` (path builders), `realtime.ts` (socket handlers), `cache/` (query-cache patchers, snaccs only) and generated files.

App-wide providers live in `providers/`, shared hooks in `hooks/`, shared primitives in `components/ui/`.

# The admin panel is a known exception

`features/admin/*` follows the slice shape above for `api`/`types`/`hooks`/`components`, but deviates in four
ways. This is a deliberate, deferred choice, not a pattern to copy: a full refactor is planned once the web
app has shipped. Do not extend the deviations, and do not patch around them piecemeal.

- No `screens/`. The page under `app/admin/(panel)/` does the composition, and ten of them hold their own
  query params in `useState` rather than in a `use-*-screen` hook.
- No server gating. Every admin page is `"use client"` and nothing reads a cookie on the server, so the shell
  prerenders at build time and anyone can fetch it. The backend is the real gate; the client guards are
  cosmetic.
- Admin-only modules live in shared roots: `components/app-sidebar.tsx`, `components/auth-guard.tsx`,
  `components/rbac/` and `lib/nav.ts` all belong under `features/admin/`.
- The panel has its own session cookie (`snacc_admin_token`) and login, separate from the app's.
