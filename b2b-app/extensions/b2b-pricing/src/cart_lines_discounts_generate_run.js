import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * B2B pricing: a signed-in customer whose `custom.b2b_discount` metafield is
 * N (1-100) gets N% off every cart line. Nothing else — no tiers table, no
 * codes: the number on the customer *is* the segment.
 *
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const percent = Number(
    input.cart.buyerIdentity?.customer?.metafield?.value ?? 0,
  );
  if (
    !(percent > 0 && percent <= 100) ||
    !input.cart.lines.length ||
    !input.discount.discountClasses.includes(DiscountClass.Product)
  ) {
    return {operations: []};
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy: ProductDiscountSelectionStrategy.All,
          candidates: [
            {
              message: `B2B pricing (${percent}% off)`,
              targets: input.cart.lines.map((line) => ({
                cartLine: {id: line.id},
              })),
              value: {percentage: {value: percent}},
            },
          ],
        },
      },
    ],
  };
}
