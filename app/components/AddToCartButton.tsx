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
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
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
