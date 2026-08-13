import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowRight, ChevronDown, Sparkles} from 'lucide-react';
import {NavigationMenu} from 'radix-ui';
import type {NavCategory} from '~/lib/nav';
import {cn} from '~/lib/utils';

/**
 * Header category mega-menu — one `NavigationMenu.Item` for the header's
 * `NavigationMenu.Root` (which lives in `Header.tsx`, wrapping the whole bar).
 *
 * The Root placement is not cosmetic: Radix nests its own
 * `<div style="position:relative">` directly inside Root, and that div is the
 * containing block for this panel. Root around just the trigger would pin the
 * panel to the width of the word "Catalog"; around the bar, it spans it.
 *
 * Lighting is bought by sight, not by name — most people cannot tell you what
 * "magnetic track" is but recognise the rail instantly. So the three systems
 * the business leads with get image cards, every category carries a
 * plain-English line, and the panel ends with the two escape hatches for
 * someone who still doesn't know what they need: the full catalog, and the
 * free lighting plan.
 *
 * Radix carries the parts that are easy to get subtly wrong by hand — hover
 * intent, roving focus, Escape, focus return.
 */
export function CategoryMenuItem({
  label,
  categories,
  onQuote,
}: {
  label: string;
  categories: NavCategory[];
  onQuote: () => void;
}) {
  const featured = categories.filter((c) => c.featured);
  const rest = categories.filter((c) => !c.featured);

  return (
    <NavigationMenu.Item>
        <NavigationMenu.Trigger
          className={cn(
            'group inline-flex items-center gap-1 type-caption font-medium text-ink',
            'transition-colors hover:text-primary data-[state=open]:text-primary',
            'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          )}
        >
          {label}
          <ChevronDown
            className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
            strokeWidth={2}
          />
        </NavigationMenu.Trigger>

        {/* Sizing and animation live on the Viewport in Header.tsx — Radix
            renders this content into it, and the Viewport is the only element
            that can span the full bar. */}
        <NavigationMenu.Content>
          <div className="container-page grid gap-x-12 gap-y-10 pb-8 pt-10 lg:grid-cols-[1fr_17rem]">
            {/* Three flagship systems — picked by picture. */}
            <div>
              <PanelHeading>Shop by system</PanelHeading>
              <ul className="mt-5 grid list-none grid-cols-3 gap-6">
                {featured.map((cat) => (
                  <li key={cat.handle}>
                    <PanelLink to={cat.url} className="group block">
                      {/* The wrapper owns the ratio; the image fills it
                          absolutely. Letting the image set its own box made it
                          collapse to its intrinsic 4x3 *pixels*. 16/10 keeps
                          three full-width cards from turning the menu into a
                          page. */}
                      <div
                        className="img-zoom relative overflow-hidden rounded-md bg-parchment"
                        style={{aspectRatio: '16 / 10'}}
                      >
                        <CategoryThumb category={cat} />
                      </div>
                      <p className="mt-3 type-body-strong text-ink transition-colors group-hover:text-primary">
                        {cat.title}
                      </p>
                      <p className="mt-1 type-caption text-ink-subtle">
                        {cat.blurb}
                      </p>
                    </PanelLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Everything else. */}
            <div className="lg:border-l lg:border-hairline lg:pl-12">
              <PanelHeading>More categories</PanelHeading>
              <ul className="mt-4 grid list-none grid-cols-2 gap-x-8 lg:grid-cols-1">
                {rest.map((cat) => (
                  <li key={cat.handle}>
                    <PanelLink
                      to={cat.url}
                      className="group block border-b border-hairline py-2.5 last:border-0"
                    >
                      <span className="type-caption font-medium text-ink transition-colors group-hover:text-primary">
                        {cat.title}
                      </span>
                      {cat.blurb ? (
                        <span className="mt-0.5 block type-fine text-ink-subtle">
                          {cat.blurb}
                        </span>
                      ) : null}
                    </PanelLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full-width closing row. Stacking these under "More categories"
              made the right column outrun the left and left a band of dead
              space across the bottom of the panel. */}
          <div className="container-page flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-hairline py-5">
            <PanelLink
              to="/collections"
              className="group inline-flex items-center gap-1.5 type-caption font-medium text-primary"
            >
              Browse all {categories.length} categories
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </PanelLink>
            <button
              type="button"
              onClick={onQuote}
              className="group inline-flex items-center gap-2 text-left type-caption text-ink-subtle transition-colors hover:text-ink"
            >
              <Sparkles
                className="size-4 shrink-0 transition-colors group-hover:text-primary"
                strokeWidth={1.75}
              />
              Not sure what you need?
              <span className="font-medium text-ink underline underline-offset-4 transition-colors group-hover:text-primary">
                Get a free lighting plan
              </span>
            </button>
          </div>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

/**
 * 17 of the store's products currently ship without a photo, so three
 * categories have no image to show. Rather than a broken frame or a grey box,
 * the tile falls back to the category's own initials — quiet, on-system, and
 * it stops looking like a bug.
 */
function CategoryThumb({category}: {category: NavCategory}) {
  if (category.image) {
    return (
      <Image
        data={category.image}
        sizes="(min-width: 1024px) 20rem, 30vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  const initials = category.title
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
function PanelLink({
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
