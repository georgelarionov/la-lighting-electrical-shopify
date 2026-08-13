import {forwardRef, Suspense, useEffect} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {NavQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {ChevronDown, Menu as MenuIcon, ShoppingBag, X} from 'lucide-react';
import {NavigationMenu} from 'radix-ui';
import {useAside} from '~/components/Aside';
import {CategoryMenuItem} from '~/components/CategoryMenu';
import {Logo} from '~/components/Logo';
import {Button} from '~/components/ui/button';
import {buildNav, type NavCategory} from '~/lib/nav';
import {CONTACT, MOBILE_NAV, PRIMARY_NAV} from '~/lib/site';
import {cn} from '~/lib/utils';

interface HeaderProps {
  nav: NavQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

/**
 * Pencil "Header / Desktop" (GPmqO) + "Header / Mobile" (lYup1): a slim black
 * utility bar (desktop only) above a sticky white nav — logo left, primary nav
 * centered, "Request a Quote" + cart on the right. On mobile it collapses to
 * logo + cart + hamburger, which opens the full-screen MobileNav (VMWan).
 *
 * Catalog opens the category mega-menu (`CategoryMenu`) instead of navigating;
 * the panel itself carries the link through to /collections.
 */
export function Header({cart, nav}: HeaderProps) {
  const {open} = useAside();
  const categories = buildNav(nav);
  return (
    <header className="relative z-50">
      <UtilityBar />
      <div className="sticky top-0 z-50 border-b border-hairline bg-canvas">
        {/* Radix wraps the *List* in its own position:relative div, so a panel
            positioned from inside an Item can only ever be as wide as the five
            centered nav links. The Viewport below is the escape hatch: Radix
            renders open content into it wherever it sits, so it hangs off
            `relative` on Root and spans the full bar. */}
        <NavigationMenu.Root
          delayDuration={120}
          aria-label="Primary"
          className="relative"
        >
          <div className="container-page flex h-14 items-center justify-between gap-4 md:grid md:h-16 md:grid-cols-[1fr_auto_1fr]">
            {/* Logo — left on every viewport */}
            <div className="flex md:justify-start">
              <Logo className="h-6 md:h-7" />
            </div>

            {/* Primary nav — centered, desktop only */}
            <NavigationMenu.List className="hidden list-none items-center justify-center gap-7 md:flex">
              {PRIMARY_NAV.map((item) =>
                item.mega ? (
                  <CategoryMenuItem
                    key={item.to}
                    label={item.label}
                    categories={categories}
                    onQuote={() => open('quote')}
                  />
                ) : (
                  <NavigationMenu.Item key={item.to}>
                    <NavigationMenu.Link asChild>
                      <HeaderNavLink to={item.to}>{item.label}</HeaderNavLink>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                ),
              )}
            </NavigationMenu.List>

            {/* Actions — right */}
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={() => open('quote')}
                className="hidden h-9 px-[18px] type-caption font-medium md:inline-flex"
              >
                Request a Quote
              </Button>
              <CartToggle cart={cart} className="hidden md:inline-flex" pill />
              <CartToggle
                cart={cart}
                className="text-ink hover:text-primary md:hidden"
              />
              <MobileMenuToggle />
            </div>
          </div>

          <div className="absolute inset-x-0 top-full hidden md:block">
            <NavigationMenu.Viewport
              className={cn(
                'w-full origin-top border-b border-hairline bg-canvas',
                'shadow-[0_16px_32px_-24px_rgba(0,0,0,0.35)]',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
                'duration-200',
              )}
            />
          </div>
        </NavigationMenu.Root>
      </div>
      <MobileNav cart={cart} categories={categories} />
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

/**
 * Rendered under `NavigationMenu.Link asChild`, so it must forward both the ref
 * and the pointer/keyboard props Radix injects — otherwise the plain nav items
 * silently drop out of the menu's roving focus.
 */
const HeaderNavLink = forwardRef<
  HTMLAnchorElement,
  {to: string; children: React.ReactNode; className?: string}
>(function HeaderNavLink({to, children, className, ...rest}, ref) {
  return (
    <NavLink
      {...rest}
      ref={ref}
      to={to}
      prefetch="intent"
      className={({isActive}) =>
        cn(
          'type-caption font-medium text-ink transition-colors hover:text-primary',
          'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
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
});

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
function MobileNav({
  cart,
  categories,
}: Pick<HeaderProps, 'cart'> & {categories: NavCategory[]}) {
  const {type, close, open} = useAside();
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
            onNavigate={close}
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

      <div className="flex flex-1 flex-col justify-between gap-8 overflow-y-auto px-7 pb-10 pt-7">
        <nav className="flex flex-col" role="navigation" aria-label="Primary">
          {/* Catalog expands in place. `<details>` gives the disclosure
              semantics, keyboard handling and animation-free reliability that a
              hand-rolled accordion would only approximate. */}
          <details className="group border-b border-white/12">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] text-white [&::-webkit-details-marker]:hidden">
              Catalog
              <ChevronDown
                className="size-6 shrink-0 text-white/60 transition-transform duration-200 group-open:rotate-180"
                strokeWidth={1.75}
              />
            </summary>
            <ul className="list-none pb-4">
              {categories.map((cat) => (
                <li key={cat.handle}>
                  <NavLink
                    to={cat.url}
                    prefetch="intent"
                    onClick={close}
                    className="block border-t border-white/8 py-3"
                  >
                    <span className="type-body font-medium text-white">
                      {cat.title}
                    </span>
                    {cat.blurb ? (
                      <span className="mt-0.5 block type-caption text-body-muted">
                        {cat.blurb}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/collections"
                  prefetch="intent"
                  onClick={close}
                  className="block border-t border-white/8 py-3 type-body font-medium text-sky"
                >
                  Browse all products →
                </NavLink>
              </li>
            </ul>
          </details>

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

        <div className="flex shrink-0 flex-col gap-5">
          <Button
            onClick={() => open('quote')}
            className="h-12 w-full text-base font-semibold"
          >
            Request a Quote
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
  onNavigate,
}: Pick<HeaderProps, 'cart'> & {
  className?: string;
  pill?: boolean;
  /** Dismiss the mobile overlay — it would otherwise cover the cart page. */
  onNavigate?: () => void;
}) {
  return (
    <Suspense
      fallback={
        <CartBadge
          count={0}
          className={className}
          pill={pill}
          onNavigate={onNavigate}
        />
      }
    >
      <Await resolve={cart}>
        <CartBanner className={className} pill={pill} onNavigate={onNavigate} />
      </Await>
    </Suspense>
  );
}

function CartBanner({
  className,
  pill,
  onNavigate,
}: {
  className?: string;
  pill?: boolean;
  onNavigate?: () => void;
}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return (
    <CartBadge
      count={cart?.totalQuantity ?? 0}
      className={className}
      pill={pill}
      onNavigate={onNavigate}
    />
  );
}

function CartBadge({
  count,
  className,
  pill,
  onNavigate,
}: {
  count: number;
  className?: string;
  pill?: boolean;
  onNavigate?: () => void;
}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  // A link, not a drawer trigger: the cart is a real page with its own URL, so
  // it should be openable in a new tab, shareable, and reachable without JS.
  return (
    <Link
      to="/cart"
      prefetch="intent"
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      className={cn(
        'relative inline-flex items-center justify-center transition-colors',
        pill
          ? 'size-9 rounded-sm bg-parchment text-ink hover:bg-parchment/70'
          : 'size-10',
        className,
      )}
      onClick={() => {
        onNavigate?.();
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
    </Link>
  );
}
