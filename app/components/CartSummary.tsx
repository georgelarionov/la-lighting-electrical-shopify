import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();

  return (
    <div
      aria-labelledby={summaryId}
      className="mt-8 rounded-[2px] border border-hairline bg-parchment p-6 lg:mt-0"
    >
      <h2 id={summaryId} className="type-body-strong text-ink">
        Order summary
      </h2>
      <dl
        role="group"
        className="mt-5 flex items-center justify-between border-b border-hairline pb-5 type-body text-ink"
      >
        <dt className="text-ink-muted">Subtotal</dt>
        <dd className="font-semibold">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {layout === 'page' ? (
        <CheckoutDetails cart={cart} />
      ) : (
        <div className="mt-5">
          <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
        </div>
      )}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-primary px-6 type-body-strong text-white transition-colors hover:bg-primary/90"
    >
      Continue to checkout
    </a>
  );
}

/**
 * Who is buying, collected before the handoff to Shopify checkout.
 *
 * Email and phone go onto the cart's buyerIdentity, which is Shopify's own
 * prefill mechanism — they arrive filled in at checkout. The name has no
 * buyerIdentity field (and `deliveryAddressPreferences` was deprecated in
 * 2025-01), so it rides along as a cart attribute: it reaches the merchant on
 * the order, but it does not prefill the checkout name box. Putting it behind a
 * partial delivery address would prefill it at the cost of pinning an
 * incomplete address on the cart and disturbing delivery groups.
 *
 * One submit does both and then hands off, so nothing depends on the visitor
 * blurring the last field before they click.
 */
function CheckoutDetails({
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const savedName =
    cart?.attributes?.find((a) => a.key === 'Name')?.value ?? '';
  const [name, setName] = useState(savedName);
  const [email, setEmail] = useState(cart?.buyerIdentity?.email ?? '');
  const [phone, setPhone] = useState(cart?.buyerIdentity?.phone ?? '');

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{buyerIdentity: {email: email || null, phone: phone || null}}}
    >
      {(fetcher: FetcherWithComponents<unknown>) => (
        <div className="flex flex-col gap-4 pt-5">
          <p className="type-caption-strong text-ink">Your details</p>
          {/* Read by the /cart action alongside the buyer identity, so both
              land in a single request. */}
          <input type="hidden" name="customerName" value={name} />
          <DetailField
            id={nameId}
            label="Name"
            value={name}
            onChange={setName}
            autoComplete="name"
          />
          <DetailField
            id={emailId}
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <DetailField
            id={phoneId}
            label="Phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
          />
          <CheckoutHandoff
            fetcher={fetcher}
            checkoutUrl={cart?.checkoutUrl}
          />
        </div>
      )}
    </CartForm>
  );
}

function DetailField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="type-caption text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-[2px] border border-hairline bg-canvas px-3.5 type-body text-ink outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </div>
  );
}

/**
 * Submits the details, then leaves for Shopify checkout once the cart has
 * actually been updated. A plain link would race the save; a redirect from the
 * action would be a cross-origin redirect out of a fetcher.
 */
function CheckoutHandoff({
  fetcher,
  checkoutUrl,
}: {
  fetcher: FetcherWithComponents<unknown>;
  checkoutUrl?: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const submitted = useRef(false);

  useEffect(() => {
    if (!leaving) return;
    // The click and the submission are not the same tick: on the render right
    // after the click the fetcher is still idle, and leaving then would cancel
    // the very POST we are waiting for. Only go once it has actually run.
    if (fetcher.state !== 'idle') {
      submitted.current = true;
      return;
    }
    if (submitted.current && checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [leaving, fetcher.state, checkoutUrl]);

  if (!checkoutUrl) return null;

  return (
    <button
      type="submit"
      onClick={() => setLeaving(true)}
      // Disabled by the fetcher only. Disabling on `leaving` flipped the button
      // to disabled in the same commit as the click, and the browser dropped
      // the submission it was supposed to trigger.
      disabled={fetcher.state !== 'idle'}
      className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-primary px-6 type-body-strong text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
    >
      {leaving ? 'Taking you to checkout…' : 'Continue to checkout'}
    </button>
  );
}
