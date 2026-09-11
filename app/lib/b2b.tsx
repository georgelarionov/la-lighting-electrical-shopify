import {useRouteLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';

/**
 * B2B pricing, the Basic-plan way (no Shopify Plus, so no companies/catalogs):
 *
 *  1. The merchant types a percent into the customer's "B2B discount %" field
 *     in admin (metafield custom.b2b_discount; 0 or empty = retail).
 *  2. The la-lighting-b2b app's discount function (b2b-app/) reads that field
 *     from the cart's signed-in customer and takes the percent off every line,
 *     so cart totals and checkout are Shopify's own numbers.
 *  3. The storefront reads the same field once per login (root loader → `b2b`)
 *     and previews the discounted price on product pages, list price struck
 *     through. No codes, no tier tables: the number on the customer is the
 *     segment.
 */
export function b2bAmount(amount: number, percent: number) {
  return Math.round(amount * (1 - percent / 100) * 100) / 100;
}

export function b2bMoney<T extends {amount: string}>(money: T, percent: number): T {
  return {...money, amount: String(b2bAmount(Number(money.amount), percent))};
}

/** The signed-in customer's B2B percent (0 when retail or signed out). */
export function useB2B(): number {
  return useRouteLoaderData<RootLoader>('root')?.b2b ?? 0;
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
      <Money data={b2bMoney(data, b2b)} />{' '}
      <s className="font-normal opacity-60">
        <Money data={data} />
      </s>
    </>
  );
}
