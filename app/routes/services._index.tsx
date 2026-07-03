import {useState, useMemo} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/services._index';
import {Reveal} from '~/components/Reveal';
import {QuoteButton} from '~/components/QuoteButton';
import {SERVICES, SERVICE_TABS, type SvcCat} from '~/lib/services-catalog';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import hero from '~/assets/mp/svc-hero.jpg?url';
import designHero from '~/assets/mp/svc-design-hero.jpg?url';
import insitu from '~/assets/mp/insitu.jpg?url';
import track from '~/assets/mp/svc-track.jpg?url';
import museum from '~/assets/mp/svc-museum.jpg?url';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `Services | ${COMPANY_NAME}`},
    {
      name: 'description',
      content:
        'One licensed partner for the whole job — lighting design, linear and track lighting, licensed installation and electrical work across Los Angeles.',
    },
  ];
};

/* icons */
type IP = {className?: string};
const Arrow = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Phone = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const Shield = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
const Check = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>;
const Clock = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
const Compass = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6 6-2Z" /></svg>;

const TRUST = ['C-10 Licensed', 'Title 24 by default', '1,000+ installations', '4.9 ★ · 320 reviews', 'Same-week quotes'];
const STEPS = [
  {n: '01', t: 'Consult', d: 'Tell us about the space and the look you’re after — a plan or a few photos is enough.'},
  {n: '02', t: 'Design', d: 'We return a free photometric layout, a fixture list and a fixed quote.'},
  {n: '03', t: 'Supply', d: 'In-stock fixtures ship in days; custom runs get a firm date before you commit.'},
  {n: '04', t: 'Install', d: 'Our licensed C-10 crew installs to Title 24 and hands you the switch.'},
];
const WHY = [
  {icon: Shield, t: 'Licensed & insured', d: 'A C-10 electrical contractor — not a marketplace reseller.'},
  {icon: Check, t: 'Title 24 by default', d: 'Every layout is documented and ready for permits and inspection.'},
  {icon: Compass, t: 'Design + install, one partner', d: 'The team that draws the plan is the team that wires it.'},
  {icon: Clock, t: 'Lead times you can plan around', d: 'In-stock ships in days; custom builds get a firm date.'},
];
const PROJECTS = [
  {img: insitu, t: 'Boutique retail', s: 'Continuous linear + accent track'},
  {img: track, t: 'Flagship store', s: 'European modern track lighting'},
  {img: museum, t: 'Private gallery', s: 'Specialized museum spotlighting'},
];

export default function ServicesAll() {
  const [tab, setTab] = useState<'All' | SvcCat>('All');
  const list = useMemo(
    () => (tab === 'All' ? SERVICES : SERVICES.filter((s) => s.cat === tab)),
    [tab],
  );
  return (
    <div className="w-full bg-background text-foreground font-body antialiased">
      {/* hero — full-bleed */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        <div className="mx-auto max-w-[1280px] px-5 py-28 text-white sm:px-8 sm:py-36">
          <Reveal>
            <p className="type-eyebrow" style={{color: 'rgba(255,255,255,0.75)'}}>Services</p>
            <h1 className="mt-3 max-w-2xl font-heading text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[56px]">Designed, supplied, and installed.</h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/85">
              One licensed partner for the whole job — from the photometric plan to the final inspection. We design the light, supply the fixtures, and our C-10 crew installs it to California code.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuoteButton className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Book a free consultation <Arrow className="h-4 w-4" /></QuoteButton>
              <Link to="/lighting-calculator" className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-white/40 px-6 text-[14px] text-white hover:bg-white/10">Get a free lighting plan</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* trust strip */}
      <div className="border-b border-border bg-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-[12px] tracking-wide text-muted-foreground sm:px-8">
          {TRUST.map((t, i) => <span key={t} className="flex items-center gap-2">{i > 0 && <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />}{t}</span>)}
        </div>
      </div>

      {/* intro */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <p className="type-eyebrow">Why work with us</p>
            <h2 className="mt-3 font-heading text-[30px] leading-[1.1] sm:text-[38px]">Most stores sell you a box. We finish the job.</h2>
          </Reveal>
          <Reveal delay={80} className="self-end">
            <p className="text-[16px] leading-relaxed text-muted-foreground">
              From a single restaurant to a multi-site rollout, you get one accountable team for design, supply and licensed installation. No subcontracted guesswork, no fixture that doesn’t match the plan, no surprises at inspection.
            </p>
          </Reveal>
        </div>
      </section>

      {/* services explorer */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-[28px]">Our services</h2>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {SERVICE_TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`press shrink-0 rounded-sm border px-3.5 py-2 text-[13px] ${tab === t.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/40'}`}>{t.label}</button>)}
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 60}>
                <Link to={`/services/${s.id}`} prefetch="intent" className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
                  <div className="img-zoom relative overflow-hidden bg-parchment" style={{aspectRatio: '16 / 10'}}>
                    <img src={s.img} alt={s.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">{s.cat === 'Install' ? 'Install & electrical' : s.cat}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-[19px] leading-tight">{s.name}</h3>
                    <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">Learn more <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal>
          <p className="type-eyebrow">How it works</p>
          <h2 className="mt-3 font-heading text-[30px] leading-[1.1] sm:text-[38px]">From idea to inspection, in four steps.</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 60} className="bg-background">
              <div className="h-full p-7">
                <span className="tnum font-heading text-[28px] text-muted-foreground">{s.n}</span>
                <h3 className="mt-3 font-heading text-[19px]">{s.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* why us */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={(i % 2) * 70}>
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-border bg-background"><w.icon className="h-5 w-5 text-foreground" /></span>
                  <div>
                    <h3 className="font-heading text-[19px]">{w.t}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* projects */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal><h2 className="font-heading text-[28px]">Recent work</h2></Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 60}>
              <Link to="/projects" prefetch="intent" className="lift group block">
                <div className="img-zoom overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '4 / 3'}}>
                  <img src={p.img} alt={p.t} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-3 text-[15px] font-medium">{p.t}</h3>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{p.s}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band — full-bleed */}
      <section className="relative isolate overflow-hidden">
        <img src={designHero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-[900px] px-5 py-24 text-center text-white sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-heading text-[32px] leading-[1.1] sm:text-[44px]">Tell us about your space.</h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/80">Free lighting plan, fixed quote, licensed installation. Talk to a specialist this week.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <QuoteButton className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Book a free consultation <Arrow className="h-4 w-4" /></QuoteButton>
              <a href={CONTACT.phoneHref} className="press inline-flex h-12 items-center gap-2 rounded-sm border border-white/40 px-6 text-[14px] text-white hover:bg-white/10"><Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
