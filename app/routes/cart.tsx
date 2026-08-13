import {Link, useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartUpsellItemFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {CartMain} from '~/components/CartMain';
import {PageHeader} from '~/components/PageHeader';
import {COMPANY_NAME} from '~/lib/site';
import {seo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `Cart | ${COMPANY_NAME}`,
    url: location.pathname,
    noindex: true,
  });
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      // The name has no home on buyerIdentity, so it travels as a cart
      // attribute in the same request — one submit, one round trip, and the
      // returned cart already carries both.
      const customerName = formData.get('customerName');
      if (typeof customerName === 'string') {
        await cart.updateAttributes([
          {key: 'Name', value: customerName.trim()},
        ]);
      }
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart, storefront} = context;
  const cartData = await cart.get();

  // "Buy more" source, in priority order:
  //  1. the rest of the collection the first cart item belongs to — for a
  //     system-based catalog like this one, the things you actually still need
  //     (a connector, a suspension kit) live right next to what you just added;
  //  2. the merchant-curated frontpage collection, when the cart is empty or
  //     that product sits in no collection.
  // One query, one round trip; the block is never empty and never random.
  const seedHandle =
    cartData?.lines?.nodes?.[0]?.merchandise &&
    'product' in cartData.lines.nodes[0].merchandise
      ? cartData.lines.nodes[0].merchandise.product.handle
      : '';

  const upsell = await storefront
    .query(CART_UPSELL_QUERY, {
      variables: {handle: seedHandle || 'x'},
      cache: storefront.CacheShort(),
    })
    .catch(() => null);

  const inCart = new Set(
    (cartData?.lines?.nodes ?? [])
      .map((l) =>
        l.merchandise && 'product' in l.merchandise
          ? l.merchandise.product.handle
          : null,
      )
      .filter(Boolean),
  );

  const related = upsell?.product?.collections?.nodes?.[0];
  const pool = related?.products?.nodes ?? upsell?.fallback?.products?.nodes ?? [];
  const recommendations = pool
    .filter((p) => !inCart.has(p.handle) && p.selectedOrFirstAvailableVariant)
    .slice(0, 4);

  return {
    cart: cartData,
    recommendations,
    recommendationsHeading: related?.title
      ? `Goes with your ${related.title.toLowerCase()}`
      : 'Popular right now',
  };
}

export default function Cart() {
  const {cart, recommendations, recommendationsHeading} =
    useLoaderData<typeof loader>();
  const count = cart?.totalQuantity ?? 0;

  return (
    <div className="bg-canvas">
      <PageHeader
        back={{to: '/collections', label: 'Continue shopping'}}
        title="Your cart"
        description={
          count > 0
            ? `${count} ${count === 1 ? 'item' : 'items'} — nothing is charged until checkout.`
            : undefined
        }
      />
      <div className="container-page section-y">
        <CartMain layout="page" cart={cart} />
      </div>
      <CartRecommendations
        heading={recommendationsHeading}
        products={recommendations}
      />
    </div>
  );
}

/**
 * "Buy more" — the one-click add block under the cart.
 *
 * Deliberately not a carousel and not eight cards: four items, each with the
 * price visible and an Add button that posts straight to the cart action, so
 * topping up an order never costs a page load. Items already in the cart are
 * filtered out upstream, which is what stops it suggesting the thing you are
 * currently looking at.
 */
function CartRecommendations({
  heading,
  products,
}: {
  heading: string;
  products: CartUpsellItemFragment[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="border-t border-hairline bg-parchment">
      <div className="container-page section-y">
        <h2 className="type-display-sm text-ink">{heading}</h2>
        <ul className="mt-8 grid list-none grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="flex flex-col">
              <Link
                to={`/products/${p.handle}`}
                prefetch="intent"
                className="lift group block"
              >
                <div
                  className="img-zoom relative overflow-hidden rounded-lg bg-canvas"
                  style={{aspectRatio: '1 / 1'}}
                >
                  {p.featuredImage ? (
                    <Image
                      data={p.featuredImage}
                      sizes="(min-width: 1024px) 18rem, 45vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <h3 className="mt-3 type-caption font-medium text-ink transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
              </Link>
              {/* Hydrogen's <Money> renders a div unless told otherwise, which
                  is invalid inside a <p>. */}
              <p className="mt-1 type-caption text-ink-subtle">
                <Money as="span" data={p.priceRange.minVariantPrice} />
              </p>
              <div className="mt-3">
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: p.selectedOrFirstAvailableVariant!.id,
                      quantity: 1,
                      // useOptimisticCart needs the variant itself to render
                      // the pending line; without it Hydrogen logs on every add.
                      selectedVariant: p.selectedOrFirstAvailableVariant,
                    },
                  ]}
                  disabled={!p.selectedOrFirstAvailableVariant?.availableForSale}
                  className="h-10 w-full border border-hairline bg-canvas px-4 type-caption font-medium text-ink hover:bg-parchment sm:w-full"
                >
                  {p.selectedOrFirstAvailableVariant?.availableForSale
                    ? 'Add to cart'
                    : 'Sold out'}
                </AddToCartButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const CART_UPSELL_ITEM_FRAGMENT = `#graphql
  fragment CartUpsellItem on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    # Everything CartLineItem reads off a line. useOptimisticCart renders the
    # pending line straight from this variant, so a partial selection here does
    # not degrade gracefully — it throws mid-render on the first add.
    selectedOrFirstAvailableVariant {
      id
      availableForSale
      title
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const CART_UPSELL_QUERY = `#graphql
  ${CART_UPSELL_ITEM_FRAGMENT}
  query CartUpsell($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      collections(first: 1) {
        nodes {
          title
          handle
          products(first: 12) {
            nodes {
              ...CartUpsellItem
            }
          }
        }
      }
    }
    fallback: collection(handle: "frontpage") {
      products(first: 12) {
        nodes {
          ...CartUpsellItem
        }
      }
    }
  }
` as const;
