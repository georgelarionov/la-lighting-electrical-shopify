# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A Shopify **Hydrogen** storefront (calendar release `2026.4.2`) deployed on **Shopify Oxygen**. It runs on the **Cloudflare `workerd`** runtime, is built on **React Router 7** (not Remix), and uses GraphQL codegen as the primary correctness guard.

## Toolchain (read first — non-obvious)

- **Node 22 is required** (`package.json` `engines: ^22 || ^24`; pinned in `.nvmrc`). The login shell may default to an older Node that this skeleton, Vite 8, and the Shopify CLI no longer support — run `nvm use` (or otherwise activate Node 22) before any command. The README's "Node 18+" is stale; ignore it.
- **npm only.** There must be exactly one lockfile: `package-lock.json`. If a `bun.lock`/`yarn.lock`/`pnpm-lock.yaml` ever appears, delete it. CI installs with `npm ci`.

## Commands

```bash
npm run dev        # MiniOxygen dev server on localhost:3000 (+ codegen in watch).
                   # Also serves /graphiql and /subrequest-profiler for debugging.
npm run build      # Production build to dist/ (Oxygen worker + client assets).
npm run typecheck  # react-router typegen && tsc --noEmit — the main bug guard.
npm run codegen    # Regenerate GraphQL types; run after editing ANY query.
npm run lint       # ESLint.
npm run preview    # Build, then run the built worker locally.
```

There is no test suite in this project — do not invent a test command.

A change is "done" only when `codegen`, `typecheck`, and `build` all pass and `dev` boots clean.

## Architecture

**Request flow (worker entry → React Router).** `server.ts` exports a `fetch` handler (workerd module format). Per request it calls `createHydrogenRouterContext` (`app/lib/context.ts`), then `createRequestHandler` from `@shopify/hydrogen`, which delegates routing/rendering to React Router. On a 404 it falls through to `storefrontRedirect` (Shopify URL redirects). The session cookie is committed on the response when `session.isPending`.

**Context = data clients.** `app/lib/context.ts` calls `createHydrogenContext({env, request, cache, waitUntil, session, i18n, cart})`, exposing `storefront`, `customerAccount`, and `cart` clients on every loader/action `context`. Add CMS / 3P SDK clients via the `additionalContext` object there (it is type-merged into `HydrogenAdditionalContext`).

**Env vars** are typed as `Env` and come from the **Oxygen context at runtime** — never `process.env` for app config. Locally they load from the gitignored `.env` (keys documented in `.env.example`): `SESSION_SECRET`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `PRIVATE_STOREFRONT_API_TOKEN`, `PUBLIC_STOREFRONT_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_URL`.

**Routing** is file-based: `app/routes.ts` wraps `flatRoutes()` in `hydrogenRoutes(...)`; route modules live in `app/routes/`. Add manual routes to the array in `app/routes.ts`.

**Session:** `app/lib/session.ts` — a cookie-based `AppSession` implementing `HydrogenSession`.

**Key config files (do not casually change):** `vite.config.ts` (the `hydrogen()`, `oxygen()`, `reactRouter()` plugins — removing/reordering them breaks the Oxygen target), `react-router.config.ts` (`hydrogenPreset()`).

## GraphQL — never guess fields

The Storefront and Customer Account APIs change often; do not hand-write GraphQL fields or query shapes from memory. Workflow: write/edit the query → `npm run codegen` → use the **generated** types → confirm `typecheck` passes. `.graphqlrc.ts` defines two codegen projects:

- `storefront` (Storefront API): documents in repo root + `app/**`, excluding `app/graphql/**`. Output: `storefrontapi.generated.d.ts`.
- `customer` (Customer Account API): documents in `app/graphql/customer-account/*`. Output: `customer-accountapi.generated.d.ts`.

The Shopify MCP "AI Toolkit" tools (`validate_graphql_codeblocks`, `search_docs_chunks`) are available to validate queries against the live schema.

## Imports (Cursor rule, enforced)

This is React Router 7, not Remix. Import routing primitives (`useLoaderData`, `Link`, `Form`, `useNavigation`, etc.) from **`react-router`**. Never import from `@remix-run/*`, and **never from `react-router-dom`**. Replace `@remix-run/dev` → `@react-router/dev`, `@remix-run/fs-routes` → `@react-router/fs-routes`, etc. Match the patterns already in the code.

## Runtime constraints (workerd, not Node)

No Node-only APIs in app/server code (`fs`, `path`, runtime `process.env`, Node `Buffer`-isms). Use Web-standard APIs (`fetch`, Web Crypto, Streams). The `process.env.NODE_ENV` read in `server.ts` is a build-time value Hydrogen injects — it is not a license to read runtime config from `process.env`. Do not eject or replace the Hydrogen/Oxygen React Router adapter; ask before changing `vite.config.ts` presets, the deploy target, or adding dependencies.

## Deploy (push-to-deploy is active)

`.github/workflows/oxygen-deployment-1000143265.yml` runs `on: push` → `npm ci` → `npx shopify hydrogen deploy`, using the repo secret `OXYGEN_DEPLOYMENT_TOKEN_1000143265`. **Push to `main` → Production; any other branch → Preview.** So normal deploys are just `git push`.

Manual CLI deploys (from a Node-22 shell, project linked via `npx shopify hydrogen link`): `npx shopify hydrogen deploy --preview` is non-interactive; deploying Production interactively (`--env production`) prompts "Continue?"; headless Production needs `CI=1 npx shopify hydrogen deploy --token <OXYGEN_TOKEN>` (CI picks the env by branch and cannot take `--env`).

**Gotcha:** the Oxygen `*.o2.myshopify.dev` Preview and Production URLs redirect unauthenticated requests to `accounts.shopify.com/oauth` (HTTP 429) because the store has storefront password protection — this is **not** a failed deploy. Verify content logged into Shopify in a browser, or with a deploy `--auth-bypass-token`.
