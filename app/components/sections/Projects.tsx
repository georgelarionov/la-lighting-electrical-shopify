import {Link} from 'react-router';
import {ArrowRight} from 'lucide-react';
import {ArrowLink} from '~/components/ArrowLink';
import {Reveal} from '~/components/Reveal';
import {ProjectPhoto} from '~/components/ProjectPhoto';
import {PROJECTS} from '~/lib/projects';

// Data-driven from the project portfolio (app/lib/projects.ts) so new work
// shows here automatically. "Recent work" = the first three (newest first).
const RECENT = PROJECTS.slice(0, 3);

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
          <ArrowLink to="/projects" className="type-body shrink-0">
            View all projects
          </ArrowLink>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RECENT.map((project, i) => (
            <Reveal as="article" key={project.handle} delay={(i % 3) * 70}>
              <Link
                to={`/projects/${project.handle}`}
                prefetch="intent"
                className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-canvas"
              >
                <div className="img-zoom overflow-hidden">
                  <ProjectPhoto
                    image={project.image}
                    alt={project.title}
                    className="aspect-[5/3] w-full"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    {[project.location, project.category, project.year].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-parchment px-2.5 py-1 type-fine font-medium text-ink-muted"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                  <h3 className="mt-[18px] text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  <span className="type-caption mt-[18px] inline-flex items-center gap-1.5 font-medium text-primary">
                    View project
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
