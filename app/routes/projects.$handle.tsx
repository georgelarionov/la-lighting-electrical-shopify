import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/projects.$handle';
import {seo} from '~/lib/seo';
import {Check} from 'lucide-react';
import {PROJECTS, getProject} from '~/lib/projects';
import {getService} from '~/lib/services';
import {PageHeader} from '~/components/PageHeader';
import {ProjectPhoto} from '~/components/ProjectPhoto';
import {ProjectVideo} from '~/components/ProjectVideo';
import {ProjectGallery} from '~/components/ProjectGallery';
import {QuoteButton} from '~/components/QuoteButton';
import {ArrowLink} from '~/components/ArrowLink';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = ({data, location}) => {
  if (!data?.project) {
    return seo({title: `Projects | ${COMPANY_NAME}`, url: location.pathname});
  }
  return seo({
    title: `${data.project.title} | ${COMPANY_NAME}`,
    description: data.project.summary,
    url: location.pathname,
  });
};

export async function loader({params}: Route.LoaderArgs) {
  const project = params.handle ? getProject(params.handle) : undefined;

  if (!project) {
    throw new Response('Project not found', {status: 404});
  }

  const services = project.services
    .map((handle) => {
      const service = getService(handle);
      return service ? {handle: service.handle, title: service.title} : null;
    })
    .filter((s): s is {handle: string; title: string} => s !== null);

  const others = PROJECTS.filter((p) => p.handle !== project.handle).slice(0, 3);

  return {project, services, others};
}

export default function ProjectDetail() {
  const {project, services, others} = useLoaderData<typeof loader>();

  const facts = [
    {label: 'Location', value: project.location},
    {label: 'Type', value: project.category},
    {label: 'Year', value: project.year},
  ];

  return (
    <div className="bg-canvas">
      <PageHeader
        back={{to: '/projects', label: 'All projects'}}
        title={project.title}
        description={project.summary}
      />

      <div className="container-page">
        <div className="overflow-hidden rounded-lg border border-hairline bg-parchment">
          <ProjectVideo
            image={project.image}
            youtubeId={project.youtubeId}
            alt={project.title}
          />
        </div>
      </div>

      <ProjectGallery handle={project.handle} />

      <div className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* Main column */}
          <div>
            <dl className="grid grid-cols-3 gap-4 border-b border-hairline pb-8">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="type-caption text-ink-subtle">{fact.label}</dt>
                  <dd className="type-body-strong mt-1 text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-4">
              {project.description.map((paragraph) => (
                <p key={paragraph} className="type-lead text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="type-body-strong text-ink">Scope of work</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.scope.map((item) => (
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

          {/* Sticky aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-hairline bg-parchment p-7">
              <h2 className="type-body-strong text-ink">
                Planning something similar?
              </h2>
              <p className="type-caption mt-2 text-ink-muted">
                Send your space and we’ll come back with a clear, no-obligation
                estimate, usually within one business day.
              </p>
              <QuoteButton className="press mt-5 inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-6 type-body-strong text-white transition-colors hover:bg-primary/90">
                Request a quote
              </QuoteButton>
            </div>

            {services.length ? (
              <div className="mt-8">
                <h2 className="type-body-strong text-ink">Services used</h2>
                <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
                  {services.map((service) => (
                    <li key={service.handle}>
                      <Link
                        to={`/services/${service.handle}`}
                        prefetch="intent"
                        className="group flex items-center justify-between gap-3 py-3.5"
                      >
                        <span className="type-body text-ink transition-colors group-hover:text-primary">
                          {service.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        {/* More projects */}
        {others.length ? (
          <div className="mt-16 border-t border-hairline pt-12 md:mt-20 md:pt-16">
            <div className="flex items-end justify-between gap-6">
              <h2 className="type-display-sm text-ink">More projects</h2>
              <ArrowLink to="/projects" className="type-body shrink-0">
                View all
              </ArrowLink>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.handle}
                  to={`/projects/${other.handle}`}
                  prefetch="intent"
                  className="lift group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas"
                >
                  <div className="img-zoom overflow-hidden">
                    <ProjectPhoto
                      image={other.image}
                      alt={other.title}
                      className="aspect-[5/3] w-full"
                    />
                  </div>
                  <div className="p-5">
                    <p className="type-fine text-ink-subtle">
                      {other.location} · {other.year}
                    </p>
                    <h3 className="type-body-strong mt-1.5 text-ink transition-colors group-hover:text-primary">
                      {other.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
