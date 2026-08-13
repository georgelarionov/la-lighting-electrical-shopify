import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {cn} from '~/lib/utils';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
  redirectTo,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
  /**
   * Where the /cart action should send the browser afterwards. Set it on
   * product pages so adding lands on the cart; leave it off ON the cart page —
   * redirecting to the URL you are already on skips revalidation, so the new
   * line silently never appears.
   */
  redirectTo?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isDisabled = disabled ?? fetcher.state !== 'idle';
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            {redirectTo ? (
              <input name="redirectTo" type="hidden" value={redirectTo} />
            ) : null}
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={cn(
                'inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-primary px-7 type-body-strong text-white transition-colors hover:bg-primary/90 sm:w-auto',
                'disabled:cursor-not-allowed disabled:bg-ink-subtle disabled:opacity-60',
                className,
              )}
            >
              {children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
