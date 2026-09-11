# la-lighting-b2b

Shopify app (extension-only, no server) that powers B2B pricing for the
Hydrogen storefront in the parent folder. See the "B2B pricing" section of the
root `CLAUDE.md` for the full model.

- `extensions/b2b-pricing` — discount function: reads the signed-in customer's
  `custom.b2b_discount` percent off the cart and discounts every line by it.
- `extensions/b2b-pricing-settings` — the block shown on the discount page in
  admin (static explainer; there is nothing to configure).

```bash
nvm use 22
npm install
shopify app build
(cd extensions/b2b-pricing && npx vitest run)   # fixture tests
shopify app deploy --allow-updates              # release to the store
```

The store is a live (non-dev) store, so `shopify app dev` cannot be used
against it; install via Dev Dashboard → Distribution → custom install link.
