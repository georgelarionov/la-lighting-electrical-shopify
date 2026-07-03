import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {seo} from '~/lib/seo';
import {getSelectedProductOptions, Analytics} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {Reveal} from '~/components/Reveal';
import {QuoteButton} from '~/components/QuoteButton';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import hero from '~/assets/mp/linear-hero.jpg?url';
import config from '~/assets/mp/twoup-config.jpg?url';
import insitu from '~/assets/mp/insitu.jpg?url';
import detail from '~/assets/mp/detail.jpg?url';
import white from '~/assets/mp/twoup-white.jpg?url';
import serviceImg from '~/assets/mp/catalog-service.jpg?url';
import panelImg from '~/assets/mp/led-panel.jpg?url';
import connectorImg from '~/assets/mp/connector.jpg?url';

export const meta: Route.MetaFunction = ({data, location}) => {
  // ponytail: canonical is now handled inside seo() via url — dropped the raw
  // {rel:'canonical'} descriptor (which was also malformed: rel/href without tagName).
  return seo({
    title: `${data?.product.title ?? 'Product'} | ${COMPANY_NAME}`,
    description: data?.product.seo?.description ?? '',
    url: location.pathname,
    type: 'product',
  });
};

export async function loader(args: Route.LoaderArgs) {
  const {context, params, request} = args;
  const {handle} = params;
  if (!handle) throw new Error('Expected product handle to be defined');

  const [{product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) throw new Response(null, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: product});
  return {product};
}

/* ----------------------------- icons ------------------------------ */
type IP = {className?: string};
const Star = ({className}: IP) => <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>;
const Check = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>;
const Plus = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}><path d="M12 5v14M5 12h14" /></svg>;
const Minus = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}><path d="M5 12h14" /></svg>;
const Arrow = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const Chevron = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>;
const Phone = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>;
const Shield = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
const Bolt = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>;
const Ruler = ({className}: IP) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" /><path d="m7.5 10.5 2 2M11 7l2 2M14.5 3.5l2 2M4 14l2 2" /></svg>;

/* --------------------------- data (placeholder configurator) ------ */
const LENGTHS = [
  {id: '2ft', label: '2 ft', watt: 20, lumens: 2600, price: 99},
  {id: '4ft', label: '4 ft', watt: 40, lumens: 5200, price: 149},
  {id: '8ft', label: '8 ft', watt: 80, lumens: 10400, price: 229},
] as const;
const COLORS = [{id: 'Black', hex: '#1c1a17'}, {id: 'White', hex: '#f3f1ec'}] as const;
const CCTS = [
  {id: '3000K', label: '3000K', sub: 'Warm', hex: '#f4d9ad'},
  {id: '3500K', label: '3500K', sub: 'Neutral', hex: '#f7ecd6'},
  {id: '4000K', label: '4000K', sub: 'Cool', hex: '#fbf7ef'},
] as const;
const DIRECTIONS = ['Down', 'Up & Down'] as const;
const MOUNTS = ['J-Box Canopy', 'T-Clip', 'T-Support', 'Surface'] as const;
const DIMMING = ['0–10V', 'Non-dim'] as const;
const SHAPES = [
  {id: 'Line', label: 'Straight line', connectors: 'In-line couplers'},
  {id: 'L', label: 'L-shape', connectors: '1 × L-connector'},
  {id: 'Rectangle', label: 'Rectangle', connectors: '4 × L-connector'},
  {id: 'Grid', label: 'Grid', connectors: '4 × T + 1 × X'},
  {id: 'Custom', label: 'Custom', connectors: 'We spec it'},
] as const;
const FEATURES = [
  {t: 'Seamless continuous runs', d: 'No dark gaps between fixtures — light reads as one unbroken line across the ceiling.', img: hero},
  {t: 'Configurable geometry', d: 'L, T, X and Y connectors turn straight runs into rectangles, grids and bespoke shapes.', img: config},
  {t: 'Tunable to the room', d: '3000–4000K and up- or down-light to match the space, from warm hospitality to crisp retail.', img: insitu},
];
const FEATURE_GRID = [
  {icon: Ruler, t: 'Architectural-grade aluminum', d: 'Extruded body, frosted diffuser, precision end caps. Built to disappear into the architecture.'},
  {icon: Bolt, t: 'Flicker-free dimming', d: 'Smooth 0–10V dimming with 94+ CRI, so colors stay true at every level.'},
  {icon: Shield, t: 'Code-ready', d: 'Title 24 certified and documented for permits and inspection.'},
];
const SPECS: [string, string][] = [['Fixture type', 'LED linear — suspended / surface'], ['CRI', '94+'], ['Color temperature', '3000K / 3500K / 4000K'], ['Power', '20W (2ft) · 40W (4ft) · 80W (8ft)'], ['Lumen output', '2,600 · 5,200 · 10,400 lm'], ['Input voltage', '100–277 VAC'], ['Dimming', '0–10V / 1–10V'], ['Lifetime', '70,000 hours'], ['Light direction', 'Down · Up & Down'], ['Material', 'Extruded aluminum, frosted diffuser'], ['Body color', 'Black / White'], ['Mounting', 'J-Box Canopy / T-Clip / T-Support / Surface'], ['Compliance', 'Title 24 certified'], ['Warranty', '5 years'], ['Outdoor rated', 'No']];
const FAQS = [
  {q: 'Do you install, or just ship the fixtures?', a: 'Both. We provide licensed C-10 installation across Los Angeles County, or ship anywhere in the US for self-install.'},
  {q: 'How fast can I get it?', a: 'In-stock configurations ship in 3–5 business days. Custom runs get a firm date before you commit.'},
  {q: 'Will it work with my dimmer?', a: 'Standard 0–10V dimming is compatible with most commercial dimmers. We confirm compatibility on every free design plan.'},
  {q: 'Can you do custom lengths and shapes?', a: 'Yes — connectors build any geometry and we cut continuous runs to your exact plan.'},
  {q: 'Is it code-compliant?', a: 'Title 24 certified and documented for permits and inspection.'},
  {q: "What if it isn't right?", a: '30-day returns on stock items. Design plans are always free.'},
];
const REVIEWS = [
  {n: 'Marina D.', r: 'Retail rollout · 1,200 ft', t: 'The continuous runs are flawless — not a single visible joint. Their team drew the whole layout before we ordered a thing.'},
  {n: 'Anthony R.', r: 'Office TI · Culver City', t: 'Spec, supply and licensed install from one place. Passed Title 24 inspection first time.'},
  {n: 'Priya S.', r: 'Restaurant · West Hollywood', t: '3000K up-and-down completely changed the room. Warm, even, zero glare on the tables.'},
];
const CROSS = [
  {t: 'X-Connector', img: connectorImg, p: 'From $39', to: '/products/x-connector'},
  {t: 'L-Connector', img: connectorImg, p: 'From $34', to: '/products/l-connector'},
  {t: 'T-Connector', img: connectorImg, p: 'From $36', to: '/products/t-connector'},
  {t: '48" LED Panel Light', img: panelImg, p: 'From $129', to: '/products/48-led-panel-light'},
];
const TIERS = [
  {id: 'fixture', t: 'Fixture only', s: 'You install it.', d: 'The configured fixture, shipped to your door with a clear install guide.', cta: 'Add to cart', tag: ''},
  {id: 'design', t: 'Fixture + Lighting design', s: 'Free photometric plan.', d: 'We return a layout, fixture count and spacing for your exact space — at no charge.', cta: 'Add design plan', tag: ''},
  {id: 'install', t: 'Fixture + Licensed install', s: 'Turnkey, to code.', d: 'C-10 electricians install everything to Title 24. You flip the switch.', cta: 'Get install quote', tag: 'Most popular'},
] as const;
const MOCK_GALLERY = [
  {src: hero, alt: 'Architectural linear pendant in a bright minimalist interior'},
  {src: config, alt: 'Connected linear fixtures forming a ceiling grid'},
  {src: insitu, alt: 'Linear lighting in an upscale retail interior'},
  {src: detail, alt: 'Macro detail of the diffuser and end cap'},
  {src: white, alt: 'White linear fixture, studio shot'},
];
const fmt = (n: number) => '$' + n.toLocaleString('en-US');

/* ============================ component ============================ */
export default function ProductPageArchitecturalLinear() {
  const {product} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const variant = product.selectedOrFirstAvailableVariant;
  const realUnit = variant?.price ? Number(variant.price.amount) : undefined;

  const [len, setLen] = useState<(typeof LENGTHS)[number]['id']>('4ft');
  const [color, setColor] = useState<(typeof COLORS)[number]['id']>('Black');
  const [cct, setCct] = useState<(typeof CCTS)[number]['id']>('3500K');
  const [dir, setDir] = useState<(typeof DIRECTIONS)[number]>('Down');
  const [mount, setMount] = useState<(typeof MOUNTS)[number]>('J-Box Canopy');
  const [dim, setDim] = useState<(typeof DIMMING)[number]>('0–10V');
  const [qty, setQty] = useState(1);
  const [tier, setTier] = useState<(typeof TIERS)[number]['id']>('design');
  const [active, setActive] = useState(0);
  const [shape, setShape] = useState<(typeof SHAPES)[number]['id']>('Line');
  const [specOpen, setSpecOpen] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [runFeet, setRunFeet] = useState(24);

  const lenObj = useMemo(() => LENGTHS.find((l) => l.id === len)!, [len]);
  const unit = realUnit ?? lenObj.price;
  const total = unit * qty;
  const lenFeet = parseInt(len);
  const fixturesNeeded = Math.max(1, Math.ceil(runFeet / lenFeet));

  // Real product gallery when present; otherwise the mockup renders.
  const realImages = (product.images?.nodes ?? []).map((n) => ({
    src: n.url,
    alt: n.altText || product.title,
  }));
  const gallery = realImages.length ? realImages : MOCK_GALLERY;
  const safeActive = Math.min(active, gallery.length - 1);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0),
      {threshold: 0},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (color === 'White' && gallery.length > 4) setActive(4);
  }, [color, gallery.length]);

  const configSummary = `${lenObj.label} · ${color} · ${cct}`;
  const canBuy = Boolean(variant?.availableForSale && variant?.id);
  const lines = variant?.id
    ? [{merchandiseId: variant.id, quantity: qty}]
    : [];
  const addLabel = tier === 'fixture' ? 'Add to cart' : 'Add to project';

  return (
    <div className="w-full bg-background text-foreground font-body antialiased">
      {/* breadcrumb */}
      <div className="mx-auto max-w-[1280px] px-5 pt-6 sm:px-8">
        <nav className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link to="/collections" className="hover:text-foreground">Catalog</Link><span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      {/* hero: gallery + configurator */}
      <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-14">
        {/* gallery */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="img-zoom group relative overflow-hidden rounded-md bg-parchment" style={{aspectRatio: '3 / 2'}}>
            <img key={safeActive} src={gallery[safeActive].src} alt={gallery[safeActive].alt} className="h-full w-full object-cover" style={{animation: 'fadeIn .5s var(--ease-out)'}} />
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-sm bg-background/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur">
              <Shield className="h-3.5 w-3.5" /> C-10 licensed install available
            </div>
          </div>
          <div className="no-scrollbar mt-3 flex min-w-0 gap-3 overflow-x-auto">
            {gallery.map((g, i) => (
              <button key={g.src} onClick={() => setActive(i)} className={`press relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-sm bg-parchment ${safeActive === i ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}>
                <img src={g.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* configurator / buy box */}
        <div className="flex min-w-0 flex-col">
          <p className="type-eyebrow">ECO Series · Architectural Linear</p>
          <h1 className="mt-3 font-heading text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[46px]">{product.title}</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            A seamless continuous-run LED system that draws light in clean lines — specified, supplied, and installed to California code.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-foreground">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4" />)}</div>
            <span className="text-[13px] text-muted-foreground">4.9 · <span className="underline-offset-2 hover:underline cursor-pointer">320 reviews</span></span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="tnum font-heading text-[32px] leading-none">{fmt(unit)}</span>
            <span className="text-[12.5px] text-muted-foreground">per fixture · price updates with your build</span>
          </div>

          {/* length */}
          <Field label="Length" value={`${lenObj.watt}W · ${lenObj.lumens.toLocaleString()} lm`}>
            <div className="grid grid-cols-3 gap-2">
              {LENGTHS.map((l) => (
                <SelChip key={l.id} active={len === l.id} onClick={() => setLen(l.id)}>
                  <span className="text-[14px]">{l.label}</span>
                  <span className="mt-0.5 block text-[10.5px] text-muted-foreground">{l.watt}W</span>
                </SelChip>
              ))}
            </div>
          </Field>

          {/* color */}
          <Field label="Body color" value={color}>
            <div className="flex gap-2.5">
              {COLORS.map((c) => (
                <button key={c.id} onClick={() => setColor(c.id)} className={`press flex items-center gap-2 rounded-sm border px-3 py-2 text-[13px] ${color === c.id ? 'border-foreground' : 'border-border hover:border-foreground/40'}`}>
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{background: c.hex}} />{c.id}
                </button>
              ))}
            </div>
          </Field>

          {/* cct */}
          <Field label="Color temperature" value={CCTS.find((c) => c.id === cct)!.sub}>
            <div className="grid grid-cols-3 gap-2">
              {CCTS.map((c) => (
                <SelChip key={c.id} active={cct === c.id} onClick={() => setCct(c.id)}>
                  <span className="mx-auto block h-3.5 w-3.5 rounded-full border border-black/10" style={{background: c.hex}} />
                  <span className="mt-1.5 block text-[13px]">{c.label}</span>
                  <span className="block text-[10.5px] text-muted-foreground">{c.sub}</span>
                </SelChip>
              ))}
            </div>
          </Field>

          {/* direction + dimming */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label="Light direction" tight>
              <div className="grid grid-cols-2 gap-2">
                {DIRECTIONS.map((d) => <SelChip key={d} active={dir === d} onClick={() => setDir(d)}><span className="text-[12.5px]">{d}</span></SelChip>)}
              </div>
            </Field>
            <Field label="Dimming" tight>
              <div className="grid grid-cols-2 gap-2">
                {DIMMING.map((d) => <SelChip key={d} active={dim === d} onClick={() => setDim(d)}><span className="text-[12.5px]">{d}</span></SelChip>)}
              </div>
            </Field>
          </div>

          {/* mounting */}
          <Field label="Mounting" value={mount}>
            <div className="flex flex-wrap gap-2">
              {MOUNTS.map((m) => <button key={m} onClick={() => setMount(m)} className={`press rounded-sm border px-3 py-1.5 text-[12.5px] ${mount === m ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`}>{m}</button>)}
            </div>
          </Field>

          {/* spec readout */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 rounded-md border border-border bg-parchment px-4 py-3 text-[12px] text-muted-foreground">
            {['CRI 94+', '100–277V', '70,000 h', 'Title 24'].map((s) => <span key={s} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-foreground" />{s}</span>)}
          </div>

          {/* qty + add */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-sm border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="press grid h-12 w-11 place-items-center text-foreground/70 hover:text-foreground"><Minus className="h-4 w-4" /></button>
              <span className="tnum w-8 text-center text-[15px]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="press grid h-12 w-11 place-items-center text-foreground/70 hover:text-foreground"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="flex-1">
              <AddToCartButton
                lines={lines}
                disabled={!canBuy}
                onClick={() => open('cart')}
                className="press h-12 w-auto flex-1 gap-2 rounded-sm text-[14px]"
              >
                {canBuy ? <>{addLabel} · {fmt(total)}</> : 'Sold out'}
              </AddToCartButton>
            </div>
          </div>
          <a href="#design" className="press mt-3 flex h-11 items-center justify-center gap-2 rounded-sm border border-onyx/25 text-[13.5px] hover:border-foreground">
            Book a free lighting plan <Arrow className="h-4 w-4" />
          </a>
          <p className="mt-3 text-center text-[11.5px] text-muted-foreground">Ships in 3–5 days · Licensed installation in LA County · or from $9/mo</p>
        </div>
      </section>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {/* trust strip */}
      <div className="border-y border-border bg-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-[12px] tracking-wide text-muted-foreground sm:px-8">
          {['CRI 94+', '70,000-hour life', 'Title 24 certified', '100–277 VAC', '5-year warranty', 'Designed in Italy · Built for US code'].map((t, i) => <span key={t} className="flex items-center gap-2">{i > 0 && <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />}{t}</span>)}
        </div>
      </div>

      {/* three ways to buy */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal>
          <p className="type-eyebrow">The LA difference</p>
          <h2 className="mt-3 max-w-2xl font-heading text-[32px] leading-[1.1] sm:text-[40px]">Buy the fixture. Or buy the finished result.</h2>
          <p className="mt-4 max-w-xl text-[15px] text-muted-foreground">Most lighting stores sell you a box. We can also design the layout and send a licensed crew to install it — all to California code.</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 70}>
              <button onClick={() => setTier(t.id)} className={`lift group relative flex h-full w-full flex-col rounded-lg border p-6 text-left ${tier === t.id ? 'border-foreground bg-background' : 'border-border bg-parchment hover:border-foreground/40'}`}>
                {t.tag && <span className="absolute right-4 top-4 rounded-sm bg-onyx px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">{t.tag}</span>}
                <span className={`grid h-9 w-9 place-items-center rounded-full border text-[13px] ${tier === t.id ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{i + 1}</span>
                <h3 className="mt-4 font-heading text-[20px] leading-tight">{t.t}</h3>
                <p className="mt-1 text-[13px] font-medium text-foreground">{t.s}</p>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{t.d}</p>
                <span className={`mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium ${tier === t.id ? 'text-foreground' : 'text-foreground/70'}`}>
                  {tier === t.id ? <><Check className="h-4 w-4" /> Selected</> : <>{t.cta} <Arrow className="h-4 w-4" /></>}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* feature rows */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <div className="space-y-16 md:space-y-24">
            {FEATURES.map((f, i) => (
              <Reveal key={f.t}>
                <div className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                  <div className="img-zoom overflow-hidden rounded-lg bg-background" style={{aspectRatio: '4 / 3'}}>
                    <img src={f.img} alt={f.t} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="tnum font-heading text-[14px] text-muted-foreground">0{i + 1}</span>
                    <h3 className="mt-2 font-heading text-[26px] leading-tight sm:text-[30px]">{f.t}</h3>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">{f.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {FEATURE_GRID.map((f, i) => (
              <Reveal key={f.t} delay={i * 60} className="bg-background">
                <div className="h-full p-7">
                  <f.icon className="h-6 w-6 text-foreground" />
                  <h4 className="mt-4 font-heading text-[18px]">{f.t}</h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* design your run */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="type-eyebrow">Design your run</p>
            <h2 className="mt-3 font-heading text-[32px] leading-[1.1] sm:text-[38px]">One system. Any shape.</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Pick a geometry and we&apos;ll work out the fixtures and connectors you need. Building a continuous line? Enter the total length.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {SHAPES.map((s) => <button key={s.id} onClick={() => setShape(s.id)} className={`press rounded-sm border px-3.5 py-2 text-[13px] ${shape === s.id ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`}>{s.label}</button>)}
            </div>
            <div className="mt-6 rounded-lg border border-border bg-parchment p-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Geometry</span><span className="font-medium">{SHAPES.find((s) => s.id === shape)!.label}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Connectors</span><span className="font-medium">{SHAPES.find((s) => s.id === shape)!.connectors}</span>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <label className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Total run length</span>
                  <span className="tnum font-medium">{runFeet} ft</span>
                </label>
                <input type="range" min={8} max={120} step={4} value={runFeet} onChange={(e) => setRunFeet(parseInt(e.target.value))} className="mt-3 w-full accent-[var(--onyx)]" />
                <p className="mt-3 text-[13px] text-muted-foreground">
                  ≈ <span className="tnum font-medium text-foreground">{fixturesNeeded}× {lenObj.label}</span> fixtures for a {runFeet} ft run · est. <span className="tnum font-medium text-foreground">{fmt(fixturesNeeded * unit)}</span>
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="img-zoom h-full overflow-hidden rounded-lg bg-parchment" style={{minHeight: 320}}>
              <img src={config} alt="Linear run forming a ceiling grid" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* specifications */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8">
          <button onClick={() => setSpecOpen((o) => !o)} className="press flex w-full items-center justify-between border-b border-border pb-4 text-left">
            <h2 className="font-heading text-[24px]">Specifications</h2>
            <Chevron className={`h-5 w-5 transition-transform duration-300 ${specOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="grid transition-all duration-500" style={{gridTemplateRows: specOpen ? '1fr' : '0fr'}}>
            <div className="overflow-hidden">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                {SPECS.map(([k, v], i) => (
                  <div key={k} className={`flex items-start justify-between gap-6 border-b border-border py-3 ${i % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
                    <dt className="text-[13px] text-muted-foreground">{k}</dt>
                    <dd className="text-right text-[13px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Spec sheet (PDF)', 'IES photometric files', 'Installation guide', 'Title 24 certificate'].map((d) => <button key={d} type="button" className="press inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-[12.5px] hover:border-foreground/40"><Arrow className="h-3.5 w-3.5 -rotate-45" /> {d}</button>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* lighting design service (dark) */}
      <section id="design" className="bg-onyx text-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="type-eyebrow" style={{color: 'rgba(255,255,255,0.6)'}}>Lighting design service</p>
            <h2 className="mt-3 font-heading text-[32px] leading-[1.1] sm:text-[40px]">Not sure how many you need? We&apos;ll draw it.</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Send us your space — a floor plan or a few photos — and our team returns a free photometric layout with fixture count, spacing and a fixed quote.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Office linear', 'Retail linear', 'HoReCa linear'].map((c) => <span key={c} className="rounded-sm border border-white/15 px-3 py-1.5 text-[12.5px] text-white/85">{c}</span>)}
            </div>
            <Link to="/lighting-calculator" className="press mt-7 inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">
              Start my free lighting plan <Arrow className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <div className="img-zoom overflow-hidden rounded-lg" style={{aspectRatio: '4 / 3'}}>
              <img src={serviceImg} alt="Licensed electrician installing a linear fixture" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* reviews */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-eyebrow">Reviews</p>
            <h2 className="mt-3 font-heading text-[30px]">Specified by people who light rooms for a living</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-foreground">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5" />)}</div>
            <span className="text-[14px] text-muted-foreground"><span className="font-medium text-foreground">4.9</span> · 320 reviews</span>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.n} delay={i * 70}>
              <figure className="flex h-full flex-col rounded-lg border border-border bg-parchment p-6">
                <div className="flex items-center gap-0.5 text-foreground">{[0, 1, 2, 3, 4].map((j) => <Star key={j} className="h-3.5 w-3.5" />)}</div>
                <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/90">“{r.t}”</blockquote>
                <figcaption className="mt-4 border-t border-border pt-4">
                  <span className="block text-[13px] font-medium">{r.n}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><Check className="h-3 w-3 text-foreground" />Verified install · {r.r}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[840px] px-5 py-16 sm:px-8">
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
        </div>
      </section>

      {/* cross-sell */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <Reveal><h2 className="font-heading text-[28px]">Complete the system</h2></Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CROSS.map((c, i) => (
            <Reveal key={c.t} delay={i * 60}>
              <Link to={c.to} prefetch="intent" className="lift group block">
                <div className="img-zoom overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '1 / 1'}}>
                  <img src={c.img} alt={c.t} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-3 text-[14px] font-medium">{c.t}</h3>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{c.p}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* final CTA */}
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto max-w-[900px] px-5 py-24 text-center text-white sm:px-8">
          <Reveal>
            <h2 className="mx-auto max-w-xl font-heading text-[34px] leading-[1.1] sm:text-[44px]">Light it properly — without guessing.</h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-white/80">Free lighting plan, licensed installation, California code. Talk to a lighting specialist.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <QuoteButton className="press inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">Book a free consultation <Arrow className="h-4 w-4" /></QuoteButton>
              <a href={CONTACT.phoneHref} className="press inline-flex h-12 items-center gap-2 rounded-sm border border-white/40 px-6 text-[14px] text-white hover:bg-white/10"><Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* sticky buy bar */}
      <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ${showBar ? 'translate-y-0' : 'translate-y-full'}`} style={{transitionTimingFunction: 'var(--ease-out)'}}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-3 sm:px-8">
          <img src={gallery[safeActive].src} alt="" className="hidden h-11 w-14 rounded-sm object-cover sm:block" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium">{product.title}</p>
            <p className="truncate text-[11.5px] text-muted-foreground">{configSummary}</p>
          </div>
          <span className="tnum hidden font-heading text-[18px] sm:block">{fmt(total)}</span>
          <AddToCartButton
            lines={lines}
            disabled={!canBuy}
            onClick={() => open('cart')}
            className="press h-10 w-auto gap-2 rounded-sm px-5 text-[13.5px]"
          >
            {canBuy ? 'Add to project' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: variant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: variant?.id || '',
              variantTitle: variant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

/* ----------------------------- primitives ----------------------------- */
function Field({label, value, children, tight}: {label: string; value?: string; children: React.ReactNode; tight?: boolean}) {
  return (
    <div className={tight ? '' : 'mt-5'}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[12px] font-medium tracking-wide text-foreground">{label}</span>
        {value && <span className="text-[12px] text-muted-foreground">{value}</span>}
      </div>
      {children}
    </div>
  );
}
function SelChip({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button onClick={onClick} className={`press rounded-sm border px-2 py-2.5 text-center ${active ? 'border-foreground bg-foreground/[0.03] ring-1 ring-foreground' : 'border-border hover:border-foreground/40'}`}>
      {children}
    </button>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 8) {
      nodes { id url altText width height }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch { color image { previewImage { url } } }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
