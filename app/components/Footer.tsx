import {Link, NavLink, useFetcher} from 'react-router';
import type {NavQuery} from 'storefrontapi.generated';
import {ArrowRight, ArrowUp, CheckCircle2, ShieldCheck} from 'lucide-react';
import {Logo} from '~/components/Logo';
import {buildNav} from '~/lib/nav';
import {
  COMPANY_NAME,
  CONTACT,
  FOOTER_COMPANY,
  FOOTER_SERVICES,
  LEGAL_NAV,
  SOCIAL,
} from '~/lib/site';
import type {SubscribeResult} from '~/lib/home-forms';

interface FooterProps {
  nav: NavQuery;
}

/**
 * Tesla-clean footer (redesign 2026): off-white surface, newsletter +
 * back-to-top, four link columns, and the legal row.
 *
 * The four columns answer the four things a visitor arrives at the footer
 * wanting: what do you sell, what do you do, who are you, how do I reach you.
 * Shop is generated from live Shopify collections rather than a hand-kept
 * list — the previous hardcoded one had drifted to five categories the store
 * does not carry, all pointing at the same page.
 */
export function Footer({nav}: FooterProps) {
  const categories = buildNav(nav);

  return (
    <footer id="contact" className="border-t border-hairline bg-parchment">
      <div className="container-page py-16">
        {/* Newsletter */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <h2 className="type-display-sm max-w-md text-ink text-balance">
              Stay in the loop on new fixtures and finished projects.
            </h2>
            <NewsletterForm />
          </div>
          <BackToTop />
        </div>

        <hr className="my-12 border-t border-hairline" />

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-12">
          <FooterColumn heading="Shop">
            {categories.map((cat) => (
              <FooterLink key={cat.handle} to={cat.url}>
                {cat.title}
              </FooterLink>
            ))}
            <FooterLink to="/collections" accent>
              All products
            </FooterLink>
          </FooterColumn>

          <FooterColumn heading="Services">
            {FOOTER_SERVICES.map((l) => (
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn heading="Company">
            {FOOTER_COMPANY.map((l) => (
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="col-span-2 md:col-span-1">
            <ColumnHeading>Get in touch</ColumnHeading>
            <div className="mt-4 flex flex-col items-start gap-2.5 type-caption text-ink-muted">
              <a
                href={CONTACT.phoneHref}
                className="type-body-strong text-ink transition-colors hover:text-primary"
              >
                {CONTACT.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACT.emailSales}`}
                className="break-all transition-colors hover:text-ink"
              >
                {CONTACT.emailSales}
              </a>
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                {CONTACT.addressLine1}
                <br />
                {CONTACT.addressLine2}
              </a>
              <span className="text-ink-subtle">{CONTACT.hoursDisplay} PT</span>
            </div>
            <LicensedBadge />
          </div>
        </div>

        <hr className="mt-14 border-t border-hairline" />

        {/* Wordmark + social */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="h-9 sm:h-11" withLink={false} />
          <nav
            aria-label="Social media"
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="type-caption font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <hr className="mt-8 border-t border-hairline" />

        {/* Legal */}
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption text-ink-subtle">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <nav className="flex items-center gap-6" aria-label="Legal">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                prefetch="intent"
                className="type-caption font-medium text-ink underline underline-offset-4 transition-colors hover:text-ink-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function ColumnHeading({children}: {children: React.ReactNode}) {
  return (
    <h3 className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
      {children}
    </h3>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <nav aria-label={heading} className="flex flex-col">
      <ColumnHeading>{heading}</ColumnHeading>
      {/* Spacing, not rules: the Shop column runs nine deep and a divider under
          every row turned the list into a ladder that was harder to scan. */}
      <div className="mt-3 flex flex-col items-start">{children}</div>
    </nav>
  );
}

function FooterLink({
  to,
  accent,
  children,
}: {
  to: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={
        accent
          ? 'py-1.5 type-caption font-medium text-primary transition-colors hover:text-primary/80'
          : 'py-1.5 type-caption font-medium text-ink-muted transition-colors hover:text-ink'
      }
    >
      {children}
    </NavLink>
  );
}

function NewsletterForm() {
  const fetcher = useFetcher<SubscribeResult>();
  const data = fetcher.data;
  const subscribed = data?.ok && data.intent === 'newsletter';
  const submitting = fetcher.state !== 'idle';

  if (subscribed) {
    return (
      <div className="mt-6 flex items-center gap-3 type-body text-ink">
        <CheckCircle2 className="size-6 text-primary" strokeWidth={1.75} />
        You’re subscribed — thanks for joining.
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/api/subscribe" className="mt-6">
      <div className="flex h-12 max-w-md items-center rounded-sm border border-hairline bg-canvas pl-4 pr-1.5">
        <label htmlFor="footer-email" className="sr-only">
          Your email address
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          placeholder="Your email address"
          className="h-full w-full bg-transparent type-caption text-ink outline-none placeholder:text-ink-subtle"
        />
        <input type="hidden" name="intent" value="newsletter" />
        <button
          type="submit"
          disabled={submitting}
          aria-label="Subscribe"
          className="press inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-ink text-white transition-colors hover:bg-primary disabled:opacity-60"
        >
          <ArrowRight className="size-[18px]" />
        </button>
      </div>
      {data && !data.ok && data.error ? (
        <p className="mt-2 type-caption text-destructive">{data.error}</p>
      ) : null}
    </fetcher.Form>
  );
}

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      className="press inline-flex shrink-0 items-center gap-2 type-caption font-medium text-ink transition-colors hover:text-ink-muted"
    >
      Back to top
      <ArrowUp className="size-4" />
    </button>
  );
}

/** Achromatic Licensed & Insured mark (Tesla redesign — no green). */
function LicensedBadge() {
  return (
    <div className="mt-6 inline-flex select-none items-center gap-3 rounded-sm border border-ink/25 px-5 py-3 text-ink">
      <ShieldCheck className="size-6" strokeWidth={1.75} />
      <span className="type-caption font-semibold uppercase leading-tight tracking-wide">
        Licensed
        <br />& Insured
      </span>
    </div>
  );
}
