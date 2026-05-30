import {Link} from 'react-router';
import logoUrl from '~/assets/logo.svg';
import {COMPANY_NAME} from '~/lib/site';
import {cn} from '~/lib/utils';

/**
 * The horizontal LALE wordmark lockup. Black artwork, so it sits on light
 * surfaces (header, footer). `className` controls height; width is intrinsic.
 */
export function Logo({
  className,
  withLink = true,
}: {
  className?: string;
  withLink?: boolean;
}) {
  const img = (
    <img
      src={logoUrl}
      alt={COMPANY_NAME}
      className={cn('block h-7 w-auto', className)}
      width={606}
      height={70}
    />
  );

  if (!withLink) return img;

  return (
    <Link
      to="/"
      prefetch="intent"
      aria-label={`${COMPANY_NAME} — home`}
      className="inline-flex items-center"
    >
      {img}
    </Link>
  );
}
