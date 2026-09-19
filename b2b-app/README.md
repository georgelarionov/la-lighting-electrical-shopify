# la-lighting-b2b

Shopify app (extension-only, no server) that powers B2B pricing for the
Hydrogen storefront in the parent folder. See the "B2B pricing" section of the
root `CLAUDE.md` for the full model.

- `extensions/b2b-pricing` — discount function. Per cart line it applies, in
  this order: the variant's `custom.b2b_prices` entry for the customer ID, else
  for the customer's group (fixed price or `"30%"`); else the customer's
  `custom.b2b_discount` percent; else the percent of the customer's
  `custom.b2b_group` from the shop's `custom.b2b_groups` JSON. Signed-out or
  unmatched = retail. `b2bRule` is mirrored in `app/lib/b2b.tsx` — keep in sync.
- `extensions/b2b-pricing-settings` — the block shown on the discount page in
  admin (static explainer of where each setting is edited).

```bash
nvm use 22
npm install
shopify app build
(cd extensions/b2b-pricing && npm run typegen)   # after editing the input query
(cd extensions/b2b-pricing && npx vitest run)    # fixture tests (tests/fixtures/*.json)
shopify app deploy --allow-updates               # release to the store
```

The store is a live (non-dev) store, so `shopify app dev` cannot be used
against it; install via Dev Dashboard → Distribution → custom install link.
