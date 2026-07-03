import {Link} from 'react-router';
import {CONTACT} from '~/lib/site';

/**
 * Shared shell for the ported legal pages (Privacy Policy, Terms). Body copy
 * goes inside <LegalSection>; prose spacing comes from the `.legal-prose`
 * class in tailwind.css so route content stays plain <p>/<ul>/<strong>.
 */
export function LegalPage({
  title,
  effective,
  updated,
  children,
}: {
  title: string;
  effective: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-canvas">
      <header className="border-b border-hairline">
        <div className="container-narrow py-12 md:py-16">
          <Link
            to="/"
            className="type-caption text-ink-subtle transition-colors hover:text-ink"
          >
            ← Back home
          </Link>
          <h1 className="type-display mt-5 text-balance text-ink">{title}</h1>
          <p className="type-caption mt-4 text-ink-subtle">
            Effective {effective} · Last updated {updated}
          </p>
        </div>
      </header>
      <div className="container-narrow space-y-10 py-12 text-ink-muted md:py-16">
        <div className="legal-prose">
          <p>
            <strong>Los Angeles Lighting &amp; Electrical</strong>
            <br />
            {CONTACT.addressFull}
            <br />
            Phone:{' '}
            <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            <br />
            Email:{' '}
            <a href={`mailto:${CONTACT.emailSupport}`}>{CONTACT.emailSupport}</a>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="type-display-sm text-ink">{title}</h2>
      <div className="legal-prose">{children}</div>
    </section>
  );
}

export function LegalSubheading({children}: {children: React.ReactNode}) {
  return <h3 className="type-body-strong mt-6 text-ink">{children}</h3>;
}
