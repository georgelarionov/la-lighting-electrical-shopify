import {Link} from 'react-router';
import {ChevronLeft} from 'lucide-react';
import {cn} from '~/lib/utils';

/**
 * The standard interior-page header used by every catalog / content / utility
 * route (collections, product, blog, search, cart, policies, page, 404…).
 *
 * Mirrors the homepage register: a big `.type-display` headline, one quiet
 * `.type-body` tagline, no per-section eyebrow. A hairline underneath echoes
 * the light↔dark tile divider used on the homepage. Fully responsive: the
 * optional `actions` slot drops below the heading on mobile.
 */
export function PageHeader({
  title,
  description,
  back,
  actions,
  border = true,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: {to: string; label: string};
  actions?: React.ReactNode;
  border?: boolean;
  className?: string;
}) {
  return (
    <header
      className={cn(border && 'border-b border-hairline', className)}
    >
      <div className="container-page pt-9 pb-8 md:pt-14 md:pb-11">
        {back ? (
          <Link
            to={back.to}
            prefetch="intent"
            className="type-caption mb-5 inline-flex items-center gap-1 text-ink-subtle transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-4" />
            {back.label}
          </Link>
        ) : null}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="type-display text-balance text-ink">{title}</h1>
            {description ? (
              <p className="type-body mt-3 text-ink-muted">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="shrink-0 sm:pb-1.5">{actions}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
