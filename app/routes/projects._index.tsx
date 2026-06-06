import {Link} from 'react-router';
import type {Route} from './+types/projects._index';
import {PROJECTS} from '~/lib/projects';
import {PageHeader} from '~/components/PageHeader';
import {ProjectPhoto} from '~/components/ProjectPhoto';
import {ArrowLink} from '~/components/ArrowLink';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `Projects | ${COMPANY_NAME}`},
    {
      name: 'description',
      content:
        'Recent lighting and electrical work across Los Angeles — homes, retail, hospitality, and offices we designed and installed.',
    },
  ];
};

export default function ProjectsIndex() {
  return (
    <div className="bg-canvas">
      <PageHeader
        title="Projects"
        description="A selection of rooms we relit across Los Angeles, from private homes to storefronts and dining rooms."
      />

      <div className="container-page section-y">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Link
              key={project.handle}
              to={`/projects/${project.handle}`}
              prefetch="intent"
              className="group flex flex-col overflow-hidden rounded-[2px] border border-hairline bg-canvas transition-colors hover:border-ink"
            >
              <div className="overflow-hidden">
                <ProjectPhoto
                  image={project.image}
                  alt={project.title}
                  eager={i < 3}
                  className="aspect-[5/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  {[project.location, project.category, project.year].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-[2px] bg-parchment px-2.5 py-1 type-fine font-medium text-ink-muted"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
                <h2 className="mt-[18px] text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
                  {project.title}
                </h2>
                <p className="type-caption mt-2.5 flex-1 text-ink-muted">
                  {project.summary}
                </p>
                <span className="mt-[18px]">
                  <ArrowLink
                    to={`/projects/${project.handle}`}
                    className="type-caption"
                  >
                    View project
                  </ArrowLink>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
