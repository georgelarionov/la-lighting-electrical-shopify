import {useState, useRef, useEffect, useMemo} from 'react';
import {Link, useFetcher} from 'react-router';
import type {Route} from './+types/lighting-calculator';
import {seo} from '~/lib/seo';
import {SmsConsent} from '~/components/SmsConsent';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import office from '~/assets/mp/svc-linear.jpg?url';
import retail from '~/assets/mp/svc-track.jpg?url';
import horeca from '~/assets/mp/svc-design-hero.jpg?url';
import residential from '~/assets/mp/linear-hero.jpg?url';
import museum from '~/assets/mp/svc-museum.jpg?url';
import pendant from '~/assets/mp/pendant-black.jpg?url';
import panel from '~/assets/mp/led-panel.jpg?url';
import heroImg from '~/assets/mp/svc-hero.jpg?url';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `Lighting design calculator | ${COMPANY_NAME}`,
    description:
      'Answer a few questions and get an instant estimate of fixtures, load and budget — plus a free photometric plan from our team.',
    url: location.pathname,
  });
};

export async function action({request}: Route.ActionArgs) {
  const fd = await request.formData();
  const email = String(fd.get('email') || '');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // ponytail: lead capture only — forward the brief to CRM/email later.
  return {ok};
}

const IMG = {hero: heroImg, office, retail, horeca, residential, museum, pendant, panel};

/* icons */
type IP = {className?: string};
const Arrow = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Back = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
const Check = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>;
const Phone = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const Shield = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
const Lock = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;

/* count-up hook */

const SPACES = [
  {id: 'Office', img: IMG.office},
  {id: 'Retail', img: IMG.retail},
  {id: 'HoReCa', img: IMG.horeca},
  {id: 'Residential', img: IMG.residential},
  {id: 'Museum / Gallery', img: IMG.museum},
  {id: 'Other', img: IMG.hero},
];
const CEILINGS = ['Standard (8–10 ft)', 'High (10–14 ft)', 'Very high (14 ft +)'];
const GOALS = ['Bright & productive', 'Warm & inviting', 'Accent the product', 'Clean architectural lines', 'Gallery-precise', 'Energy efficient'];
const FIXTURES = [
  {id: 'Linear', img: IMG.office},
  {id: 'Track', img: IMG.retail},
  {id: 'Pendant', img: IMG.pendant},
  {id: 'Panel', img: IMG.panel},
  {id: 'Not sure — recommend', img: ''},
];
const SERVICES = ['Lighting design plan', 'Supply fixtures', 'Licensed installation', 'Electrical work'];
const TIMELINE = ['ASAP', '1–3 months', '3–6 months', 'Just exploring'];
const STEPS = [
  {key: 'space', q: 'What kind of space are we lighting?', sub: 'Pick the closest match — it sets the targets we design to.'},
  {key: 'size', q: 'How big is the space?', sub: 'A rough number is fine. We refine it on the plan.'},
  {key: 'goals', q: 'What should the lighting do?', sub: 'Pick all that apply.'},
  {key: 'fixtures', q: 'Any fixture types in mind?', sub: 'Optional — leave it to us and we’ll recommend.'},
  {key: 'services', q: 'What do you need from us?', sub: 'Pick all that apply.'},
  {key: 'timeline', q: 'When do you want it done?', sub: 'So we can plan lead times around you.'},
  {key: 'contact', q: 'Where should we send your plan?', sub: 'Your free photometric plan and fixed quote — no obligation.'},
];
const SPACE_I = 0;
const TIMELINE_I = 5;
const CONTACT_I = 6;
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const phoneOk = (p: string) => p.replace(/\D/g, '').length >= 10;
const stag = (i: number) => ({animationDelay: `${140 + i * 55}ms`});
const GLUE = new Set(['a', 'an', 'and', 'or', 'the', 'to', 'in', 'on', 'at', 'of', 'for', 'with', 'we', 'is', 'it', 'as', 'our', 'your', 'no', 'so', 'by', '&']);
function tidy(text: string) {
  const parts = text.split(' ');
  return parts
    .map((w, i) => {
      if (i === parts.length - 1) return w;
      const bare = w.toLowerCase().replace(/[^a-z&]/g, '');
      const glue = w === '—' || GLUE.has(bare);
      return w + (glue ? ' ' : ' ');
    })
    .join('');
}
type Answers = {
  space: string;
  sqft: number;
  ceiling: string;
  goals: string[];
  fixtures: string[];
  services: string[];
  timeline: string;
};

export default function LightingDesignCalculator() {
  const fetcher = useFetcher<typeof action>();
  const [step, setStep] = useState(0);
  const [, setDir] = useState(1);
  const [a, setA] = useState<Answers>({space: '', sqft: 1500, ceiling: CEILINGS[0], goals: [], fixtures: [], services: [], timeline: ''});
  const [form, setForm] = useState({name: '', email: '', phone: ''});
  const [sms, setSms] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lock = useRef(false);
  const goNext = () => {
    if (step < STEPS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  };
  const goBack = () => {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  };
  const selectSingle = (key: 'space' | 'timeline', val: string) => {
    setA((p) => ({...p, [key]: val}));
    if (!lock.current) {
      lock.current = true;
      window.setTimeout(() => {
        lock.current = false;
        goNext();
      }, 320);
    }
  };
  const toggle = (key: 'goals' | 'fixtures' | 'services', val: string) =>
    setA((p) => {
      const arr = p[key];
      return {...p, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]};
    });
  const est = useMemo(() => {
    const fixtures = Math.max(4, Math.round(a.sqft / 55));
    const watts = fixtures * 36;
    const lowFix = fixtures * 99;
    const highFix = fixtures * 189;
    const inst = a.services.includes('Licensed installation') ? fixtures * 55 : 0;
    const low = lowFix + inst;
    const high = highFix + Math.round(inst * 1.4);
    const rec = a.fixtures.length && !a.fixtures.includes('Not sure — recommend') ? a.fixtures.join(' + ') : 'Linear + accent track';
    const turnaround = a.timeline === 'ASAP' ? '3–5 days' : a.timeline === 'Just exploring' ? 'when you’re ready' : 'on your timeline';
    return {fixtures, watts, low, high, rec, turnaround};
  }, [a]);
  const formValid = form.name.trim().length > 1 && emailOk(form.email) && phoneOk(form.phone);
  const submit = () => {
    setTouched(true);
    if (!formValid) return;
    void fetcher.submit(
      {intent: 'lead', name: form.name, email: form.email, phone: form.phone, smsConsent: sms ? 'yes' : '', space: a.space, sqft: String(a.sqft)},
      {method: 'post', action: '/lighting-calculator'},
    );
    setSubmitted(true);
  };
  const progress = ((step + 1) / STEPS.length) * 100;
  const cur = STEPS[step];

  function renderStep() {
    switch (cur.key) {
      case 'space':
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SPACES.map((s, i) => (
              <button key={s.id} onClick={() => selectSingle('space', s.id)} className={`press lift img-zoom fade-up group relative overflow-hidden rounded-lg border text-left ${a.space === s.id ? 'border-foreground ring-2 ring-foreground' : 'border-border hover:border-foreground/40'}`} style={{aspectRatio: '1 / 1', ...stag(i)}}>
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                {a.space === s.id && <span className="check-pop absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-primary text-white"><Check className="h-3.5 w-3.5" /></span>}
                <span className="absolute inset-x-0 bottom-0 p-3 text-[13.5px] font-medium text-white">{s.id}</span>
              </button>
            ))}
          </div>
        );
      case 'size':
        return (
          <div>
            <div className="fade-up rounded-lg border border-border bg-parchment p-6" style={stag(0)}>
              <div className="flex items-end justify-between">
                <span className="text-[13px] text-muted-foreground">Approximate area</span>
                <span className="tnum font-heading text-[30px] leading-none">{a.sqft.toLocaleString()} <span className="text-[15px] text-muted-foreground">sq ft</span></span>
              </div>
              <input type="range" min={200} max={10000} step={100} value={a.sqft} onChange={(e) => setA((p) => ({...p, sqft: parseInt(e.target.value)}))} className="mt-4 w-full accent-[var(--primary)]" />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>200</span><span>10,000+</span></div>
            </div>
            <p className="fade-up mt-6 mb-2 text-[13px] font-medium" style={stag(1)}>Ceiling height</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {CEILINGS.map((c, i) => <button key={c} onClick={() => setA((p) => ({...p, ceiling: c}))} className={`press fade-up rounded-sm border px-3 py-3 text-[13px] ${a.ceiling === c ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`} style={stag(i + 2)}>{c}</button>)}
            </div>
          </div>
        );
      case 'goals':
        return (
          <div className="flex flex-wrap gap-2.5">
            {GOALS.map((g, i) => <Choice key={g} label={g} on={a.goals.includes(g)} onClick={() => toggle('goals', g)} delay={i} />)}
          </div>
        );
      case 'fixtures':
        return (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FIXTURES.map((f, i) => {
              const on = a.fixtures.includes(f.id);
              return (
                <button key={f.id} onClick={() => toggle('fixtures', f.id)} className={`press lift fade-up relative flex flex-col overflow-hidden rounded-lg border text-left ${on ? 'border-foreground ring-2 ring-foreground' : 'border-border hover:border-foreground/40'}`} style={stag(i)}>
                  <div className="img-zoom relative overflow-hidden bg-parchment" style={{aspectRatio: '16 / 10'}}>
                    {f.img ? <img src={f.img} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[12px] text-muted-foreground">Recommend for me</span>}
                    {on && <span className="check-pop absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-white"><Check className="h-3 w-3" /></span>}
                  </div>
                  <span className="px-3 py-2.5 text-[13px] font-medium">{f.id}</span>
                </button>
              );
            })}
          </div>
        );
      case 'services':
        return (
          <div className="flex flex-col gap-2.5">
            {SERVICES.map((s, i) => {
              const on = a.services.includes(s);
              return (
                <button key={s} onClick={() => toggle('services', s)} className={`press fade-up flex items-center gap-3 rounded-lg border px-4 py-4 text-left ${on ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/40'}`} style={stag(i)}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border ${on ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{on && <Check className="check-pop h-3 w-3" />}</span>
                  <span className="text-[14.5px] font-medium">{s}</span>
                </button>
              );
            })}
          </div>
        );
      case 'timeline':
        return (
          <div className="flex flex-col gap-2.5">
            {TIMELINE.map((t, i) => (
              <button key={t} onClick={() => selectSingle('timeline', t)} className={`press fade-up flex items-center justify-between rounded-lg border px-4 py-4 text-left ${a.timeline === t ? 'border-foreground ring-2 ring-foreground' : 'border-border hover:border-foreground/40'}`} style={stag(i)}>
                <span className="text-[14.5px] font-medium">{t}</span>
                <Arrow className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div>
            {/* The fixture-count / load / budget tiles are gone: quoting a
                number on the step that asks for contact details invited an
                argument about a figure we had not yet earned the right to
                give. The recommendation and turnaround stay — they say what
                happens next without pricing the job sight unseen. */}
            <p className="fade-up text-[12.5px] text-muted-foreground" style={stag(0)}>
              Approach: <span className="font-medium text-foreground">{est.rec}</span> · turnaround {est.turnaround}. Your exact plan is free.
            </p>
            <div className="mt-7 space-y-3">
              <FormField label="Full name" value={form.name} onChange={(v) => setForm((f) => ({...f, name: v}))} delay={4} placeholder="Jane Doe" error={touched && form.name.trim().length <= 1 ? 'Please enter your name' : ''} />
              <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({...f, email: v}))} delay={5} placeholder="jane@company.com" error={touched && !emailOk(form.email) ? 'Enter a valid email' : ''} />
              <FormField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({...f, phone: v}))} delay={6} placeholder="(818) 555-0190" error={touched && !phoneOk(form.phone) ? 'Enter a valid phone number' : ''} />
              <div className="fade-up" style={stag(7)}>
                <SmsConsent id="calc-sms" checked={sms} onCheckedChange={setSms} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="w-full bg-background text-foreground font-body antialiased">
      <div className="grid w-full grid-cols-1 lg:min-h-[84vh] lg:grid-cols-[0.9fr_1.1fr]">
        {/* left panel (full-bleed, sticky) */}
        <aside className="relative hidden overflow-hidden border-r border-border bg-onyx text-white lg:block">
          <img src={SPACES.find((s) => s.id === a.space)?.img || IMG.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" style={{transition: 'opacity .6s var(--ease-out)'}} />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/80 to-onyx" />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <div>
              <p className="type-eyebrow" style={{color: 'rgba(255,255,255,0.6)'}}>Lighting design calculator</p>
              <h1 className="mt-3 max-w-sm text-balance font-heading text-[34px] leading-[1.08] xl:text-[38px]">{tidy('Your free lighting plan, in about a minute.')}</h1>
              <p className="mt-4 max-w-sm text-pretty text-[14.5px] leading-relaxed text-white/70">
                {tidy('Answer a few questions and we’ll come back with a photometric layout, a fixture list and a fixed quote — at no cost.')}
              </p>
            </div>
            <div className="my-8 space-y-2.5">
              <SummaryRow label="Space" value={a.space} />
              <SummaryRow label="Size" value={a.space || a.sqft !== 1500 ? `${a.sqft.toLocaleString()} sq ft · ${a.ceiling.split(' (')[0]}` : ''} />
              <SummaryRow label="Goals" value={a.goals.length ? `${a.goals.length} selected` : ''} />
              <SummaryRow label="Fixtures" value={a.fixtures.length ? a.fixtures.join(', ') : ''} />
              <SummaryRow label="Services" value={a.services.length ? `${a.services.length} selected` : ''} />
              <SummaryRow label="Timeline" value={a.timeline} />
            </div>
            <div className="flex items-center gap-4 text-[12px] text-white/65">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> C-10 licensed</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Replies in 1 business day</span>
            </div>
          </div>
        </aside>

        {/* right panel (wizard) */}
        <main className="flex min-h-full flex-col px-5 py-10 sm:px-10 lg:px-16">
          {!submitted ? (
            <div className="mx-auto my-auto flex w-full max-w-[580px] flex-col">
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-[12px] text-muted-foreground">
                  <span>Step {step + 1} of {STEPS.length}</span>
                  <span className="tnum">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{width: `${progress}%`, transition: 'width .5s var(--ease-out)'}} />
                </div>
              </div>

              <div key={step}>
                <h2 className="fade-up text-balance font-heading text-[26px] leading-[1.15] sm:text-[30px]">{tidy(cur.q)}</h2>
                <p className="fade-up mt-2 text-pretty text-[14px] text-muted-foreground" style={{animationDelay: '70ms'}}>{tidy(cur.sub)}</p>
                <div className="mt-7">{renderStep()}</div>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4">
                {step > 0 ? <button onClick={goBack} className="press inline-flex h-11 items-center gap-2 rounded-sm border border-border px-4 text-[13.5px] font-medium hover:border-foreground/40"><Back className="h-4 w-4" /> Back</button> : <span />}
                {step !== SPACE_I && step !== TIMELINE_I && (step === CONTACT_I ? <button onClick={submit} className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Get my free plan <Arrow className="h-4 w-4" /></button> : <button onClick={goNext} className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Continue <Arrow className="h-4 w-4" /></button>)}
              </div>
            </div>
          ) : (
            <div className="mx-auto my-auto w-full max-w-[580px]"><Success a={a} est={est} name={form.name} /></div>
          )}
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-5 text-[12px] text-muted-foreground sm:flex-row">
            <span>© 2026 {COMPANY_NAME} · C-10 Licensed</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Your details stay private — we only use them to send your plan.</span>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ----- small components ----- */
function SummaryRow({label, value}: {label: string; value: string}) {
  const filled = !!value;
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-white/10 pb-2.5 text-[13px] transition-opacity duration-300 ${filled ? 'opacity-100' : 'opacity-45'}`}>
      <span className="flex items-center gap-2 text-white/60">
        <span className={`grid h-4 w-4 place-items-center rounded-full ${filled ? 'bg-primary text-white' : 'border border-white/25'}`}>{filled && <Check className="check-pop h-2.5 w-2.5" />}</span>
        {label}
      </span>
      <span className="truncate text-right font-medium text-white">{value || '—'}</span>
    </div>
  );
}
function Choice({label, on, onClick, delay = 0}: {label: string; on: boolean; onClick: () => void; delay?: number}) {
  return (
    <button onClick={onClick} style={stag(delay)} className={`press fade-up inline-flex items-center gap-2 rounded-sm border px-3.5 py-2.5 text-[13.5px] ${on ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`}>
      {on && <Check className="h-3.5 w-3.5" />}{label}
    </button>
  );
}
function FormField({label, value, onChange, placeholder, type = 'text', error, delay = 0}: {label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; error?: string; delay?: number}) {
  return (
    <label className="fade-up block" style={stag(delay)}>
      <span className="mb-1.5 block text-[12.5px] font-medium">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`h-12 w-full rounded-sm border bg-background px-4 text-[14px] outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground ${error ? 'border-destructive' : 'border-input'}`} />
      {error && <span className="mt-1 block text-[12px] text-destructive">{error}</span>}
    </label>
  );
}
function Success({a, est, name}: {a: Answers; est: {fixtures: number; rec: string}; name: string}) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[580px] flex-col items-center justify-center py-16 text-center">
      <span className="ring-pulse grid h-20 w-20 place-items-center rounded-full bg-primary text-white">
        <Check className="check-pop h-9 w-9" />
      </span>
      <h2 className="fade-up mt-7 font-heading text-[30px] leading-[1.1]" style={stag(1)}>Your plan request is in{name ? `, ${name.split(' ')[0]}` : ''}.</h2>
      <p className="fade-up mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground" style={stag(2)}>
        A lighting specialist will email and call within one business day with your photometric layout, fixture list and a fixed quote.
      </p>
      <div className="fade-up mt-8 w-full rounded-lg border border-border bg-parchment p-5 text-left" style={stag(3)}>
        <p className="text-[12px] uppercase tracking-wide text-muted-foreground">Your brief</p>
        <div className="mt-3 space-y-2 text-[13.5px]">
          <Row k="Space" v={a.space || '—'} />
          <Row k="Size" v={`${a.sqft.toLocaleString()} sq ft · ${a.ceiling.split(' (')[0]}`} />
          <Row k="Recommended" v={est.rec} />
          <Row k="Est. fixtures" v={`~${est.fixtures}`} />
          <Row k="Services" v={a.services.length ? a.services.join(', ') : 'To discuss'} />
        </div>
      </div>
      <div className="fade-up mt-7 flex flex-col gap-3 sm:flex-row" style={stag(4)}>
        <Link to="/collections" className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Explore the catalog <Arrow className="h-4 w-4" /></Link>
        <a href={CONTACT.phoneHref} className="press inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border px-6 text-[14px] hover:border-foreground/40"><Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}</a>
      </div>
    </div>
  );
}
function Row({k, v}: {k: string; v: string}) {
  return <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0 last:pb-0"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div>;
}
