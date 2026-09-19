import type {CartQueryDataReturn, HydrogenContext} from '@shopify/hydrogen';
import {CUSTOMER_B2B_QUERY} from '~/graphql/customer-account/CustomerB2BQuery';
import {asObject, pct, type B2B} from '~/lib/b2b';

type Ctx = Pick<HydrogenContext, 'customerAccount' | 'session' | 'cart' | 'storefront'>;

/** What the Customer Account API says about the customer, cached per login. */
type Who = {id: string; group: string | null; discount: number};

/**
 * The signed-in customer's B2B identity (null when signed out). The customer
 * read is one Customer Account API call per login, cached in the session
 * (cleared on logout and on the next sign-in, see account_.authorize); the
 * group → percent registry is a short-cached Storefront read so a merchant's
 * edit to it shows up without a re-login.
 */
export async function getB2B({customerAccount, session, storefront}: Ctx): Promise<B2B | null> {
  if (!(await customerAccount.isLoggedIn())) return null;
  let who = session.get('b2b') as Who | number | undefined;
  if (!who || typeof who !== 'object') {
    // Never let a Customer Account API hiccup take the whole page down (this
    // runs in the root loader): an unreadable customer is simply "retail".
    const fresh = await customerAccount
      .query(CUSTOMER_B2B_QUERY)
      .then(({data}) => data?.customer)
      .catch(() => null);
    if (!fresh) return null;
    who = {
      id: fresh.id.split('/').pop() ?? '',
      group: fresh.group?.value?.trim() || null,
      discount: pct(fresh.discount?.value),
    };
    session.set('b2b', who);
  }
  let percent = who.discount;
  if (!percent && who.group) {
    const groups = await storefront
      .query(B2B_GROUPS_QUERY, {cache: storefront.CacheShort()})
      .then((d) => asObject(d.shop.metafield?.value))
      .catch((): Record<string, unknown> => ({}));
    percent = pct(groups[who.group]);
  }
  return {id: who.id, group: who.group, pct: percent};
}

/**
 * Runs after every cart mutation: a cart started as a guest and then signed
 * in has no customer on it, so the B2B discount function (which reads the
 * customer off the cart) would see nobody. Tie it to the login; a no-op once
 * set. Hydrogen already does this for carts created after login.
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

// Group → percent off, edited by the merchant in Settings → Custom data →
// Shop → "B2B groups" (definition custom.b2b_groups, storefront PUBLIC_READ).
const B2B_GROUPS_QUERY = `#graphql
  query B2BGroups {
    shop {
      metafield(namespace: "custom", key: "b2b_groups") {
        value
      }
    }
  }
` as const;
