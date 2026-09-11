import type {CartQueryDataReturn, HydrogenContext} from '@shopify/hydrogen';
import {CUSTOMER_TAGS_QUERY} from '~/graphql/customer-account/CustomerTagsQuery';
import {B2B} from '~/lib/b2b';

type Ctx = Pick<HydrogenContext, 'customerAccount' | 'session' | 'cart'>;

/**
 * Whether the current visitor is a signed-in `b2b`-tagged customer. The tag
 * lookup is one Customer Account API call, cached in the session for the life
 * of the login (cleared on logout and on the next sign-in).
 */
export async function isB2B({customerAccount, session}: Ctx): Promise<boolean> {
  if (!(await customerAccount.isLoggedIn())) return false;
  const cached = session.get('b2b') as boolean | undefined;
  if (typeof cached === 'boolean') return cached;
  // Never let a Customer Account API hiccup take the whole page down (this
  // runs in the root loader): an unreadable tag list is simply "not B2B".
  const b2b = await customerAccount
    .query(CUSTOMER_TAGS_QUERY)
    .then(({data}) => Boolean(data?.customer?.tags?.includes(B2B.tag)))
    .catch(() => false);
  session.set('b2b', b2b);
  return b2b;
}

/**
 * Runs after every cart mutation: for a B2B customer, make sure the cart is
 * tied to their login (so Shopify can check discount eligibility) and carries
 * the B2B code. Both are no-ops once set, so this costs nothing on repeat.
 */
export async function applyB2BToCart(
  ctx: Ctx,
  result: CartQueryDataReturn,
): Promise<CartQueryDataReturn> {
  const cart = result?.cart;
  if (!cart || !(await isB2B(ctx))) return result;

  if (!cart.buyerIdentity?.customer) {
    const customerAccessToken = await ctx.customerAccount.getAccessToken();
    if (customerAccessToken) {
      result = await ctx.cart.updateBuyerIdentity({customerAccessToken});
    }
  }
  const codes = cart.discountCodes?.map((d) => d.code) ?? [];
  if (!codes.some((c) => c.toUpperCase() === B2B.code)) {
    result = await ctx.cart.updateDiscountCodes([...codes, B2B.code]);
  }
  return result;
}
