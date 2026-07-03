import {useMemo, useState} from 'react';
import {Link} from 'react-router';
import {ArrowRight, Phone} from 'lucide-react';
import type {Route} from './+types/projects._index';
import {seo} from '~/lib/seo';
import {PROJECTS} from '~/lib/projects';
import {ProjectPhoto} from '~/components/ProjectPhoto';
import {Reveal} from '~/components/Reveal';
import {Button} from '~/components/ui/button';
import {useAside} from '~/components/Aside';
import ctaImg from '~/assets/about-hero.jpg?url';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import {cn} from '~/lib/utils';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `Projects | ${COMPANY_NAME}`,
    description:
      'Recent lighting and electrical work across Los Angeles — homes, retail, hospitality, and offices we designed and installed.',
    url: location.pathname,
  });
};

const CATEGORIES = ['All', ...new Set(PROJECTS.map((p) => p.category))];

export default function ProjectsIndex() {
  const {open} = useAside();
  const [tab, setTab] = useState('All');
  const list = useMemo(
    () => (tab === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === tab)),
    [tab],
  );

  return (
    <div className="bg-canvas">
      {/* header */}
      <header className="border-b border-hairline">
        <div className="container-page pt-12 pb-10 md:pt-16 md:pb-12">
          <Reveal>
            <p className="type-eyebrow text-ink-subtle">Our work</p>
            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h1 className="type-hero text-ink">Projects</h1>
                <p className="type-body mt-4 max-w-xl text-ink-muted">
                  A selection of rooms we relit across Los Angeles — from private
                  homes to storefronts and dining rooms. Designed, supplied, and
                  installed by one licensed team.
                </p>
              </div>
              <Button
                onClick={() => open('quote')}
                className="h-11 shrink-0 px-6 font-medium"
              >
                Start a project
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* filter + grid */}
      <section className="container-page py-14">
        <Reveal>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTab(cat)}
                  className={cn(
                    'press shrink-0 rounded-sm border px-4 py-2 type-caption font-medium transition-colors',
                    tab === cat
                      ? 'border-ink bg-ink text-white'
                      : 'border-hairline bg-canvas text-ink hover:border-ink/40',
                  )}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1.5 text-[11px] opacity-60">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((project, i) => (
            <Reveal as="article" key={project.handle} delay={(i % 3) * 60}>
              <Link
                to={`/projects/${project.handle}`}
                prefetch="intent"
                className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-canvas"
              >
                <div className="img-zoom overflow-hidden">
                  <ProjectPhoto
                    image={project.image}
                    alt={project.title}
                    eager={i < 3}
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
                  <h2 className="mt-[18px] text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
                    {project.title}
                  </h2>
                  <p className="type-caption mt-2.5 flex-1 text-ink-muted">
                    {project.summary}
                  </p>
                  <span className="type-caption mt-4 inline-flex items-center gap-1.5 font-medium text-primary">
                    View project
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative isolate overflow-hidden">
        <img
          src={ctaImg}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-onyx/65" />
        <div className="container-narrow py-24 text-center text-white">
          <Reveal>
            <h2 className="type-display mx-auto max-w-xl text-white">
              Planning something similar?
            </h2>
            <p className="type-body mx-auto mt-4 max-w-md text-white/80">
              Send your space and we’ll come back with a free lighting plan and a
              clear, no-obligation estimate — usually within one business day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => open('quote')}
                className="h-12 px-7 text-[15px] font-medium"
              >
                Request a quote
                <ArrowRight className="size-4" />
              </Button>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-white/40 px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
              >
                <Phone className="size-4" /> {CONTACT.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
