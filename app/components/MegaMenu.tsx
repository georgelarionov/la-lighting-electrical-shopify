import {Link} from 'react-router';
import {ArrowRight, ChevronDown} from 'lucide-react';
import {NavigationMenu} from 'radix-ui';
import {cn} from '~/lib/utils';

export type MegaItem = {
  key: string;
  title: string;
  blurb: string;
  url: string;
  /** Rendered inside a 16/10 frame. Callers supply their own image element,
   *  because catalog thumbnails come from Shopify and service ones are local. */
  thumb?: React.ReactNode;
};

/**
 * One mega-menu panel — used by both Catalog and Services.
 *
 * Same shape for both on purpose: a nav where one panel leads with pictures and
 * the other with a list would read as two different menus glued into one bar.
 * A few flagship items get image cards, everything else is a compact list, and
 * a full-width row closes the panel.
 *
 * The trigger is a real link (`href`), not just a disclosure button: hovering
 * opens the panel, clicking goes to the section's own index page. Radix carries
 * the parts that are easy to get subtly wrong by hand — hover intent, roving
 * focus, Escape, focus return.
 *
 * Placement note: Radix wraps the *List* in its own position:relative div, so a
 * panel positioned from inside an Item could only ever be as wide as the nav
 * links. Sizing therefore lives on the Viewport in `Header.tsx`, which Radix
 * renders this content into.
 */
export function MegaMenuItem({
  label,
  href,
  featuredHeading,
  featured,
  restHeading,
  rest,
  footerLabel,
  footerHref,
  aside,
}: {
  label: string;
  href: string;
  featuredHeading: string;
  featured: MegaItem[];
  restHeading: string;
  rest: MegaItem[];
  footerLabel: string;
  footerHref: string;
  /** Right-hand closing note — a secondary link, not a decorated banner. */
  aside?: React.ReactNode;
}) {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Trigger asChild>
        <Link
          to={href}
          prefetch="intent"
          className={cn(
            'group inline-flex items-center gap-1 type-caption font-medium text-ink',
            'transition-colors hover:text-primary data-[state=open]:text-primary',
            'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          )}
        >
          {label}
          <ChevronDown
            className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
            strokeWidth={2}
          />
        </Link>
      </NavigationMenu.Trigger>

      <NavigationMenu.Content>
        <div className="container-page grid gap-x-12 gap-y-10 pb-8 pt-10 lg:grid-cols-[1fr_17rem]">
          <div>
            <PanelHeading>{featuredHeading}</PanelHeading>
            <ul className="mt-5 grid list-none grid-cols-3 gap-6">
              {featured.map((item) => (
                <li key={item.key}>
                  <PanelLink to={item.url} className="group block">
                    {/* The wrapper owns the ratio and the image fills it
                        absolutely — letting the image size its own box made it
                        collapse to its intrinsic pixels. */}
                    <div
                      className="img-zoom relative overflow-hidden rounded-md bg-parchment"
                      style={{aspectRatio: '16 / 10'}}
                    >
                      {item.thumb ?? <ThumbFallback title={item.title} />}
                    </div>
                    <p className="mt-3 type-body-strong text-ink transition-colors group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 type-caption text-ink-subtle">
                      {item.blurb}
                    </p>
                  </PanelLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-hairline lg:pl-12">
            <PanelHeading>{restHeading}</PanelHeading>
            <ul className="mt-4 grid list-none grid-cols-2 gap-x-8 lg:grid-cols-1">
              {rest.map((item) => (
                <li key={item.key}>
                  <PanelLink
                    to={item.url}
                    className="group block border-b border-hairline py-2.5 last:border-0"
                  >
                    <span className="type-caption font-medium text-ink transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                    {item.blurb ? (
                      <span className="mt-0.5 block type-fine text-ink-subtle">
                        {item.blurb}
                      </span>
                    ) : null}
                  </PanelLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full-width closing row. Stacked under the right column instead, it
            made that column outrun the left and left a band of dead space
            across the bottom of the panel. */}
        <div className="container-page flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-hairline py-5">
          <PanelLink
            to={footerHref}
            className="group inline-flex items-center gap-1.5 type-caption font-medium text-primary"
          >
            {footerLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </PanelLink>
          {aside}
        </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

/**
 * Some categories have no photo yet — several products are still drafts without
 * imagery. A quiet monogram beats a broken frame or an empty grey box.
 */
function ThumbFallback({title}: {title: string}) {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-parchment"
      aria-hidden
    >
      <span className="type-display-sm text-ink-subtle/50">{initials}</span>
    </div>
  );
}

function PanelHeading({children}: {children: React.ReactNode}) {
  return (
    <h2 className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
      {children}
    </h2>
  );
}

/**
 * Radix owns the panel's focus and dismiss behaviour, so every in-panel link
 * goes through `NavigationMenu.Link` — that is what closes the menu on select
 * and returns focus to the trigger.
 */
export function PanelLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link
        to={to}
        prefetch="intent"
        className={cn(
          'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          className,
        )}
      >
        {children}
      </Link>
    </NavigationMenu.Link>
  );
}
