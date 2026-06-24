# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Search Commands
- ALWAYS use `rg` instead of `grep`
- ripgrep automatically excludes node_modules and gitignored files

## Commands

```bash
npm run dev              # Vite dev server (browser)
npm run build            # tsc + vite build → dist/
npm run lint             # ESLint
npm run electron:dev     # Build then launch in Electron
npm run electron:build   # Build + package as macOS DMG → release-v2/
```

There are no tests configured.

## Architecture

Sack is a **personal finance tracker** (expenses, budgets, subscriptions) built as an Electron desktop app with a PWA fallback. Stack: React 19, TypeScript, Vite, Tailwind v4, React Router v7 (HashRouter), Radix UI, Zod + react-hook-form.

### Data layer — 100% local, no backend

All data lives in `localStorage`. The central abstraction is `src/services/local-store.ts`:

- `localStore` — generic CRUD + pub/sub (`subscribe`/`readAll`/`writeAll`/`add`/`update`/`remove`)
- `LocalTimestamp` — mimics the Firebase Timestamp API (`.toDate()`, `.seconds`, `fromDate()`, `now()`) so types/services are portable if a backend is ever added
- **Amounts are stored as integer cents** — always multiply by 100 on write, divide on display

### Service → Hook → Component flow

1. **`src/services/*.ts`** — domain operations against `localStore`. Each exposes `subscribeTo*`, `add*`, `update*`, `delete*` functions. The `_userId` parameter exists for API compatibility but is always `'local-user'`.
2. **`src/hooks/use*.ts`** — subscribe to a service and return reactive `{ data, loading }`. The subscription pattern means all open components update when any write occurs.
3. **`src/schemas/*.ts`** — Zod schemas for form validation (one per domain, used with `@hookform/resolvers/zod`).
4. **`src/types/*.ts`** — TypeScript interfaces. Dates are typed as `DateLike` (`{ toDate(): Date }`) so `LocalTimestamp` satisfies the contract.

### Contexts

- `AuthContext` — static singleton (`uid: 'local-user'`); no real auth
- `ThemeContext` — light/dark/system, persisted to `localStorage('theme')`
- `CurrencyContext` — user's display currency, persisted to `localStorage('bt_currency')`

### Electron specifics

- `HashRouter` is required because Electron loads `file://…/dist/index.html`
- `isElectron = navigator.userAgent.includes('Electron')` (in `src/lib/utils.ts`) gates the titlebar drag region and auto-update UI
- IPC bridge: `electron/main.cjs` → `electron/preload.cjs`. Main sends `update-available` / `update-downloaded` / `update-error` to the renderer; renderer sends `install-update` to main
- Auto-update uses `electron-updater` publishing to GitHub Releases (`owner: P0rtalGuys`, `repo: sacks`)

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

## Design system

See `DESIGN.md` for the full spec. Key rules enforced throughout the codebase:

- **Fonts:** Fredoka 600 for all headings (h1–h6 only); Nunito for body, labels, and button text
- **Colors:** oklch palette — deep indigo primary (`oklch(0.56 0.23 285)`), emerald accent (`oklch(0.68 0.18 163)`) for success states only, deep indigo sidebar (`oklch(0.2 0.075 285)`)
- **Gradient card-bar:** 3px top-edge `linear-gradient(90deg, indigo, emerald)` on dashboard stat cards only — not a general card style
- **Buttons:** `active:scale-95` press spring on all interactive surfaces; primary uses indigo→violet gradient
- **Amounts:** never red/green colour alone — always pair with a text label or icon
- **Elevation:** flat by default; only card ambient shadow (`shadow-sm shadow-black/8`) and button glow (`shadow-primary/30`)
