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
- Allowed at the slice root only: `routes.ts` (path builders), `realtime.ts` (socket handlers), `cache/` (query-cache patchers that other slices or sockets call) and generated files.

App-wide providers live in `providers/`, shared hooks in `hooks/`, shared primitives in `components/ui/`.

## Shared rules for the public app

- Query keys: one factory per slice in `utils/keys.ts` (`snaccKeys`, `messageKeys`, …), functions returning `as const` arrays. No inline array keys anywhere else. Lists that one change must reach share a root: every list of snaccs sits under `snaccKeys.lists()`, every list of people with a Follow button under `followKeys.lists()`. A single item never sits under a prefix that a list's key also starts with.
- Cache pages: patch paged lists with `lib/query/pages.ts` (`mapItems`, `filterItems`, `prependItem`, …), never by hand.
- Feedback: `lib/feedback.tsx` (`showError`, `showSuccess`, `showUndo`, `showHeld`) and `lib/undoable.ts` (`commitWithUndo`). Features never import `toast` themselves. A mutation with no `onError` gets `showError` from the query client; one with its own `onError` (a rollback) calls `showError` itself; one whose screen shows the error inline sets `meta: { silent: true }`.
- Names: `features/users/utils/names.ts` (`nameOf`, `handleOf`, `authorNameOf`). Never write `display_name ?? username` again.
- Paths: every URL comes from a `routes.ts` builder (`lib/routes.ts` for site pages such as terms and download). Components and hooks never hand-build one.
- Per-row pending state: give the mutation a `mutationKey` and read `usePendingVariables` (`hooks/`), so two rows can be busy at once.
- Tests: vitest, next to the code as `*.test.ts(x)`. Every pure util is tested.

# The admin panel

`features/admin/*` follows the slice shape above in full: every slice has `screens/` driven by one
`use-*-screen` hook, and every page under `app/admin/(panel)/` only renders a screen. The feedback rules
above apply too. Where it differs from the public app:

- Shared admin pieces live in two slices, never in the app-wide roots. `features/admin/shell/` holds the panel
  frame and sidebar, tables, dialogs, form fields, `routes.ts`, `utils/nav.ts` and the list, draft and
  mutation hooks. `features/admin/auth/` holds `containers/can-act.tsx` and the permission and access hooks.
  Use these before writing a new table, dialog or confirm.
- Writes go through `useAdminMutation` (`shell/hooks/`). It shows the success message, refetches the keys it
  is given before it settles, and leaves failures to the query client. A slice gathers its writes in one
  `use<Thing>Actions()` hook of functions that return promises. `ConfirmAction`, `DialogForm`, `ActionButton`
  and `ActionSwitch` wait on those and show their own progress, so the panel does not use
  `usePendingVariables`.
- Paging, search and filters live in the URL through `useListParams` (`shell/hooks/`), called from the
  screen hook with a module-level map of nuqs parsers.
- Query keys: one `admin<Slice>Keys` factory per slice in `utils/keys.ts`, all under `["admin", …]`. Paths
  come from `shell/routes.ts`.
- A control that needs a permission is wrapped in `CanAct`, which disables it and says why rather than
  hiding it. Pages need no check of their own: the permission on a sidebar entry in `shell/utils/nav.ts`
  also guards its route.
- `app/admin/(panel)/layout.tsx` calls `requireAdminSession()` on the server. It uses the app's own session:
  no session goes to login, no role goes home. `PanelShell` then catches a role taken away mid-session and
  shows "Not your area" on a page the admin lacks. The backend is still the real gate.
