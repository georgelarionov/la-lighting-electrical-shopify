import {Link} from 'react-router';

/**
 * Quiet, on-brand empty state for data-driven listings (an empty collection,
 * a search with no matches, a store with no posts yet). Keeps the page from
 * collapsing to a blank gap when the Storefront API returns no nodes.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: {to: string; label: string};
}) {
  return (
    <div className="flex flex-col items-center rounded-[2px] border border-dashed border-hairline bg-parchment px-6 py-20 text-center">
      <h2 className="type-display-sm text-balance text-ink">{title}</h2>
      {description ? (
        <p className="type-body mt-3 max-w-md text-ink-muted">{description}</p>
      ) : null}
      {action ? (
        <Link
          to={action.to}
          prefetch="intent"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 type-body-strong text-white transition-colors hover:bg-primary/90"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
