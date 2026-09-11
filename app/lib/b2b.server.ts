import type {CartQueryDataReturn, HydrogenContext} from '@shopify/hydrogen';
import {CUSTOMER_B2B_QUERY} from '~/graphql/customer-account/CustomerB2BQuery';

type Ctx = Pick<HydrogenContext, 'customerAccount' | 'session' | 'cart'>;

/**
 * The signed-in customer's "B2B discount %" (0 when none / signed out). One
 * Customer Account API call per login, cached in the session (cleared on
 * logout and on the next sign-in, see account_.authorize).
 */
export async function getB2BPercent({customerAccount, session}: Ctx): Promise<number> {
  if (!(await customerAccount.isLoggedIn())) return 0;
  const cached = session.get('b2b') as number | undefined;
  if (typeof cached === 'number') return cached;
  // Never let a Customer Account API hiccup take the whole page down (this
  // runs in the root loader): an unreadable field is simply "retail".
  const percent = await customerAccount
    .query(CUSTOMER_B2B_QUERY)
    .then(({data}) => Number(data?.customer?.metafield?.value ?? 0))
    .then((n) => (n > 0 && n <= 100 ? n : 0))
    .catch(() => 0);
  session.set('b2b', percent);
  return percent;
}

/**
 * Runs after every cart mutation: a cart started as a guest and then signed
 * in has no customer on it, so the B2B discount function (which reads the
 * customer's percent off the cart) would see nobody. Tie it to the login;
 * a no-op once set. Hydrogen already does this for carts created after login.
 */
export async function attachCustomerToCart(
  ctx: Ctx,
  result: CartQueryDataReturn,
): Promise<CartQueryDataReturn> {
  const cart = result?.cart;
  if (!cart || cart.buyerIdentity?.customer) return result;
  const customerAccessToken = await ctx.customerAccount.getAccessToken();
  if (!customerAccessToken) return result;
  return ctx.cart.updateBuyerIdentity({customerAccessToken});
}
