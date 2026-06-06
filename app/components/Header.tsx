import {Suspense, useEffect} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {Menu as MenuIcon, ShoppingBag, X} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {Button} from '~/components/ui/button';
import {CONTACT, MOBILE_NAV, PRIMARY_NAV} from '~/lib/site';
import {cn} from '~/lib/utils';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

/**
 * Pencil "Header / Desktop" (GPmqO) + "Header / Mobile" (lYup1): a slim black
 * utility bar (desktop only) above a sticky white nav — logo left, primary nav
 * centered, "Request a Quote" + cart on the right. On mobile it collapses to
 * logo + cart + hamburger, which opens the full-screen MobileNav (VMWan).
 */
export function Header({cart}: HeaderProps) {
  return (
    <header className="relative z-50">
      <UtilityBar />
      <div className="sticky top-0 z-50 border-b border-hairline bg-canvas">
        <div className="container-page flex h-14 items-center justify-between gap-4 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr]">
          {/* Logo — left on every viewport */}
          <div className="flex md:justify-start">
            <Logo className="h-6 md:h-7" />
          </div>

          {/* Primary nav — centered, desktop only */}
          <nav
            className="hidden items-center justify-center gap-7 md:flex"
            role="navigation"
            aria-label="Primary"
          >
            {PRIMARY_NAV.map((item) => (
              <HeaderNavLink key={item.to} to={item.to}>
                {item.label}
              </HeaderNavLink>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center justify-end gap-3">
            <Button
              asChild
              className="hidden h-9 px-[18px] type-caption font-medium md:inline-flex"
            >
              <Link to="/#quote">Request a Quote</Link>
            </Button>
            <CartToggle cart={cart} className="hidden md:inline-flex" pill />
            <CartToggle
              cart={cart}
              className="text-ink hover:text-primary md:hidden"
            />
            <MobileMenuToggle />
          </div>
        </div>
      </div>
      <MobileNav cart={cart} />
    </header>
  );
}

/** Slim near-black bar (desktop only): phone, hours, address, C-10 credential. */
function UtilityBar() {
  return (
    <div className="hidden bg-ink-black text-white md:block">
      <div className="container-page flex h-10 items-center justify-between gap-6 type-fine">
        <div className="flex min-w-0 items-center gap-6">
          <a
            href={CONTACT.phoneHref}
            className="whitespace-nowrap font-medium underline-offset-4 hover:underline"
          >
            {CONTACT.phoneDisplay}
          </a>
          <span className="whitespace-nowrap text-body-muted">
            {CONTACT.hoursDisplay}
          </span>
          <a
            href={CONTACT.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-w-0 truncate text-body-muted underline-offset-4 hover:text-white hover:underline lg:block"
          >
            {CONTACT.addressFull}
          </a>
        </div>
        <span className="whitespace-nowrap">{CONTACT.licenseLine}</span>
      </div>
    </div>
  );
}

function HeaderNavLink({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={({isActive}) =>
        cn(
          'type-caption font-medium text-ink transition-colors hover:text-primary',
          // Same-page hash links resolve to pathname "/", so NavLink reports
          // them active on the homepage — only highlight real route targets.
          isActive && !to.includes('#') && 'text-primary',
          className,
        )
      }
    >
      {children}
    </NavLink>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="-mr-2 inline-flex size-10 items-center justify-center text-ink md:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <MenuIcon className="size-6" strokeWidth={1.75} />
    </button>
  );
}

/**
 * Full-screen dark mobile menu (Pencil "Header / Mobile — Menu Open" VMWan):
 * white logo + cart + close on top, a large nav list, and a quote CTA with
 * contact details pinned to the bottom. Driven by the shared `mobile` aside
 * state so the hamburger / close / nav links all toggle it.
 */
function MobileNav({cart}: Pick<HeaderProps, 'cart'>) {
  const {type, close} = useAside();
  const expanded = type === 'mobile';

  useEffect(() => {
    if (!expanded) return;
    const abortController = new AbortController();
    document.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      },
      {signal: abortController.signal},
    );
    document.body.style.overflow = 'hidden';
    return () => {
      abortController.abort();
      document.body.style.overflow = '';
    };
  }, [expanded, close]);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Menu"
      aria-hidden={!expanded}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col bg-tile text-white transition-opacity duration-300 md:hidden',
        expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Link to="/" onClick={close} aria-label="Home" className="inline-flex">
          <Logo className="h-6 brightness-0 invert" withLink={false} />
        </Link>
        <div className="flex items-center gap-5">
          <CartToggle
            cart={cart}
            className="size-7 text-white hover:text-white/80"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="-mr-1 inline-flex size-8 items-center justify-center text-white"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-7 pb-10 pt-7">
        <nav className="flex flex-col" role="navigation" aria-label="Primary">
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              onClick={close}
              className={({isActive}) =>
                cn(
                  'py-3.5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] text-white transition-colors hover:text-sky',
                  isActive && !item.to.includes('#') && 'text-sky',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-5">
          <Button asChild className="h-12 w-full text-base font-semibold">
            <Link to="/#quote" onClick={close}>
              Request a Quote
            </Link>
          </Button>
          <div className="flex flex-col gap-3.5">
            <a
              href={CONTACT.phoneHref}
              className="text-[1.375rem] font-semibold leading-tight text-white"
            >
              {CONTACT.phoneDisplay}
            </a>
            <div className="flex flex-col gap-1.5 type-caption text-body-muted">
              <span>{CONTACT.hoursDisplay}</span>
              <span>{CONTACT.addressFull}</span>
              <a
                href={`mailto:${CONTACT.emailSales}`}
                className="break-all transition-colors hover:text-white"
              >
                {CONTACT.emailSales}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartToggle({
  cart,
  className,
  pill,
}: Pick<HeaderProps, 'cart'> & {className?: string; pill?: boolean}) {
  return (
    <Suspense fallback={<CartBadge count={0} className={className} pill={pill} />}>
      <Await resolve={cart}>
        <CartBanner className={className} pill={pill} />
      </Await>
    </Suspense>
  );
}

function CartBanner({className, pill}: {className?: string; pill?: boolean}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return (
    <CartBadge count={cart?.totalQuantity ?? 0} className={className} pill={pill} />
  );
}

function CartBadge({
  count,
  className,
  pill,
}: {
  count: number;
  className?: string;
  pill?: boolean;
}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      className={cn(
        'relative inline-flex items-center justify-center transition-colors',
        pill
          ? 'size-9 rounded-sm bg-parchment text-ink hover:bg-parchment/70'
          : 'size-10',
        className,
      )}
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingBag className="size-5" strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}
