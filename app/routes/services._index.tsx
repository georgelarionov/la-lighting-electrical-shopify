import {Link} from 'react-router';
import type {Route} from './+types/services._index';
import {SERVICES} from '~/lib/services';
import {PageHeader} from '~/components/PageHeader';
import {ServiceGlyph} from '~/components/ServiceGlyph';
import {ArrowLink} from '~/components/ArrowLink';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `Services | ${COMPANY_NAME}`},
    {
      name: 'description',
      content:
        'Lighting design, Title 24 compliance, licensed installation, controls, LED retrofits, and maintenance — designed and installed in Los Angeles.',
    },
  ];
};

export default function ServicesIndex() {
  return (
    <div className="bg-canvas">
      <PageHeader
        title="Services"
        description="From the first photometric layout to the final aiming, handled end to end by one licensed team in Los Angeles."
      />

      <div className="container-page section-y">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.handle}
              to={`/services/${service.handle}`}
              prefetch="intent"
              className="group flex flex-col rounded-[2px] border border-hairline bg-canvas p-7 transition-colors hover:border-ink"
            >
              <ServiceGlyph icon={service.icon} />
              <h2 className="type-display-sm mt-6 text-ink transition-colors group-hover:text-primary">
                {service.title}
              </h2>
              <p className="type-body mt-2.5 flex-1 text-ink-muted">
                {service.summary}
              </p>
              <span className="mt-6">
                <ArrowLink to={`/services/${service.handle}`} className="type-body">
                  Learn more
                </ArrowLink>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <ServicesQuoteBand />
    </div>
  );
}

/** Closing dark CTA band → the homepage Request a Quote form. */
function ServicesQuoteBand() {
  return (
    <section className="dark bg-tile text-white">
      <div className="container-page flex flex-col items-center gap-6 py-16 text-center md:py-20">
        <h2 className="type-display max-w-[20ch] text-balance text-white">
          Tell us about your space.
        </h2>
        <p className="type-lead max-w-[46ch] text-body-muted">
          Send the details and get a clear, no-obligation estimate, usually
          within one business day.
        </p>
        <Link
          to="/#quote"
          className="mt-2 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 type-body-strong text-white transition-colors hover:bg-primary/90"
        >
          Request a quote
        </Link>
      </div>
    </section>
  );
}
