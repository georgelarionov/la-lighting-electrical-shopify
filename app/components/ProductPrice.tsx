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
      className="type-tagline flex items-baseline gap-2.5 text-ink"
      role="group"
    >
      {compareAtPrice ? (
        <>
          {price ? <Money data={price} /> : null}
          <s className="type-body font-normal text-ink-subtle">
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
