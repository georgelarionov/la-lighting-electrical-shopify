import {useRouteLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';

/**
 * B2B pricing, the Basic-plan way (no Shopify Plus, so no companies/catalogs):
 *
 *  1. The merchant tags a customer `b2b` in admin (Customers → Tags).
 *  2. Admin holds a discount code `B2B` — 20% off all products — that only the
 *     "B2B customers" segment (`customer_tags CONTAINS 'b2b'`) may use.
 *  3. Once that customer signs in, the storefront shows the discounted price
 *     everywhere and quietly keeps the code on the cart, so checkout matches.
 *
 * ponytail: PERCENT must equal the discount's percentage in admin (Discounts →
 * "B2B pricing"). Shopify's number is the one that gets charged; this one only
 * draws the preview on product pages.
 */
export const B2B = {
  tag: 'b2b',
  code: 'B2B',
  percent: 20,
} as const;

export function b2bAmount(amount: number) {
  return Math.round(amount * (1 - B2B.percent / 100) * 100) / 100;
}

export function b2bMoney<T extends {amount: string}>(money: T): T {
  return {...money, amount: String(b2bAmount(Number(money.amount)))};
}

/** True when the signed-in customer carries the `b2b` tag (root loader). */
export function useB2B(): boolean {
  return Boolean(useRouteLoaderData<RootLoader>('root')?.b2b);
}

/**
 * `<Money>` that shows the B2B price to a B2B customer, list price struck
 * through beside it. Everyone else sees plain `<Money>`.
 */
export function B2BMoney({data}: {data: MoneyV2}) {
  const b2b = useB2B();
  if (!b2b) return <Money data={data} />;
  return (
    <>
      <Money data={b2bMoney(data)} />{' '}
      <s className="font-normal opacity-60">
        <Money data={data} />
      </s>
    </>
  );
}
