import {useAside} from '~/components/Aside';

/**
 * Opens the global "Request a quote" drawer. Renders a bare <button> so the
 * caller keeps full control of styling (matches the varied CTA looks across the
 * site). Optional `onBefore` runs first — used to close the mobile menu.
 */
export function QuoteButton({
  className,
  children,
  onBefore,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  onBefore?: () => void;
  ariaLabel?: string;
}) {
  const {open} = useAside();
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        onBefore?.();
        open('quote');
      }}
    >
      {children}
    </button>
  );
}
