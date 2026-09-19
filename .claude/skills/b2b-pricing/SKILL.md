---
name: b2b-pricing
description: Manage this store's B2B pricing in Shopify Admin with the bundled script — create/change price groups and their percent, put a customer in a group or give them a personal percent, set a fixed or percent B2B price on a product variant (by SKU) for a group or for one customer, and show who has what. Use it whenever the user asks for a discount, wholesale/contractor/dealer/B2B/special price for a customer, a group, or a product, wants to see or remove such pricing, or asks how to set it up in Shopify — even if they don't say "B2B", "metafield", or "скидка" in exactly those words. Requests may be in Russian.
---

# B2B pricing for this store

The store is on Shopify Basic, so B2B prices are three merchant-editable metafields
applied by a Shopify Functions discount (full model in CLAUDE.md → "B2B pricing"):

| Level | Field | Meaning |
|---|---|---|
| Shop | `custom.b2b_groups` | `{"contractor": 25}` — group key → percent off everything |
| Customer | `custom.b2b_group` | a key from that JSON |
| Customer | `custom.b2b_discount` | personal percent, **beats** the group's |
| Variant | `custom.b2b_prices` | `{"contractor": 12.5, "wholesale": "30%", "9588593000471": 11}` — per group key or customer ID: fixed price (number) or percent off (`"N%"`); **beats** both percents |

Resolution per cart line: variant entry for the customer ID → for their group →
personal percent → group percent → retail. A fixed price at or above list gives
no discount (a discount cannot raise a price). Prices are USD.

## Do it with the script, not hand-written GraphQL

`scripts/b2b.mjs` next to this file wraps `shopify store execute` (read + write,
validates inputs, prints the resulting state). Always run it under Node 22:

```bash
source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && node .claude/skills/b2b-pricing/scripts/b2b.mjs <command>
```

| Command | Does |
|---|---|
| `groups` | list groups and percents |
| `group set <key> <pct>` | add or change a group (`group set wholesale 35`) |
| `group rm <key>` | remove a group (customers keep the key, it just stops working) |
| `customer <email>` | show group / personal percent / numeric ID |
| `customer <email> group <key>` | assign a group (the group must exist) |
| `customer <email> discount <pct>` | personal whole-number percent; `0` removes it |
| `customer <email> clear` | back to retail |
| `find <text>` | products whose title matches, with every variant's SKU, list price, B2B prices |
| `variant <sku\|id>` | show one variant (`find` prints the numeric ID for variants without a SKU; use it in place of the SKU) |
| `variant <sku> set <group\|email> <price\|N%>` | `set contractor 70` fixed $70; `set wholesale 30%`; `set ivan@x.com 65` for one customer |
| `variant <sku> rm <group\|email>` | drop one entry |
| `variant <sku> clear` | drop all entries |
| `prices` | every variant that has B2B prices |

Group keys are lowercase words the merchant will type into a customer's field —
suggest `contractor`, `wholesale`, `dealer`, not spaces or Cyrillic.

## How to handle a request

1. **Resolve the target first.** Product named loosely ("Y connector, black") →
   `find connector`, pick the SKU from the output. Customer → by email; if the
   user gives a name only, ask for the email (the store has no unique name lookup).
2. **Write, then show.** Every command prints the resulting state — paste that
   back in the answer so the user sees exactly what is live now.
3. **Say what the customer will experience:** the price is applied in the cart
   and at checkout as soon as they are signed in on the site. The storefront
   caches a customer's group/percent for their login session, so a customer
   already signed in sees the new *percent* preview after re-login, while
   variant prices and group percents update immediately; checkout is always right.
4. **Don't invent structure.** No new metafields, tags, codes, or segments — the
   three fields above are the whole model. If a request does not fit (e.g. a
   quantity break, a per-collection percent), say so and offer the nearest thing
   (a per-variant price for the affected SKUs).

## Examples

- «Создай группу wholesale со скидкой 35%» → `group set wholesale 35`
- «Клиента ivan@example.com в группу contractor» → `customer ivan@example.com group contractor`
- «Ивану личная скидка 15%» → ask for the email if unknown → `customer <email> discount 15`
- «Y Connector чёрный для contractor цена 70» → `find y connector` → `variant ALS-CON-Y-BLK set contractor 70`
- «Клиенту … на SKU ALS-CON-T-WHT 65 долларов» → `variant ALS-CON-T-WHT set <email> 65`
- «Какие B2B-цены сейчас стоят?» → `groups` + `prices`
- «Убери клиента из B2B» → `customer <email> clear`

## Once, if it has never been done

The discount must exist in admin for the function to run: Admin → Discounts →
Create discount → "B2B pricing" (app la-lighting-b2b) → Save. The app is
installed via Dev Dashboard → Distribution. If prices don't apply at checkout,
check these two before anything else.
