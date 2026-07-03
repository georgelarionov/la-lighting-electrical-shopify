import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/services.$handle';
import {seo} from '~/lib/seo';
import {Reveal} from '~/components/Reveal';
import {getServiceEntry} from '~/lib/services-catalog';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import plan from '~/assets/mp/svc-plan.jpg?url';
import linear from '~/assets/mp/svc-linear.jpg?url';
import track from '~/assets/mp/svc-track.jpg?url';
import museum from '~/assets/mp/svc-museum.jpg?url';
import install from '~/assets/mp/catalog-service.jpg?url';
import insitu from '~/assets/mp/insitu.jpg?url';
import designHero from '~/assets/mp/svc-design-hero.jpg?url';

export const meta: Route.MetaFunction = ({data, location}) => {
  if (!data?.service)
    return seo({title: `Services | ${COMPANY_NAME}`, url: location.pathname});
  return seo({
    title: `${data.service.name} | ${COMPANY_NAME}`,
    description: data.service.blurb,
    url: location.pathname,
  });
};

export async function loader({params}: Route.LoaderArgs) {
  const service = params.handle ? getServiceEntry(params.handle) : undefined;
  if (!service) throw new Response('Service not found', {status: 404});
  return {service};
}

/* icons */
type IP = {className?: string};
const Arrow = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Chevron = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>;
const Phone = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const Shield = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
const Check = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>;
const LayoutIcon = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M3 9h18M9 21V9" /></svg>;
const List = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
const Ruler = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" /><path d="m7.5 10.5 2 2M11 7l2 2M14.5 3.5l2 2" /></svg>;
const Sliders = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>;
const Tag = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4v5.59A2 2 0 0 0 4.59 10l9.58 9.59a2 2 0 0 0 2.83 0l3.59-3.59a2 2 0 0 0 0-2.83Z" /><path d="M7.5 7.5h.01" /></svg>;

const INCLUDED = [
  {icon: LayoutIcon, t: 'Photometric layout', d: 'An isolux light-level map so you can see the result before you buy.'},
  {icon: List, t: 'Fixture schedule', d: 'Exact models, quantities and finishes — nothing over-ordered.'},
  {icon: Ruler, t: 'Spacing & mounting plan', d: 'Where every fixture goes, dimensioned for your trades.'},
  {icon: Sliders, t: 'Dimming & controls', d: '0–10V scenes matched to how the room is actually used.'},
  {icon: Shield, t: 'Title 24 compliance check', d: 'Documented and ready for permits and inspection.'},
  {icon: Tag, t: 'Fixed quote', d: 'One price for fixtures and optional installation. No surprises.'},
];
const STEPS = [
  {t: 'Share your space', d: 'Upload a floor plan or a few photos, tell us the ceiling height and how the room is used. Five minutes is all it takes.'},
  {t: 'We model it', d: 'Our designers build a photometric model of the room and test fixtures, spacing and beam angles against real light-level targets.'},
  {t: 'Plan + fixture list', d: 'You receive the layout, the isolux light-level map and an itemized fixture schedule — no over-ordering, no dark corners.'},
  {t: 'Fixed quote', d: 'Approve a single price for supply and optional installation. What you see is what you pay.'},
  {t: 'Optional licensed install', d: 'Our C-10 crew installs everything to Title 24 — or take the plan and self-install. Your call.'},
];
const APPS = [
  {id: 'Office', img: linear, d: 'Task-right light levels with no glare on screens, zoned for hybrid work.'},
  {id: 'Retail', img: track, d: 'Accent-to-ambient ratios tuned to make the product the hero.'},
  {id: 'HoReCa', img: designHero, d: 'Warm, layered scenes for service, dwell and atmosphere.'},
  {id: 'Residential', img: insitu, d: 'Comfortable, flattering light, zoned room by room for living.'},
  {id: 'Museum', img: museum, d: 'Conservation-safe spotlighting with controlled, glare-free beams.'},
];
const FAQS = [
  {q: 'Is the plan really free?', a: 'Yes — when we supply or install the fixtures. We’d rather earn the project than charge a design fee.'},
  {q: 'What do you need from me?', a: 'A floor plan (PDF or image) or a few photos, the ceiling height, and a sense of how the space is used.'},
  {q: 'How long does it take?', a: 'Most plans come back within a few business days; large or phased projects get a schedule up front.'},
  {q: 'Do I have to buy from you?', a: 'No obligation. The plan is yours to review — most clients order once they see the numbers.'},
  {q: 'Can you match an existing fixture?', a: 'Usually — send us the model and we’ll spec the layout around it.'},
];
const RELATED = [
  {t: 'Office Linear Lighting', s: 'Even, glare-free open-plan light.', img: linear, to: '/services/office-linear'},
  {t: 'Retail Track Lighting', s: 'Aimable accent that sells product.', img: track, to: '/services/retail-track'},
  {t: 'Licensed Installation', s: 'C-10 install to Title 24, turnkey.', img: install, to: '/services/installation'},
];

export default function ServiceDetail() {
  const {service} = useLoaderData<typeof loader>();
  const [step, setStep] = useState(0);
  const [app, setApp] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  return (
    <div className="w-full bg-background text-foreground font-body antialiased">
      {/* breadcrumb */}
      <div className="mx-auto max-w-[1280px] px-5 pt-6 sm:px-8">
        <nav className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link to="/services" className="hover:text-foreground">Services</Link><span>/</span>
          <span className="text-foreground">{service.name}</span>
        </nav>
      </div>

      {/* hero — split */}
      <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-16">
        <Reveal>
          <p className="type-eyebrow">Service</p>
          <h1 className="mt-3 font-heading text-[42px] leading-[1.04] tracking-[-0.02em] sm:text-[54px]">{service.name}</h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
            Send us your space. We return a photometric plan, a fixture list and a fixed quote — free, with no obligation. You buy exactly what the room needs, nothing more.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/lighting-calculator" prefetch="intent" className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Start my free plan <Arrow className="h-4 w-4" /></Link>
            <a href="#process" className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-onyx/25 px-6 text-[14px] hover:border-foreground">See how it works</a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted-foreground">
            {['Free with your project', 'Title 24 documented', 'Back in a few days'].map((t) => <span key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-foreground" />{t}</span>)}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="img-zoom overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '4 / 3'}}>
            <img src={service.img} alt={service.name} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </section>

      {/* overview */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[900px] px-5 py-16 text-center sm:px-8">
          <Reveal>
            <h2 className="font-heading text-[26px] leading-[1.2] sm:text-[32px]">Guesswork is the most expensive fixture you’ll ever buy.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              The wrong fixture count means glare, dark corners, or a failed Title 24 check — and a reorder. We model your space first, so what you buy is what the room actually needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* what's included */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="type-eyebrow">What you get</p>
            <h2 className="mt-3 font-heading text-[30px] leading-[1.1] sm:text-[36px]">Everything you need to order with confidence.</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {INCLUDED.map((it) => (
                <div key={it.t} className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-parchment"><it.icon className="h-5 w-5 text-foreground" /></span>
                  <div>
                    <h3 className="text-[14.5px] font-medium">{it.t}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="img-zoom h-full overflow-hidden rounded-lg bg-parchment" style={{minHeight: 340}}>
              <img src={plan} alt="A photometric lighting plan" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* process — interactive stepper (dark) */}
      <section id="process" className="bg-onyx text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <Reveal>
            <p className="type-eyebrow" style={{color: 'rgba(255,255,255,0.6)'}}>How it works</p>
            <h2 className="mt-3 font-heading text-[30px] leading-[1.1] sm:text-[38px]">A plan in five simple steps.</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col gap-1">
              {STEPS.map((s, i) => {
                const on = step === i;
                return (
                  <button key={s.t} onClick={() => setStep(i)} className={`press flex items-center gap-4 rounded-sm border px-4 py-4 text-left ${on ? 'border-white/40 bg-white/10' : 'border-transparent hover:bg-white/5'}`}>
                    <span className={`tnum grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] ${on ? 'border-white bg-white text-onyx' : 'border-white/30 text-white/70'}`}>{i + 1}</span>
                    <span className={`font-heading text-[17px] ${on ? 'text-white' : 'text-white/70'}`}>{s.t}</span>
                  </button>
                );
              })}
            </div>
            <div className="rounded-lg border border-white/15 bg-white/[0.04] p-8">
              <span className="tnum font-heading text-[40px] text-white/30">0{step + 1}</span>
              <h3 className="mt-2 font-heading text-[24px]">{STEPS[step].t}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">{STEPS[step].d}</p>
              <div className="mt-8 flex items-center gap-3">
                <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="press grid h-10 w-10 place-items-center rounded-sm border border-white/25 disabled:opacity-30"><Chevron className="h-4 w-4 rotate-90" /></button>
                <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1} className="press grid h-10 w-10 place-items-center rounded-sm border border-white/25 disabled:opacity-30"><Chevron className="h-4 w-4 -rotate-90" /></button>
                <span className="ml-1 text-[12.5px] text-white/50">Step {step + 1} of {STEPS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* where it applies */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal>
          <p className="type-eyebrow">Where it applies</p>
          <h2 className="mt-3 font-heading text-[30px] leading-[1.1] sm:text-[36px]">Every room has a target. We hit it.</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {APPS.map((a, i) => <button key={a.id} onClick={() => setApp(i)} className={`press rounded-sm border px-3.5 py-2 text-[13px] ${app === i ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`}>{a.id}</button>)}
            </div>
            <h3 className="mt-6 font-heading text-[22px]">{APPS[app].id}</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">{APPS[app].d}</p>
          </Reveal>
          <Reveal delay={60}>
            <div className="img-zoom overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '16 / 11'}}>
              <img key={app} src={APPS[app].img} alt={APPS[app].id} className="h-full w-full object-cover" style={{animation: 'fadeIn .5s var(--ease-out)'}} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* pricing */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-8">
          <Reveal>
            <div className="rounded-lg border border-border bg-background p-8 text-center sm:p-10">
              <p className="type-eyebrow">Pricing</p>
              <h2 className="mt-3 font-heading text-[30px]">Free with your project.</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                The design plan costs nothing when we supply or install the fixtures. We’d rather earn the project than charge a design fee.
              </p>
              <Link to="/lighting-calculator" prefetch="intent" className="press mt-7 inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Start my free plan <Arrow className="h-4 w-4" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[840px] px-5 py-16 sm:px-8">
        <Reveal><h2 className="font-heading text-[28px]">Questions, answered</h2></Reveal>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {FAQS.map((f, i) => {
            const isOpen = faqOpen === i;
            return (
              <div key={f.q}>
                <button onClick={() => setFaqOpen(isOpen ? null : i)} className="press flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span className="text-[15px] font-medium">{f.q}</span>
                  <Chevron className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className="grid transition-all duration-300" style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}>
                  <div className="overflow-hidden"><p className="pb-5 pr-10 text-[14px] leading-relaxed text-muted-foreground">{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* related services */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <Reveal><h2 className="font-heading text-[28px]">Related services</h2></Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {RELATED.map((r, i) => (
              <Reveal key={r.t} delay={i * 60}>
                <Link to={r.to} prefetch="intent" className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
                  <div className="img-zoom overflow-hidden bg-parchment" style={{aspectRatio: '16 / 10'}}>
                    <img src={r.img} alt={r.t} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-[18px] leading-tight">{r.t}</h3>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">{r.s}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">Learn more <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band — full-bleed */}
      <section className="relative isolate overflow-hidden">
        <img src={designHero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-[900px] px-5 py-24 text-center text-white sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-heading text-[32px] leading-[1.1] sm:text-[44px]">See your space, lit.</h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/80">Send us a plan or a few photos. We’ll send back a layout, a fixture list and a fixed quote — free.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/lighting-calculator" prefetch="intent" className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Start my free plan <Arrow className="h-4 w-4" /></Link>
              <a href={CONTACT.phoneHref} className="press inline-flex h-12 items-center gap-2 rounded-sm border border-white/40 px-6 text-[14px] text-white hover:bg-white/10"><Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}</a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
