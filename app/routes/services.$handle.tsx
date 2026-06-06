import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/services.$handle';
import {Check} from 'lucide-react';
import {SERVICES, getService} from '~/lib/services';
import {PageHeader} from '~/components/PageHeader';
import {ServiceGlyph} from '~/components/ServiceGlyph';
import {ArrowLink} from '~/components/ArrowLink';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import servicesImg from '~/assets/services.jpg?url';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data?.service) {
    return [{title: `Services | ${COMPANY_NAME}`}];
  }
  return [
    {title: `${data.service.title} | ${COMPANY_NAME}`},
    {name: 'description', content: data.service.summary},
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const service = params.handle ? getService(params.handle) : undefined;

  if (!service) {
    throw new Response('Service not found', {status: 404});
  }

  const others = SERVICES.filter((s) => s.handle !== service.handle).slice(0, 5);

  return {service, others};
}

export default function ServiceDetail() {
  const {service, others} = useLoaderData<typeof loader>();

  return (
    <div className="bg-canvas">
      <PageHeader
        back={{to: '/services', label: 'All services'}}
        title={service.title}
        description={service.summary}
      />

      <div className="container-page">
        <div className="overflow-hidden rounded-[2px] border border-hairline bg-parchment">
          <img
            src={servicesImg}
            alt={`${service.title} by ${COMPANY_NAME}`}
            width={2000}
            height={667}
            loading="eager"
            className="aspect-[3/1] w-full object-cover"
          />
        </div>
      </div>

      <div className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* Main column */}
          <div>
            <div className="flex items-center gap-4">
              <ServiceGlyph icon={service.icon} />
              <h2 className="type-display-sm text-ink">Overview</h2>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {service.description.map((paragraph) => (
                <p key={paragraph} className="type-lead text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="type-body-strong text-ink">What’s included</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        strokeWidth={2}
                      />
                      <span className="type-body text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="type-body-strong text-ink">What you get</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {service.outcomes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-primary"
                        strokeWidth={2}
                      />
                      <span className="type-body text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2px] border border-hairline bg-parchment p-7">
              <h2 className="type-body-strong text-ink">Start your project</h2>
              <p className="type-caption mt-2 text-ink-muted">
                Send your space and we’ll come back with a clear, no-obligation
                estimate, usually within one business day.
              </p>
              <Link
                to="/#quote"
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-primary px-6 type-body-strong text-white transition-colors hover:bg-primary/90"
              >
                Request a quote
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[2px] border border-hairline px-6 type-body-strong text-ink transition-colors hover:border-ink"
              >
                Call {CONTACT.phoneDisplay}
              </a>
            </div>

            <div className="mt-8">
              <h2 className="type-body-strong text-ink">Other services</h2>
              <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
                {others.map((other) => (
                  <li key={other.handle}>
                    <Link
                      to={`/services/${other.handle}`}
                      prefetch="intent"
                      className="group flex items-center justify-between gap-3 py-3.5"
                    >
                      <span className="type-body text-ink transition-colors group-hover:text-primary">
                        {other.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-flex">
                <ArrowLink to="/services" className="type-body">
                  View all services
                </ArrowLink>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
