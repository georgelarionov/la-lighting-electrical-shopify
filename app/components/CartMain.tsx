import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const lines = (
    <ul aria-labelledby="cart-lines" className="flex flex-col">
      {(cart?.lines?.nodes ?? []).map((line) => {
        // we do not render non-parent lines at the root of the cart
        if ('parentRelationship' in line && line.parentRelationship?.parent) {
          return null;
        }
        return (
          <CartLineItem
            key={line.id}
            line={line}
            layout={layout}
            childrenMap={childrenMap}
          />
        );
      })}
    </ul>
  );

  return (
    <section aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {cartHasItems ? (
        <div className="sr-only" id="cart-lines">
          Line items
        </div>
      ) : null}
      {cartHasItems ? (
        layout === 'page' ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
            <div>{lines}</div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummary cart={cart} layout={layout} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {lines}
            <CartSummary cart={cart} layout={layout} />
          </div>
        )
      ) : null}
    </section>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="py-6">
      <p className="type-body text-ink-muted">
        Your cart is empty. Browse the catalog to get started.
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-[2px] bg-primary px-6 type-caption-strong text-white transition-colors hover:bg-primary/90"
      >
        Continue shopping
      </Link>
    </div>
  );
}
