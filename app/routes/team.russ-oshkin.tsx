import {Link} from 'react-router';
import type {Route} from './+types/team.russ-oshkin';
import {ArrowRight, ArrowUpRight, Phone, Check} from 'lucide-react';
import {seo, SITE_URL} from '~/lib/seo';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import {Reveal} from '~/components/Reveal';
import {QuoteButton} from '~/components/QuoteButton';
import russPhoto from '~/assets/russ-oshkin.jpg?url';

const NAME = 'Russ Oshkin';
const ROLE = 'Owner';
const LINKEDIN = 'https://www.linkedin.com/in/russ-oshkin/';

export const meta: Route.MetaFunction = ({location}) => {
  const base = seo({
    title: `${NAME} — ${ROLE}, ${COMPANY_NAME}`,
    description: `${NAME} is the owner of ${COMPANY_NAME}, a C-10 licensed lighting and electrical contractor in Los Angeles. Designing, fabricating and installing architectural lighting since 2004.`,
    url: location.pathname,
    image: `${SITE_URL}${russPhoto}`,
  });
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: NAME,
    jobTitle: ROLE,
    image: `${SITE_URL}${russPhoto}`,
    url: `${SITE_URL}/team/russ-oshkin`,
    sameAs: [LINKEDIN],
    worksFor: {'@type': 'Organization', name: COMPANY_NAME, url: SITE_URL},
    knowsAbout: [
      'Architectural lighting',
      'Lighting design',
      'LED linear lighting',
      'C-10 electrical installation',
      'Title 24 compliance',
    ],
  };
  return [...base, {'script:ld+json': ld}];
};

export default function RussOshkin() {
  return (
    <div className="bg-canvas">
      <section className="container-page section-y">
        <Link
          to="/pages/about"
          prefetch="intent"
          className="type-caption inline-flex items-center gap-1 text-ink-subtle transition-colors hover:text-ink"
        >
          ← About
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-lg border border-hairline bg-parchment">
              <img
                src={russPhoto}
                alt={`${NAME}, ${ROLE} of ${COMPANY_NAME}, on site`}
                width={900}
                height={1134}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="type-eyebrow text-ink-subtle">The team</p>
            <h1 className="type-hero mt-3 text-ink">{NAME}</h1>
            <p className="type-lead mt-4 text-ink-muted">
              {ROLE}, {COMPANY_NAME} · C-10 licensed · in the trade since 2004
            </p>

            <div className="mt-8 flex flex-col gap-4 type-body text-ink-muted">
              <p>
                Russ Oshkin is the owner of {COMPANY_NAME}, a boutique, C-10
                licensed lighting and electrical contractor based in Los
                Angeles. He has worked in the trade since 2004.
              </p>
              <p>
                Russ leads every project from design through installation:
                running photometric layouts, fabricating the firm&rsquo;s own
                architectural linear pendant systems in-house, and installing
                them to California Title 24 code. He works hands-on across
                hospitality, office, retail and residential-community properties
                throughout Los Angeles County, on site from removal through
                final commissioning.
              </p>
            </div>

            <ul className="mt-7 flex flex-col gap-2.5">
              {[
                'C-10 licensed & insured electrical contractor',
                'In the trade since 2004',
                'Design, in-house fabrication and licensed installation under one roof',
              ].map((t) => (
                <li key={t} className="flex gap-2.5 type-body text-ink">
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    strokeWidth={2}
                  />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <QuoteButton className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 type-body-strong text-white transition-colors hover:bg-primary/90">
                Request a quote <ArrowRight className="size-4" />
              </QuoteButton>
              <a
                href={CONTACT.phoneHref}
                className="press inline-flex h-12 items-center gap-2 rounded-sm border border-hairline px-5 type-body text-ink transition-colors hover:border-ink"
              >
                <Phone className="size-4" /> {CONTACT.phoneDisplay}
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex h-12 items-center gap-2 rounded-sm border border-hairline px-5 type-body text-ink transition-colors hover:border-ink"
              >
                <ArrowUpRight className="size-4" /> LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
