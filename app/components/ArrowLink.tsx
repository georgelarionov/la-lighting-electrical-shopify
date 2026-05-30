import {Link} from 'react-router';
import {ChevronRight} from 'lucide-react';
import {cn} from '~/lib/utils';

/**
 * The blue "Label ›" text link used across the homepage (Pencil: a text label
 * followed by a lucide chevron-right). Replaces per-section eyebrows + buttons
 * as the primary affordance. Blue by default; pass `text-sky` on dark tiles.
 */
export function ArrowLink({
  to,
  children,
  className,
  prefetch = 'intent',
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: 'intent' | 'none' | 'render' | 'viewport';
}) {
  return (
    <Link
      to={to}
      prefetch={prefetch}
      className={cn(
        'group/arrow inline-flex items-center gap-0.5 font-medium text-primary',
        className,
      )}
    >
      {children}
      <ChevronRight className="size-[1em] transition-transform duration-200 ease-out group-hover/arrow:translate-x-0.5" />
    </Link>
  );
}
