import {Link} from 'react-router';
import type {Route} from './+types/pages.about';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Check,
  Compass,
  Clock,
  PenTool,
  Zap,
} from 'lucide-react';
import aboutHero from '~/assets/about-hero.jpg?url';
import crew from '~/assets/services.jpg?url';
import project1 from '~/assets/project-1.jpg?url';
import project2 from '~/assets/project-2.jpg?url';
import project3 from '~/assets/project-3.jpg?url';
import {Reveal} from '~/components/Reveal';
import {Button} from '~/components/ui/button';
import {useAside} from '~/components/Aside';
import {COMPANY_NAME, CONTACT} from '~/lib/site';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `About | ${COMPANY_NAME}`},
    {
      name: 'description',
      content:
        'One licensed team for the whole job — we design the lighting, supply the fixtures, and install it to California code across Los Angeles.',
    },
  ];
};

const STATS = [
  {n: '1,000+', l: 'Installations across LA County'},
  {n: '4.9 ★', l: '320 verified reviews'},
  {n: 'C-10', l: 'Licensed & insured contractor'},
  {n: 'Title 24', l: 'Compliant by default'},
];

const WAYS = [
  {
    icon: PenTool,
    t: 'We design it',
    d: 'Send a floor plan or a few photos and we return a free photometric layout — fixture list, spacing and a fixed quote.',
  },
  {
    icon: Zap,
    t: 'We supply it',
    d: 'A curated catalog of architectural fixtures — linear, track, pendants, panels and the connectors that tie them together.',
  },
  {
    icon: ShieldCheck,
    t: 'We install it',
    d: 'Our licensed C-10 crew installs exactly what we spec, to California code, and hands you the switch.',
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    t: 'Licensed & insured',
    d: 'A C-10 electrical contractor — not a marketplace reseller. The people who draw the plan are the people who wire it.',
  },
  {
    icon: Check,
    t: 'Title 24 by default',
    d: 'Every layout is documented and ready for permits and inspection, with no scramble at the end.',
  },
  {
    icon: Compass,
    t: 'One partner, whole job',
    d: 'Design, supply and installation under one roof — no subcontracted guesswork, no fixture that doesn’t match the plan.',
  },
  {
    icon: Clock,
    t: 'Lead times you can plan around',
    d: 'In-stock fixtures ship in days; custom builds get a firm date before you commit.',
  },
];

const STEPS = [
  {
    n: '01',
    t: 'Consult',
    d: 'Tell us about the space and the look you’re after — a plan or a few photos is enough.',
  },
  {
    n: '02',
    t: 'Design',
    d: 'We return a free photometric layout, a fixture list and a fixed quote.',
  },
  {
    n: '03',
    t: 'Supply',
    d: 'In-stock fixtures ship in days; custom runs get a firm date before you commit.',
  },
  {
    n: '04',
    t: 'Install',
    d: 'Our licensed C-10 crew installs to Title 24 and hands you the switch.',
  },
];

const WORK = [
  {img: project1, t: 'Marina Del Rey residence', s: 'Warm, low-glare ambient scheme'},
  {img: project2, t: 'Santa Monica storefront', s: 'LED relight + accent lighting'},
  {img: project3, t: 'Beverly Hills evening room', s: 'Three-layer hospitality lighting'},
];

export default function About() {
  const {open} = useAside();
  return (
    <div className="bg-canvas">
      {/* hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={aboutHero}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-onyx/80 via-onyx/55 to-onyx/20" />
        <div className="container-page py-28 text-white sm:py-36">
          <Reveal>
            <p className="type-eyebrow text-white/75">About us</p>
            <h1 className="type-hero mt-3 max-w-2xl text-white">
              One licensed team for the whole job.
            </h1>
            <p className="type-body mt-5 max-w-xl text-white/85">
              Most lighting stores sell you a box and wish you luck. We design
              the layout, supply the fixtures, and send a licensed C-10 crew to
              install it — to California code, on a schedule you can plan around.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => open('quote')}
                className="h-12 px-7 text-[15px] font-medium"
              >
                Book a free consultation
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

      {/* story */}
      <section className="container-page section-y">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="type-eyebrow text-ink-subtle">Who we are</p>
            <h2 className="type-display mt-3 text-ink">
              Lighting that’s designed, supplied and installed — by the same
              people.
            </h2>
          </Reveal>
          <Reveal delay={80} className="self-end">
            <div className="flex flex-col gap-4 type-body text-ink-muted">
              <p>
                {COMPANY_NAME} is a licensed C-10 electrical contractor based in
                Marina Del Rey. We started because there was a gap no one wanted
                to own: the space between buying a fixture online and actually
                having good light on the wall.
              </p>
              <p>
                So we closed it. From a single restaurant to a multi-site
                rollout, you get one accountable team for design, supply and
                licensed installation — with no subcontracted guesswork and no
                surprises at inspection.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section className="dark bg-onyx text-white">
        <div className="container-page grid grid-cols-2 gap-px overflow-hidden border-y border-white/10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 60}>
              <div className="px-6 py-10 text-center sm:py-12">
                <p className="type-display tnum">{s.n}</p>
                <p className="type-caption mx-auto mt-2 max-w-[18ch] text-white/60">
                  {s.l}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* three ways */}
      <section className="container-page section-y">
        <Reveal>
          <p className="type-eyebrow text-ink-subtle">What we do</p>
          <h2 className="type-display mt-3 max-w-2xl text-ink">
            Buy the fixture. Or buy the finished result.
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WAYS.map((w, i) => (
            <Reveal key={w.t} delay={i * 70}>
              <div className="flex h-full flex-col rounded-lg border border-hairline bg-parchment p-7">
                <span className="grid size-12 place-items-center rounded-sm border border-hairline bg-canvas">
                  <w.icon className="size-6 text-ink" strokeWidth={1.5} />
                </span>
                <h3 className="type-display-sm mt-5 text-ink">{w.t}</h3>
                <p className="type-caption mt-2.5 text-ink-muted">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* image break */}
      <section>
        <img
          src={crew}
          alt="A licensed crew installing architectural lighting"
          className="h-[42vh] min-h-[320px] w-full object-cover"
        />
      </section>

      {/* values */}
      <section className="bg-parchment">
        <div className="container-page section-y">
          <Reveal>
            <p className="type-eyebrow text-ink-subtle">Why work with us</p>
            <h2 className="type-display mt-3 max-w-2xl text-ink">
              The difference is accountability.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={(i % 2) * 70}>
                <div className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-sm border border-hairline bg-canvas">
                    <v.icon className="size-5 text-ink" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="type-body-strong text-ink">{v.t}</h3>
                    <p className="type-caption mt-1.5 text-ink-muted">{v.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="container-page section-y">
        <Reveal>
          <p className="type-eyebrow text-ink-subtle">How it works</p>
          <h2 className="type-display mt-3 text-ink">
            From idea to inspection, in four steps.
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 60} className="bg-canvas">
              <div className="h-full p-7">
                <span className="type-display-sm tnum text-ink-subtle">
                  {s.n}
                </span>
                <h3 className="type-body-strong mt-3 text-ink">{s.t}</h3>
                <p className="type-caption mt-2 text-ink-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* credential + recent work */}
      <section className="bg-parchment">
        <div className="container-page section-y">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="type-display-sm text-ink">Recent work</h2>
              <p className="type-body mt-2 max-w-md text-ink-muted">
                A few of the rooms we’ve designed and installed across Los
                Angeles.
              </p>
            </div>
            <div className="inline-flex select-none items-center gap-3 rounded-sm bg-gradient-to-br from-brand-green to-brand-green-dark px-5 py-3 text-white shadow-product">
              <ShieldCheck className="size-6" strokeWidth={2} />
              <span className="type-caption font-semibold uppercase leading-tight tracking-wide">
                Licensed
                <br />& Insured
              </span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {WORK.map((w, i) => (
              <Reveal key={w.t} delay={i * 60}>
                <Link to="/projects" prefetch="intent" className="lift group block">
                  <div
                    className="img-zoom overflow-hidden rounded-lg border border-hairline"
                    style={{aspectRatio: '4 / 3'}}
                  >
                    <img
                      src={w.img}
                      alt={w.t}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="type-body-strong mt-3 text-ink transition-colors group-hover:text-primary">
                    {w.t}
                  </h3>
                  <p className="type-caption mt-0.5 text-ink-muted">{w.s}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative isolate overflow-hidden">
        <img
          src={crew}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-onyx/70" />
        <div className="container-narrow py-24 text-center text-white">
          <Reveal>
            <h2 className="type-display mx-auto max-w-xl text-white">
              Tell us about your space.
            </h2>
            <p className="type-body mx-auto mt-4 max-w-md text-white/80">
              Free lighting plan, fixed quote, licensed installation. Talk to a
              specialist this week.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => open('quote')}
                className="h-12 px-7 text-[15px] font-medium"
              >
                Book a free consultation
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
