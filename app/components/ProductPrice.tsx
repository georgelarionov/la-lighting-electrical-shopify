import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div
      aria-label="Price"
      // Only ever rendered on a cart line. At the 21px display size it
      // out-shouted the product title it belongs to.
      className="type-body-strong flex items-baseline gap-2.5 text-ink"
      role="group"
    >
      {compareAtPrice ? (
        <>
          {price ? <Money data={price} /> : null}
          <s className="type-caption font-normal text-ink-subtle">
            <Money data={compareAtPrice} />
          </s>
        </>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
