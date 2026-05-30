# HANDOFF — port the Pencil homepage into Hydrogen code, 1:1

**Mission:** make the coded homepage match the finalized Pencil design **exactly**
("точь в точь"), desktop + mobile. The Pencil file is the source of truth; the
code is currently ~80% there and needs the alignment listed in §6.

---

## 1. Sources of truth

| What | Where |
|---|---|
| **Design (truth)** | `design/design.pen` — open in Pencil MCP. Two screens: `Home / Desktop` (node `Xqxzw`), `Home / Mobile` (node `w61XOy`). |
| Aesthetic spec | `DESIGN.md` (Apple analysis), `PRODUCT.md` (brand/register). |
| Real logo | `assets/black-logo.svg` → copied to `app/assets/logo.svg` (used by `app/components/Logo.tsx`). Header + footer use the real SVG. **Never** the text "LALE". |
| Repo guide | `CLAUDE.md` (toolchain, deploy, runtime constraints). |

To inspect Pencil from a fresh session (Pencil MCP):
1. `get_editor_state({include_schema:true})` first (loads schema).
2. Read structure: `batch_get({filePath:"design/design.pen", nodeIds:["Xqxzw"], readDepth:1})`.
3. Visual ref: `get_screenshot({filePath:"design/design.pen", nodeId:"<section id>"})`.
   ⚠️ `export_nodes` was glitchy with path mismatch; prefer `get_screenshot`.

---

## 2. Toolchain (must)

- **Node 22**: `source ~/.nvm/nvm.sh && nvm use 22` before EVERY npm/npx. Login shell defaults to Node 20.
- **npm only**, single `package-lock.json`.
- Green gate (run all): `npm run codegen && npm run typecheck && npm run build`. Dev: `npm run dev` → http://localhost:3000.
- **"localhost looks old" = browser cache.** Hard-refresh (Cmd+Shift+R). The dev server serves fresh content (verify with `curl -s localhost:3000 | grep "Refer a project"`).
- Verify SSR without a browser: `curl -s localhost:3000/ | grep -F "<copy>"`. Forms on the index route post to `/?index` (RR7 index-route quirk); resource route is `/api/subscribe`.

---

## 3. Design tokens (already in `app/styles/tailwind.css`)

- **Action Blue `#0066cc`** — the ONLY interactive color (links, primary buttons, focus). Focus `#0071e3`. `--color-sky #2997ff` for links on dark tiles.
- ink `#1d1d1f` (`text-ink`), `text-ink-muted`, `text-ink-subtle`; parchment `#f5f5f7` (`bg-parchment`); dark tile `#272729` (`bg-tile-1`/`bg-tile`); `bg-tile-deep #1d1d1f`; `border-hairline`, `border-hairline-soft`.
- **brand-green `#22c55e`** — ONLY for the "Licensed & Insured" badge. Never elsewhere.
- **Radius = 2px everywhere** (`rounded-[2px]`, and `rounded-sm/md/lg/xl` are all pinned to 2px); full-bleed tiles use `rounded-none`.
- Font: system-first Apple stack (`--font-sans`: SF Pro → Inter fallback). Pencil renders Inter.
- Layout utilities: `.container-page` (max 1440, responsive px), `.container-narrow` (980), `.section-y` (py-16/20/24).
- Type roles (use these, never inline sizes): `.type-hero .type-display .type-display-sm .type-lead .type-tagline .type-body .type-body-strong .type-caption .type-caption-strong .type-fine`. `.type-eyebrow` exists but **do not use** (see §5). `.glass`/`.glass-dark`, `shadow-product`.
- shadcn primitives in `app/components/ui/`: button, card, input, textarea, label, checkbox, badge, separator, sheet.

---

## 4. Aesthetic rules (Apple + impeccable) — keep enforcing

- **No per-section eyebrows** (the tiny uppercase "CATALOG"/"SERVICES" kicker is an AI tell and not Apple). Lead with a big headline + one-line tagline + blue "… ›" text links.
- Alternating light ↔ dark full-bleed tiles; the color change is the divider.
- One blue action color; green only for the trust badge.
- **No em-dashes, no marketing buzzwords.** Buttons = verb + object.
- Real imagery, never gray blocks, where assets exist (see §7).

---

## 5. Target page order (Pencil desktop)

`Utility bar → Global nav → Hero → Trust strip → Catalog → Services (DARK) → Two-up → Projects → Promise → Quote → Blog → Offer (dark) → Footer`

The mobile screen (`w61XOy`) is the same content stacked for 390px; the code is
responsive, so matching desktop + checking breakpoints covers mobile.

---

## 6. EXACT alignment work (the actual TODO)

Status legend: ✅ done & matches Pencil · 🔧 needs change.

### ✅ Already done & matching Pencil
- **Header** (`app/components/Header.tsx`): black utility bar (phone / hours / address / "Licensed C-10 electrical contractor"), frosted nav, **real logo centered**, blue "Request a Quote" button, search/account/cart icons, mobile hamburger → `Aside` slide-over.
- **Trust strip** (`sections/TrustStrip.tsx`): `C-10 Licensed · Fully Insured · 4.9 ★ · 320 reviews · 1,000+ installations · Same-week quotes`.
- **Promise** (`sections/Promise.tsx`, exports `PromiseSection`): "Why specifiers work with us" + 4 ruled rows.
- **Offer** (`sections/Offer.tsx`): dark "Refer a project, earn $250." + email + "Share the offer", CSS glow orbs, posts to `/api/subscribe` (intent=referral).
- **Footer** (`app/components/Footer.tsx`): warm gradient banner → newsletter (global, `useFetcher`→`/api/subscribe`, intent=newsletter) + "Back to top" → columns (Marina Del Rey location / Shop / Company / Connect) → **big real-logo lockup** + Licensed badge → legal. ✅ matches Pencil intent (Pencil's giant "LALE®" is replaced by the real logo lockup — correct).
- **Forms wiring**: `app/routes/api.subscribe.tsx` (resource route, `validateEmail`); quote on `_index` action (`validateQuote`). Both verified. `app/lib/home-forms.ts` holds validators/types. TODO in code: wire validated payloads to ESP/CRM.

### 🔧 Needs alignment to Pencil (do these)

**Hero** — `sections/Hero.tsx`. Currently LEFT-aligned "Electrical Services You can Count On" with image on the right + two buttons + a "Licensed · Insured · Certified" eyebrow. **Replace with the Pencil centered Apple hero:**
- bg white (`bg-canvas`), centered stack, generous top padding, full-bleed image BELOW.
- H1 `.type-hero`: **"Light is the detail people remember."**
- Tagline `.type-lead` (centered, max ~640): **"Spec-grade architectural lighting and licensed electrical work, designed and installed in Los Angeles."**
- Two **blue text links** (not buttons), centered, with a `ChevronRight` icon: **"Explore the catalog ›"** → `/collections`, **"Request a quote ›"** → `/#quote`.
- Remove the Zap eyebrow.
- Image: full-bleed `PlaceholderImage` (or real asset per §7), `aspect-[21/9]`-ish.

**Catalog** — `sections/CatalogSlider.tsx`. Keep it **data-driven** (real Storefront `collections` — already loaded in `_index` loader; don't hardcode categories). Just align chrome:
- Remove the `.type-eyebrow` "Catalog".
- H2: "Browse the catalog" → **"Shop the catalog"**; add sub `.type-body` text-ink-muted: **"Fixtures specified by architects, in stock and ready to ship."**
- Keep "View all ›" → `/collections`, 4:5 cards, horizontal scroll-snap, arrow buttons.
- (Pencil shows static names Recessed/Linear systems/Pendants/Wall & sconces/Outdoor/Controls — those are placeholders; real collection titles are better. If the client insists on those exact labels, hardcode them, else keep real data.)

**Services** — `sections/Services.tsx`. Currently the "Our services" grid (Lighting Design + Service #2–#6, image-3 layout). **Replace with the Pencil DARK full-bleed tile:**
- `<section id="services" className="scroll-mt-24 dark bg-tile text-white">`, centered text, full-bleed dark image below (`bg-[#2f2f31]` placeholder or real).
- H2 `.type-display` white: **"Lighting design, handled end to end."**
- Tagline (centered, `text-body-muted`/white-muted): **"Photometric layouts, Title 24 compliance, and a licensed crew that installs what we draw."**
- Link (sky `text-sky`): **"See our services ›"**.
- Remove the eyebrow and the COMPACT #3–#6 grid.

**Two-up** — NEW `sections/TwoUp.tsx`, add to `_index` right after `<Services/>`. Two half-width full-bleed tiles in a 2-col grid (stack on mobile), each = centered title + one line + blue "… ›" link + full-bleed image below:
- Left (bg parchment): **"Custom fabrication"** / "Shapes, lengths, and finishes built to your drawing." / link **"Start a custom build ›"**.
- Right (bg canvas): **"Trade & spec accounts"** / "Pricing, lead times, and submittal packages for the trade." / link **"Open an account ›"**.

**Projects** — `sections/Projects.tsx`. Remove eyebrow. H2: "Latest projects" → **"Recent work"**; add sub: **"A few rooms we relit across Los Angeles, from private homes to storefronts."**; add header link **"View all projects ›"**. 3 placeholder cards (image + tag chips + title + "View project ›"), data:
1. tags `Los Angeles · Private Residence · 2024` — **"Ambient lighting for compact interiors"** (blue-tone image)
2. tags `Santa Monica · Retail · 2023` — **"Storefront relight on a tight footprint"** (dark image)
3. tags `Beverly Hills · Hospitality · 2023` — **"Layered lighting for an evening room"** (parchment image)

**Quote** — `sections/QuoteCta.tsx`. Remove eyebrow. H2: "Request a Quote" → **"Tell us about your space."**; tagline (NO em-dash): **"Send the details and get a clear, no-obligation estimate, usually within one business day."** Keep dark tile, white form card, fields (Full name / Email / Phone (optional) / Project details / consent), submit "Request a quote", and the left Call/Email sky links. Posts to `_index` action (intent=quote).

**Blog** — `sections/BlogPosts.tsx`. Keep **data-driven** (real `articles` from `_index` loader, fallback list). Remove eyebrow. H2: "Latest Blog Posts" → **"From the journal"**; add sub: **"Notes on lighting, energy, and getting a room to feel right."**; header link **"Read the blog ›"** → `/blogs`. 3 cards: image + title + excerpt + author row (avatar initials + name + "Author") + "Learn more ›".

**Sweep:** grep for `.type-eyebrow` across `app/components/sections/*` and remove every usage (Catalog/Services/Projects/Blog still have them).

---

## 7. Imagery decision (open)

Pencil used Unsplash stock (Pencil `Generate`). **Code cannot fetch arbitrary
external images** (Hydrogen CSP in `app/entry.server.tsx`). Current code uses
`sections/PlaceholderImage.tsx` (parchment/dark/blue blocks) + footer warm
gradient + offer CSS glow orbs. Shopify product/collection/article images
(`cdn.shopify.com`) DO load (catalog + blog real images already work).

Pick one before "pixel-perfect": (a) keep tasteful placeholders; (b) self-host
chosen photos in `app/assets/` and import; (c) extend `createContentSecurityPolicy`
in `entry.server.tsx` (`img-src`/`connect-src`) to allow one image host. Ask the client.

---

## 8. Pencil MCP gotchas (only if editing `design.pen`)

- **Never** call `Generate` (image) in the same `batch_design` that creates the nodes — it corrupts that subtree's render. Create nodes first; `Generate` in a separate batch on existing node IDs.
- Freshly created nodes have a **render-settle lag**: an immediate per-node `get_screenshot` returns blank; the full-screen render settles. Verify on the screen node (`Xqxzw`/`w61XOy`), not the just-made child.
- Schema limits: text nodes can't take `padding` (wrap in a frame); `alignItems` only `start|center|end`; no `%`/`vw` sizes; a `fit_content` parent with a `fill_container` child on the same axis collapses (give one a fixed size).
- `batch_design` globals don't persist across calls — reference returned node IDs.
- The editor's reported active-file path can be stale; pass the explicit `filePath: design/design.pen`.

---

## 9. Status / housekeeping

- Branch: `main` (nothing committed for this work yet — **branch before committing**). Commit message co-author trailer per repo convention.
- A `npm run dev` may still be running in the background on :3000 from the prior session; restart if unsure.
- After alignment: re-run the green gate, `curl` the homepage for each new headline, hard-refresh the browser, then check mobile widths (≤390 / 834) match the Pencil mobile screen.
