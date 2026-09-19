import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * B2B pricing. Three knobs, all edited by the merchant in admin:
 *
 *  - Shop metafield custom.b2b_groups (JSON): {"contractor": 25} — group →
 *    percent off everything.
 *  - Customer: custom.b2b_group (a key from that JSON) and/or
 *    custom.b2b_discount (this customer's own percent; beats the group's).
 *  - Variant metafield custom.b2b_prices (JSON): per group key or per
 *    customer ID (the number in the admin URL), a fixed price (number) or a
 *    percent off (string ending in %); beats both percents:
 *    {"contractor": 12.5, "wholesale": "30%", "9588593000471": 11}
 *
 * The storefront previews the same rule (app/lib/b2b.tsx, `b2bRule`) — keep
 * the two in sync.
 *
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const customer = input.cart.buyerIdentity?.customer;
  if (
    !customer ||
    !input.cart.lines.length ||
    !input.discount.discountClasses.includes(DiscountClass.Product)
  ) {
    return {operations: []};
  }

  const b2b = {
    id: customer.id.split('/').pop() ?? '',
    group: customer.group?.value?.trim() || null,
    pct: 0,
  };
  const groups = asObject(input.shop.groups?.jsonValue);
  b2b.pct = pct(customer.discount?.value) || (b2b.group ? pct(groups[b2b.group]) : 0);

  const candidates = [];
  for (const line of input.cart.lines) {
    const rule = b2bRule(asObject(line.merchandise.prices?.jsonValue), b2b);
    if (!rule) continue;
    let value;
    if ('price' in rule) {
      // A fixed B2B price is a per-unit amount off the list price; a fixed
      // price at or above list is simply "no discount" (we cannot raise it).
      const off = Number(line.cost.amountPerQuantity.amount) - rule.price;
      if (off <= 0) continue;
      value = {fixedAmount: {amount: off.toFixed(2), appliesToEachItem: true}};
    } else {
      value = {percentage: {value: rule.percent}};
    }
    candidates.push({
      message: 'B2B pricing',
      targets: [{cartLine: {id: line.id}}],
      value,
    });
  }
  if (!candidates.length) return {operations: []};

  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy: ProductDiscountSelectionStrategy.All,
          candidates,
        },
      },
    ],
  };
}

/** A percent 0-100, or 0 for anything unparsable. */
function pct(v) {
  const n = parseFloat(String(v ?? ''));
  return n > 0 && n <= 100 ? n : 0;
}

/** A JSON metafield value as an object, `{}` for anything else. */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

/**
 * Which price this customer gets for a variant with these `custom.b2b_prices`:
 * `{percent}`, `{price}` or null. Mirror of `b2bRule` in app/lib/b2b.tsx.
 */
function b2bRule(prices, {id, group, pct: percent}) {
  const r = prices[id] ?? (group ? prices[group] : undefined);
  if (typeof r === 'string' && r.trim().endsWith('%')) {
    const p = pct(r);
    return p ? {percent: p} : null;
  }
  if (r != null && r !== '' && Number.isFinite(Number(r))) {
    return {price: Number(r)};
  }
  return percent ? {percent} : null;
}
