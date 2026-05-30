import {Suspense} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {
  ArrowUpRight,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {Button} from '~/components/ui/button';
import {CONTACT, PRIMARY_NAV} from '~/lib/site';
import {cn} from '~/lib/utils';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  return (
    <header className="relative z-50">
      <UtilityBar />
      <div className="glass sticky top-0 z-50 border-b border-hairline">
        <div className="container-page grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:grid-cols-3">
          {/* Left: primary nav (desktop) / hamburger (mobile) */}
          <div className="flex items-center">
            <MobileMenuToggle />
            <nav
              className="hidden items-center gap-7 md:flex"
              role="navigation"
              aria-label="Primary"
            >
              {PRIMARY_NAV.map((item) => (
                <HeaderNavLink key={item.to} to={item.to}>
                  {item.label}
                </HeaderNavLink>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Logo className="h-6 sm:h-7" />
          </div>

          {/* Right: contacts, quote CTA, utility icons */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <HeaderNavLink to="/#contact" className="hidden lg:inline-flex">
              Contacts
            </HeaderNavLink>
            <Button
              asChild
              className="hidden h-9 px-5 type-caption font-normal sm:inline-flex"
            >
              <Link to="/#quote">Request a Quote</Link>
            </Button>
            <IconLink to="/search" label="Search" Icon={Search} />
            <AccountLink isLoggedIn={isLoggedIn} />
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Slim near-black top bar carrying phone, hours, address, and the tagline. */
function UtilityBar() {
  return (
    <div className="bg-ink-black text-white">
      <div className="container-page flex h-11 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4 type-fine sm:gap-6">
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 whitespace-nowrap underline-offset-4 hover:underline"
          >
            <Phone className="size-3.5" strokeWidth={2} />
            {CONTACT.phoneDisplay}
          </a>
          <span className="hidden items-center gap-2 whitespace-nowrap text-white/70 sm:inline-flex">
            <span className="size-2 rounded-full bg-brand-green" aria-hidden />
            {CONTACT.hoursDisplay}
          </span>
          <a
            href={CONTACT.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-w-0 items-center gap-2 underline-offset-4 hover:underline lg:inline-flex"
          >
            <MapPin className="size-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{CONTACT.addressFull}</span>
          </a>
        </div>
        <a
          href="/#projects"
          className="hidden items-center gap-1.5 whitespace-nowrap type-fine text-white/90 underline-offset-4 hover:underline md:inline-flex"
        >
          {CONTACT.tagline}
          <ArrowUpRight className="size-3.5" strokeWidth={2} />
        </a>
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
          isActive && 'text-primary',
          className,
        )
      }
    >
      {children}
    </NavLink>
  );
}

/** Vertical nav used inside the mobile slide-over (rendered by PageLayout). */
export function HeaderMenu({viewport}: {viewport: Viewport}) {
  const {close} = useAside();
  const isMobile = viewport === 'mobile';
  return (
    <nav
      className={cn('flex flex-col gap-1', !isMobile && 'md:flex-row')}
      role="navigation"
      aria-label="Primary"
    >
      {PRIMARY_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          prefetch="intent"
          onClick={close}
          className={({isActive}) =>
            cn(
              'type-display-sm py-2 text-ink transition-colors hover:text-primary',
              isActive && 'text-primary',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
      <NavLink
        to="/#contact"
        onClick={close}
        className="type-display-sm py-2 text-ink hover:text-primary"
      >
        Contacts
      </NavLink>
    </nav>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="-ml-2 inline-flex size-10 items-center justify-center text-ink md:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <MenuIcon className="size-5" />
    </button>
  );
}

function IconLink({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: typeof Search;
}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-primary"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </Link>
  );
}

function AccountLink({isLoggedIn}: {isLoggedIn: Promise<boolean>}) {
  return (
    <Link
      to="/account"
      prefetch="intent"
      aria-label="Account"
      className="inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-primary"
    >
      <Suspense fallback={<User className="size-5" strokeWidth={1.75} />}>
        <Await resolve={isLoggedIn} errorElement={<User className="size-5" />}>
          {() => <User className="size-5" strokeWidth={1.75} />}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      className="relative inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-primary"
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
