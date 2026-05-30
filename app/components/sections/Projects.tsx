import project1 from '~/assets/project-1.jpg?url';
import project2 from '~/assets/project-2.jpg?url';
import project3 from '~/assets/project-3.jpg?url';
import {ArrowLink} from '~/components/ArrowLink';

type Project = {
  id: string;
  img: string;
  tags: string[];
  title: string;
};

const PROJECTS: Project[] = [
  {
    id: 'p1',
    img: project1,
    tags: ['Los Angeles', 'Private Residence', '2024'],
    title: 'Ambient lighting for compact interiors',
  },
  {
    id: 'p2',
    img: project2,
    tags: ['Santa Monica', 'Retail', '2023'],
    title: 'Storefront relight on a tight footprint',
  },
  {
    id: 'p3',
    img: project3,
    tags: ['Beverly Hills', 'Hospitality', '2023'],
    title: 'Layered lighting for an evening room',
  },
];

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 bg-canvas">
      <div className="container-page section-y">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="type-display text-ink text-balance">Recent work</h2>
            <p className="type-body mt-2.5 text-ink-muted">
              A few rooms we relit across Los Angeles, from private homes to
              storefronts.
            </p>
          </div>
          <ArrowLink to="/pages/projects" className="type-body shrink-0">
            View all projects
          </ArrowLink>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-[2px] border border-hairline bg-canvas"
            >
              <img
                src={project.img}
                alt={project.title}
                width={1200}
                height={720}
                loading="lazy"
                className="aspect-[5/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[2px] bg-parchment px-2.5 py-1 type-fine font-medium text-ink-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-[18px] text-xl font-semibold leading-snug tracking-tight text-ink">
                  {project.title}
                </h3>
                <ArrowLink
                  to="/pages/projects"
                  className="type-caption mt-[18px]"
                >
                  View project
                </ArrowLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
