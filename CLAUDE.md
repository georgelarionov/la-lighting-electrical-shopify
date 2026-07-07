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

**Homepage** (`app/routes/_index.tsx`) composes section components from `app/components/sections/*` — it is a 1:1 port of the Pencil design in `design/design.pen` (the source of truth; `HANDOFF.md` is the port plan). Catalog + Blog are data-driven from the `_index` loader; other sections are static. Marketing copy/nav/contact live in `app/lib/site.ts`; form validators in `app/lib/home-forms.ts` (the quote form posts to the `_index` action; newsletter + referral post to the `app/routes/api.subscribe.tsx` resource route). **Imagery is self-hosted** in `app/assets/*.jpg`, imported via `?url` and rendered with plain `<img>` (same-origin — no CSP change needed). Real Shopify product/collection/article images load from `cdn.shopify.com` via Hydrogen `<Image>`; arbitrary external image hosts are blocked by the CSP in `app/entry.server.tsx`.

**Redesign 2026 (`design/redesign-2026/`)** — the **Tesla-style** direction (white/achromatic + accent blue `#3e6ae1`, Inter, **no serif**, 4/8px radii) has since been **ported** to live routes (PDP, catalog, services, lighting-design calculator, content pages). Its MagicPath mockups + content pack live here (see its `README.md`); mockup imagery is self-hosted in `app/assets/mp/`. The Catalog and PDP are now **data-driven from live Shopify** — see **Shopify data** below.

**Key config files (do not casually change):** `vite.config.ts` (the `hydrogen()`, `oxygen()`, `reactRouter()` plugins — removing/reordering them breaks the Oxygen target), `react-router.config.ts` (`hydrogenPreset()`).

## GraphQL — never guess fields

The Storefront and Customer Account APIs change often; do not hand-write GraphQL fields or query shapes from memory. Workflow: write/edit the query → `npm run codegen` → use the **generated** types → confirm `typecheck` passes. `.graphqlrc.ts` defines two codegen projects:

- `storefront` (Storefront API): documents in repo root + `app/**`, excluding `app/graphql/**`. Output: `storefrontapi.generated.d.ts`.
- `customer` (Customer Account API): documents in `app/graphql/customer-account/*`. Output: `customer-accountapi.generated.d.ts`.

The Shopify MCP "AI Toolkit" tools (`validate_graphql_codeblocks`, `search_docs_chunks`) are available to validate queries against the live schema.

## Shopify data — catalog, PDP content & Admin access

**Catalog** (`app/routes/collections._index.tsx`) is data-driven: a Storefront `products` query supplies the grid, and the filter facets are derived in the loader — category = `productType`, CCT/finish = variant option values, price from `priceRange` — with **no hardcoded product list**. The Storefront API only returns products that are **ACTIVE and published to this storefront's sales channel**, so status filtering is the platform's job (no app-level guard). That channel is the publication named **"Main Store"** (`gid://shopify/Publication/251973795863`), **not** the confusingly-named "…Headless" one — to surface a product on the site, `publishablePublish` it to Main Store.

**PDP** (`app/routes/products.$handle.tsx`) is content-manager-editable via **`custom`-namespace metafields + metaobjects**. Every marketing section reads from a metafield and **hides when empty** (an un-authored product shows only the buy box + the four globally-shared blocks — three purchase tiers, lighting-design service, reviews, final CTA — which stay hardcoded; it never shows another product's copy). Model:
- Scalars: `custom.eyebrow`, `custom.subtitle`, `custom.highlights` (list text), `custom.cross_sell` (`list.product_reference`), `custom.downloads` (`list.file_reference`).
- Repeatable blocks are metaobjects, referenced by `list.metaobject_reference` metafields: `custom.features`→`pdp_feature` (image/heading/body), `custom.feature_cards`→`pdp_feature_card` (icon/heading/body), `custom.specs`→`pdp_spec` (label/value), `custom.faqs`→`pdp_faq` (question/answer). All defs are Storefront `PUBLIC_READ`. Gallery = native `product.images`; title/description = native fields.

**Admin API access** (for catalog/PDP data ops) is via Shopify CLI: `shopify store execute -s 7c20fd-dq.myshopify.com` (one-time interactive `shopify store auth --scopes …`; add `--allow-mutations` to write). There is **no** Shopify Admin MCP tool connected. The CLI token acts as an **app**, with two non-obvious limits:
1. It **cannot create metaobject *definitions*** (bare merchant types are reserved → `NOT_AUTHORIZED`) and cannot even list them. Those are created by the merchant in **Admin UI** (Settings → Custom data → Metaobjects). But the token **can** create metaobject **entries** (`metaobjectUpsert`) and reference them — so bulk content-seeding is scriptable.
2. Creating a `custom`-namespace metafield definition must **omit `access.admin`** (Shopify defaults it to `PUBLIC_READ_WRITE`, which is required; setting it explicitly errors) — pass only `access:{storefront:PUBLIC_READ}`. Pin new defs (`metafieldDefinitionPin`) or they only show under "View all" on the product editor page.

## Imports (Cursor rule, enforced)

This is React Router 7, not Remix. Import routing primitives (`useLoaderData`, `Link`, `Form`, `useNavigation`, etc.) from **`react-router`**. Never import from `@remix-run/*`, and **never from `react-router-dom`**. Replace `@remix-run/dev` → `@react-router/dev`, `@remix-run/fs-routes` → `@react-router/fs-routes`, etc. Match the patterns already in the code.

## Styling (Tailwind v4 + shadcn)

Three stylesheets load via `?url` in the `app/root.tsx` `Layout` (order: `reset` → `app` → `tailwind`): `app/styles/reset.css` (minimal), `app/styles/app.css` (skeleton-route rules: cart/search/account), `app/styles/tailwind.css` (the design system).

**Use the design system, don't inline raw values.** `tailwind.css` defines the brand tokens and type roles in `@theme`/`@layer components`: one action color **Action Blue `#0066cc`** (`text-primary`/`bg-primary`); `text-ink`/`ink-muted`/`ink-subtle`; surfaces `bg-canvas`/`bg-parchment`/`bg-tile`/`bg-tile-deep`; `border-hairline`; **radius 2px everywhere** (`rounded-sm/md/lg/xl` are all pinned to 2px); `brand-green` **only** for the Licensed badge. Type roles `.type-hero .type-display .type-display-sm .type-lead .type-body .type-caption …` and layout helpers `.container-page .container-narrow .section-y` — prefer these over ad-hoc font sizes. shadcn primitives live in `app/components/ui/`; merge classes with `cn()` from `app/lib/utils.ts`.

**Cascade gotcha (this WILL bite you).** In Tailwind v4 an **unlayered** rule beats any `@layer` rule regardless of specificity. The design system is in `@layer components`, so a bare element selector like `h1 { font-size: 1.6rem }` in reset/app.css silently overrides `.type-hero` and collapses the whole layout. **Any global element CSS MUST go inside `@layer base`.** Tailwind's preflight already handles the modern reset, so reset.css is intentionally tiny — don't reintroduce unlayered `h1/h2/p/input/img` rules.

## Runtime constraints (workerd, not Node)

No Node-only APIs in app/server code (`fs`, `path`, runtime `process.env`, Node `Buffer`-isms). Use Web-standard APIs (`fetch`, Web Crypto, Streams). The `process.env.NODE_ENV` read in `server.ts` is a build-time value Hydrogen injects — it is not a license to read runtime config from `process.env`. Do not eject or replace the Hydrogen/Oxygen React Router adapter; ask before changing `vite.config.ts` presets, the deploy target, or adding dependencies.

## Deploy (push-to-deploy is active)

`.github/workflows/oxygen-deployment-1000143265.yml` runs `on: push` → `npm ci` → `npx shopify hydrogen deploy`, using the repo secret `OXYGEN_DEPLOYMENT_TOKEN_1000143265`. **Push to `main` → Production; any other branch → Preview.** So normal deploys are just `git push`.

Manual CLI deploys (from a Node-22 shell, project linked via `npx shopify hydrogen link`): `npx shopify hydrogen deploy --preview` is non-interactive; deploying Production interactively (`--env production`) prompts "Continue?"; headless Production needs `CI=1 npx shopify hydrogen deploy --token <OXYGEN_TOKEN>` (CI picks the env by branch and cannot take `--env`).

**Gotcha:** the Oxygen `*.o2.myshopify.dev` Preview and Production URLs redirect unauthenticated requests to `accounts.shopify.com/oauth` (HTTP 429) because the store has storefront password protection — this is **not** a failed deploy. Verify content logged into Shopify in a browser, or with a deploy `--auth-bypass-token`.
