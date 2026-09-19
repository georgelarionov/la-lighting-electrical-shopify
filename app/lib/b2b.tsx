import {useRouteLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';

/**
 * B2B pricing, the Basic-plan way (no Shopify Plus, so no companies/catalogs).
 * Three knobs, all edited in admin, no code:
 *
 *  - Shop metafield `custom.b2b_groups` (JSON) — group → percent off everything:
 *    {"contractor": 25, "wholesale": 35}. Settings → Custom data → Shop.
 *  - Customer: `custom.b2b_group` (a key from that JSON) and/or
 *    `custom.b2b_discount` (a percent for this one customer; beats the group's).
 *  - Variant metafield `custom.b2b_prices` (JSON) — per group key or per
 *    customer ID (the number in the customer's admin URL), a fixed price
 *    (number) or a percent off (string ending in %); beats both percents:
 *    {"contractor": 12.5, "wholesale": "30%", "9588593000471": 11}
 *
 * The la-lighting-b2b app's discount function (b2b-app/) applies exactly this
 * in the cart, so checkout is Shopify's own numbers; this file only previews
 * the same price on product pages. `b2bRule` is mirrored there — keep in sync.
 */
export type B2B = {
  /** Numeric customer ID (the number in the admin URL). */
  id: string;
  group: string | null;
  /** Effective percent off list: the customer's own, else the group's, else 0. */
  pct: number;
};

type Rule = {percent: number} | {price: number};

/** A percent 0-100, or 0 for anything unparsable. */
export function pct(v: unknown): number {
  const n = parseFloat(String(v ?? ''));
  return n > 0 && n <= 100 ? n : 0;
}

/** Parses a JSON metafield value into an object, `{}` for anything else. */
export function asObject(v: unknown): Record<string, unknown> {
  try {
    const o: unknown = typeof v === 'string' ? JSON.parse(v) : v;
    return o && typeof o === 'object' && !Array.isArray(o)
      ? (o as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

/** Which price this customer gets for a variant with these `custom.b2b_prices`. */
export function b2bRule(
  prices: Record<string, unknown>,
  {id, group, pct: percent}: B2B,
): Rule | null {
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

/** Unit price for a list price and a variant's raw `custom.b2b_prices` value. */
export function b2bPrice(list: number, prices: unknown, b2b: B2B | null): number {
  const rule = b2b && b2bRule(asObject(prices), b2b);
  if (!rule) return list;
  if ('price' in rule) return Math.min(rule.price, list);
  return Math.round(list * (1 - rule.percent / 100) * 100) / 100;
}

export function b2bMoney<T extends {amount: string}>(
  money: T,
  prices: unknown,
  b2b: B2B | null,
): T {
  return {...money, amount: String(b2bPrice(Number(money.amount), prices, b2b))};
}

/** The signed-in customer's B2B identity (null when signed out). */
export function useB2B(): B2B | null {
  return useRouteLoaderData<RootLoader>('root')?.b2b ?? null;
}

/** "contractor pricing, 25% off list prices" — null when the customer is retail. */
export function b2bLabel(b2b: B2B | null): string | null {
  if (!b2b || (!b2b.group && !b2b.pct)) return null;
  return [b2b.group && `${b2b.group} pricing`, b2b.pct && `${b2b.pct}% off list prices`]
    .filter(Boolean)
    .join(', ');
}

/**
 * `<Money>` that shows the B2B price to a B2B customer, list price struck
 * through beside it. Pass the variant's `custom.b2b_prices` value when you
 * have it; without it only the customer/group percent applies.
 */
export function B2BMoney({data, prices}: {data: MoneyV2; prices?: unknown}) {
  const b2b = useB2B();
  const discounted = b2bMoney(data, prices, b2b);
  if (discounted.amount === data.amount) return <Money data={data} />;
  return (
    <>
      <Money data={discounted} />{' '}
      <s className="font-normal opacity-60">
        <Money data={data} />
      </s>
    </>
  );
}
