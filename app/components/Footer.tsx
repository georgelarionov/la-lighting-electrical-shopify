import {Link, NavLink, useFetcher} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {ArrowRight, ArrowUp, CheckCircle2, ShieldCheck} from 'lucide-react';
import {Logo} from '~/components/Logo';
import {
  COMPANY_NAME,
  CONTACT,
  FOOTER_COLUMNS,
  LEGAL_NAV,
  SOCIAL,
} from '~/lib/site';
import type {SubscribeResult} from '~/lib/home-forms';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

/**
 * Tesla-clean footer (redesign 2026): off-white surface, newsletter + back-to-top,
 * Gardena / Shop / Company / Connect columns, an achromatic Licensed &
 * Insured mark, and the legal row. Footer chrome is static (app/lib/site.ts);
 * Storefront props are accepted for layout compatibility but unused.
 */
export function Footer(_props: FooterProps) {
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
          <div className="col-span-2 md:col-span-1">
            <h3 className="type-body-strong text-ink">Gardena</h3>
            <div className="mt-3 flex flex-col gap-1.5 type-caption text-ink-muted">
              <a href={CONTACT.phoneHref} className="hover:text-ink">
                T: {CONTACT.phoneDisplay}
              </a>
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                {CONTACT.addressLine1}
                <br />
                {CONTACT.addressLine2}
              </a>
              <span className="mt-1">{CONTACT.hoursDisplay} PT</span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="flex flex-col">
              <h3 className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {col.heading}
              </h3>
              <div className="mt-4 flex flex-col">
                {col.links.map((l) => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    prefetch="intent"
                    className="border-b border-hairline py-2.5 type-caption font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          ))}

          <nav aria-label="Connect" className="flex flex-col">
            <h3 className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Connect
            </h3>
            <div className="mt-4 flex flex-col">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-hairline py-2.5 type-caption font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Wordmark + trust mark */}
        <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Logo className="h-9 sm:h-11" withLink={false} />
          <LicensedBadge />
        </div>

        <hr className="mt-12 border-t border-hairline" />

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
    <div className="inline-flex select-none items-center gap-3 rounded-sm border border-ink/25 px-5 py-3 text-ink">
      <ShieldCheck className="size-6" strokeWidth={1.75} />
      <span className="type-caption font-semibold uppercase leading-tight tracking-wide">
        Licensed
        <br />& Insured
      </span>
    </div>
  );
}
