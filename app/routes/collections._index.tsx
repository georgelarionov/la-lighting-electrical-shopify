import React, {useState, useMemo} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections._index';
import {Reveal} from '~/components/Reveal';
import {QuoteButton} from '~/components/QuoteButton';
import {COMPANY_NAME} from '~/lib/site';
import ringBlack from '~/assets/mp/pendant-black.jpg?url';
import ringGold from '~/assets/mp/pendant-gold.jpg?url';
import round from '~/assets/mp/round-led.jpg?url';
import panel from '~/assets/mp/led-panel.jpg?url';
import linear from '~/assets/mp/linear-48.jpg?url';
import connector from '~/assets/mp/connector.jpg?url';
import heroLinear from '~/assets/mp/linear-hero.jpg?url';
import serviceImg from '~/assets/mp/catalog-service.jpg?url';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `Catalog | ${COMPANY_NAME}`},
    {
      name: 'description',
      content:
        'Architectural lighting — pendants, linear, panels and connectors. Every fixture available as a part, a plan, or a fully installed result.',
    },
  ];
};

// Real Shopify prices merged onto the mockup catalog by handle.
export async function loader({context}: Route.LoaderArgs) {
  const data = await context.storefront
    .query(CATALOG_PRICES_QUERY)
    .catch(() => null);
  const prices: Record<string, string> = {};
  for (const p of data?.products?.nodes ?? []) {
    prices[p.handle] = p.priceRange.minVariantPrice.amount;
  }
  return {prices};
}

/* icons (from mockup) */
type IP = {className?: string};
const Arrow = ({className}: IP) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Chevron = ({className}: IP) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
);
const X = ({className}: IP) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const Sliders = ({className}: IP) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>
);

/* ----------------------------- data: 16 real products ----------------------------- */
type Cat = 'Pendant' | 'Round' | 'Linear' | 'Panel' | 'Connector';
type Product = {
  id: string;
  name: string;
  type: string;
  cat: Cat;
  img: string;
  price: number;
  finishes: string[];
  ccts: string[];
  mounts: string[];
  apps: string[];
  installable: boolean;
  featured?: boolean;
};
const C3 = ['3000K', '3500K', '4000K'];
const PRODUCTS: Product[] = [
  {id: 'standart-ring-62', name: 'Standart Ring 62"', type: 'Ring Pendant', cat: 'Pendant', img: ringBlack, price: 189, finishes: ['Black', 'White', 'Gold'], ccts: C3, mounts: ['Suspended', 'Cable'], apps: ['Residential', 'HoReCa', 'Office'], installable: true, featured: true},
  {id: 'standart-ring-47', name: 'Standart Ring 47"', type: 'Ring Pendant', cat: 'Pendant', img: ringGold, price: 159, finishes: ['Black', 'White', 'Gold'], ccts: C3, mounts: ['Suspended', 'Cable'], apps: ['Residential', 'HoReCa'], installable: true},
  {id: 'standart-ring-36', name: 'Standart Ring 36"', type: 'Ring Pendant', cat: 'Pendant', img: ringBlack, price: 129, finishes: ['Black', 'White', 'Gold'], ccts: C3, mounts: ['Suspended', 'Cable'], apps: ['Residential'], installable: true},
  {id: 'round-36-rod', name: 'Round LED 36" — Rod', type: 'Round LED', cat: 'Round', img: round, price: 149, finishes: ['Black', 'White'], ccts: C3, mounts: ['Rod'], apps: ['Office', 'Retail'], installable: true},
  {id: 'round-36-suspended', name: 'Round LED 36" — Suspended', type: 'Round LED', cat: 'Round', img: round, price: 149, finishes: ['Black', 'White'], ccts: C3, mounts: ['Suspended'], apps: ['Office', 'Retail'], installable: true},
  {id: 'round-36-surface', name: 'Round LED 36" — Surface', type: 'Round LED', cat: 'Round', img: round, price: 139, finishes: ['Black', 'White'], ccts: C3, mounts: ['Surface'], apps: ['Office', 'Residential'], installable: true},
  {id: 'round-24-rod', name: 'Round LED 24" — Rod', type: 'Round LED', cat: 'Round', img: round, price: 119, finishes: ['Black', 'White'], ccts: C3, mounts: ['Rod'], apps: ['Office', 'Retail'], installable: true},
  {id: 'round-24-suspended', name: 'Round LED 24" — Suspended', type: 'Round LED', cat: 'Round', img: round, price: 119, finishes: ['Black', 'White'], ccts: C3, mounts: ['Suspended'], apps: ['Office', 'HoReCa'], installable: true},
  {id: 'round-24-surface', name: 'Round LED 24" — Surface', type: 'Round LED', cat: 'Round', img: round, price: 109, finishes: ['Black', 'White'], ccts: C3, mounts: ['Surface'], apps: ['Residential'], installable: true},
  {id: 'architectural-led-lighting', name: 'Architectural Linear Lighting', type: 'Linear System', cat: 'Linear', img: heroLinear, price: 99, finishes: ['Black', 'White'], ccts: C3, mounts: ['Canopy', 'T-Clip', 'T-Support', 'Surface'], apps: ['Office', 'Retail', 'HoReCa', 'Museum'], installable: true, featured: true},
  {id: '48-led-linear-light', name: '48" LED Linear Light', type: 'Linear', cat: 'Linear', img: linear, price: 99, finishes: ['Black', 'White'], ccts: C3, mounts: ['Canopy', 'T-Clip', 'T-Support'], apps: ['Office', 'Retail'], installable: true},
  {id: '48-led-panel-light', name: '48" LED Panel Light', type: 'Panel', cat: 'Panel', img: panel, price: 129, finishes: ['Black', 'White'], ccts: C3, mounts: ['Canopy', 'T-Clip', 'T-Support'], apps: ['Office'], installable: true},
  {id: 'x-connector', name: 'Linear X-Connector', type: 'Accessory', cat: 'Connector', img: connector, price: 39, finishes: ['Black', 'White'], ccts: [], mounts: [], apps: [], installable: false},
  {id: 'l-connector', name: 'Linear L-Connector', type: 'Accessory', cat: 'Connector', img: connector, price: 34, finishes: ['Black', 'White'], ccts: [], mounts: [], apps: [], installable: false},
  {id: 't-connector', name: 'Linear T-Connector', type: 'Accessory', cat: 'Connector', img: connector, price: 36, finishes: ['Black', 'White'], ccts: [], mounts: [], apps: [], installable: false},
  {id: 'y-connector', name: 'Linear Y-Connector', type: 'Accessory', cat: 'Connector', img: connector, price: 36, finishes: ['Black', 'White'], ccts: [], mounts: [], apps: [], installable: false},
];
const CATS: Cat[] = ['Pendant', 'Round', 'Linear', 'Panel', 'Connector'];
const FINISHES = [
  {id: 'Black', hex: '#1c1a17'},
  {id: 'White', hex: '#f3f1ec'},
  {id: 'Gold', hex: '#b89968'},
];
const MOUNTS = ['Suspended', 'Surface', 'Rod', 'Canopy', 'T-Clip', 'T-Support', 'Cable'];
const APPS = ['Office', 'Retail', 'HoReCa', 'Residential', 'Museum'];
const SORTS = ['Featured', 'Price: low → high', 'Price: high → low', 'Name A → Z'];
const MAX_PRICE = 200;
const fmt = (n: number) => '$' + n.toLocaleString('en-US');
const has = (s: Set<string>) => s.size > 0;
const intersects = (a: string[], s: Set<string>) => a.some((x) => s.has(x));

export default function Catalog() {
  const {prices} = useLoaderData<typeof loader>();
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [ccts, setCcts] = useState<Set<string>>(new Set());
  const [finishes, setFinishes] = useState<Set<string>>(new Set());
  const [mounts, setMounts] = useState<Set<string>>(new Set());
  const [apps, setApps] = useState<Set<string>>(new Set());
  const [services, setServices] = useState<Set<string>>(new Set());
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [sort, setSort] = useState(SORTS[0]);
  const [drawer, setDrawer] = useState(false);
  const toggle = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    v: string,
  ) =>
    setter((prev) => {
      const n = new Set(prev);
      if (n.has(v)) n.delete(v);
      else n.add(v);
      return n;
    });
  const clearAll = () => {
    setCats(new Set());
    setCcts(new Set());
    setFinishes(new Set());
    setMounts(new Set());
    setApps(new Set());
    setServices(new Set());
    setPriceMax(MAX_PRICE);
  };
  const filtered = useMemo(() => {
    let r = PRODUCTS.filter(
      (p) =>
        (!has(cats) || cats.has(p.cat)) &&
        (!has(ccts) || intersects(p.ccts, ccts)) &&
        (!has(finishes) || intersects(p.finishes, finishes)) &&
        (!has(mounts) || intersects(p.mounts, mounts)) &&
        (!has(apps) || intersects(p.apps, apps)) &&
        (!has(services) || p.installable) &&
        p.price <= priceMax,
    );
    if (sort === 'Price: low → high') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: high → low') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'Name A → Z') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else r = [...r].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return r;
  }, [cats, ccts, finishes, mounts, apps, services, priceMax, sort]);
  const chips: {group: string; v: string; clear: () => void}[] = [
    ...[...cats].map((v) => ({group: 'Category', v, clear: () => toggle(setCats, v)})),
    ...[...ccts].map((v) => ({group: 'CCT', v, clear: () => toggle(setCcts, v)})),
    ...[...finishes].map((v) => ({group: 'Finish', v, clear: () => toggle(setFinishes, v)})),
    ...[...mounts].map((v) => ({group: 'Mount', v, clear: () => toggle(setMounts, v)})),
    ...[...apps].map((v) => ({group: 'Use', v, clear: () => toggle(setApps, v)})),
    ...[...services].map((v) => ({group: 'Service', v, clear: () => toggle(setServices, v)})),
    ...(priceMax < MAX_PRICE
      ? [{group: 'Price', v: `≤ ${fmt(priceMax)}`, clear: () => setPriceMax(MAX_PRICE)}]
      : []),
  ];
  const FilterPanel = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {CATS.map((c) => (
          <CheckRow key={c} label={c} count={PRODUCTS.filter((p) => p.cat === c).length} checked={cats.has(c)} onClick={() => toggle(setCats, c)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Color temperature">
        <div className="flex flex-wrap gap-2">
          {C3.map((c) => <Pill key={c} label={c} active={ccts.has(c)} onClick={() => toggle(setCcts, c)} />)}
        </div>
      </FilterGroup>
      <FilterGroup title="Finish">
        <div className="flex flex-wrap gap-2">
          {FINISHES.map((f) => (
            <button key={f.id} onClick={() => toggle(setFinishes, f.id)} className={`press flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-[12.5px] ${finishes.has(f.id) ? 'border-foreground' : 'border-border hover:border-foreground/40'}`}>
              <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{background: f.hex}} />{f.id}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Mounting">
        <div className="flex flex-wrap gap-2">
          {MOUNTS.map((m) => <Pill key={m} label={m} active={mounts.has(m)} onClick={() => toggle(setMounts, m)} />)}
        </div>
      </FilterGroup>
      <FilterGroup title="Application">
        <div className="flex flex-wrap gap-2">
          {APPS.map((a) => <Pill key={a} label={a} active={apps.has(a)} onClick={() => toggle(setApps, a)} />)}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
          <span>$0</span><span className="tnum font-medium text-foreground">≤ {fmt(priceMax)}</span>
        </div>
        <input type="range" min={30} max={MAX_PRICE} step={10} value={priceMax} onChange={(e) => setPriceMax(parseInt(e.target.value))} className="mt-2 w-full accent-[var(--onyx)]" />
      </FilterGroup>
      <FilterGroup title="Service">
        <CheckRow label="Installation available" checked={services.has('install')} onClick={() => toggle(setServices, 'install')} />
        <CheckRow label="Free design plan" checked={services.has('design')} onClick={() => toggle(setServices, 'design')} />
      </FilterGroup>
    </div>
  );
  return (
    <div className="w-full bg-background text-foreground font-body antialiased">
      {/* title */}
      <section className="mx-auto max-w-[1320px] px-5 pb-8 pt-12 sm:px-8">
        <Reveal>
          <p className="type-eyebrow">Catalog</p>
          <h1 className="mt-3 font-heading text-[38px] leading-[1.05] tracking-[-0.02em] sm:text-[52px]">The Catalog</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Architectural lighting — pendants, linear, panels and the connectors that tie them together. Every fixture available as a part, a plan, or a fully installed result.
          </p>
        </Reveal>
      </section>

      {/* main */}
      <div className="mx-auto max-w-[1320px] px-5 pb-24 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[248px_1fr] lg:gap-12">
          {/* sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar pr-1">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[13px] font-medium">Filters</span>
                {chips.length > 0 && <button onClick={clearAll} className="press text-[12px] text-muted-foreground hover:text-foreground">Clear all</button>}
              </div>
              {FilterPanel}
            </div>
          </aside>

          {/* results */}
          <main>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <button onClick={() => setDrawer(true)} className="press flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-[13px] lg:hidden">
                <Sliders className="h-4 w-4" /> Filters{chips.length > 0 && <span className="ml-1 rounded-full bg-foreground px-1.5 text-[11px] text-background">{chips.length}</span>}
              </button>
              <span className="text-[13px] text-muted-foreground"><span className="tnum font-medium text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'fixture' : 'fixtures'}</span>
              <label className="flex items-center gap-2 text-[13px]">
                <span className="hidden text-muted-foreground sm:inline">Sort</span>
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="press appearance-none rounded-sm border border-border bg-background py-2 pl-3 pr-8 text-[13px] hover:border-foreground/40 focus:outline-none">
                    {SORTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <Chevron className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button key={c.group + c.v} onClick={c.clear} className="press group flex items-center gap-1.5 rounded-sm border border-border bg-parchment px-2.5 py-1 text-[12px] hover:border-foreground/40">
                    <span className="text-muted-foreground">{c.group}:</span> {c.v}
                    <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="mt-16 rounded-lg border border-dashed border-border py-20 text-center">
                <p className="font-heading text-[20px]">No fixtures match those filters</p>
                <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted-foreground">Clear a filter — or talk to us, we build custom runs to any spec.</p>
                <button onClick={clearAll} className="press mt-5 inline-flex h-10 items-center rounded-sm bg-primary px-5 text-[13.5px] font-medium text-primary-foreground hover:bg-primary/90">Clear all filters</button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3">
                {filtered.flatMap((p, i) => {
                  const card = <ProductCard key={p.id} p={p} realPrice={prices[p.id]} />;
                  if (i === 8) return [<ServicesBand key="band" />, card];
                  return [card];
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawer ? '' : 'pointer-events-none'}`}>
        <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawer ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${drawer ? 'translate-x-0' : 'translate-x-full'}`} style={{transitionTimingFunction: 'var(--ease-out)'}}>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-[14px] font-medium">Filters</span>
            <button onClick={() => setDrawer(false)} className="press grid h-8 w-8 place-items-center rounded-sm hover:bg-muted"><X className="h-[18px] w-[18px]" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{FilterPanel}</div>
          <div className="flex items-center gap-3 border-t border-border px-5 py-4">
            <button onClick={clearAll} className="press h-11 flex-1 rounded-sm border border-border text-[13.5px]">Clear all</button>
            <button onClick={() => setDrawer(false)} className="press h-11 flex-1 rounded-sm bg-primary text-[13.5px] font-medium text-primary-foreground">Show {filtered.length}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- pieces ----------------------------- */
function ProductCard({p, realPrice}: {p: Product; realPrice?: string}) {
  const priceLabel = realPrice
    ? `From ${fmt(Math.round(Number(realPrice)))}`
    : `From ${fmt(p.price)}`;
  return (
    <Reveal>
      <Link to={`/products/${p.id}`} prefetch="intent" className="lift group block">
        <div className="img-zoom relative overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '1 / 1'}}>
          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
          {p.featured && <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur">Featured</span>}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-sm bg-background/95 text-[12.5px] font-medium backdrop-blur">Configure <Arrow className="h-3.5 w-3.5" /></span>
          </div>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="type-eyebrow !text-[10px]">{p.type}</p>
            <h3 className="mt-1 truncate text-[14px] font-medium">{p.name}</h3>
          </div>
          <span className="tnum shrink-0 text-[13.5px] text-muted-foreground">{priceLabel}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {p.finishes.map((f) => {
              const hex = FINISHES.find((x) => x.id === f)!.hex;
              return <span key={f} className="h-3 w-3 rounded-full border border-black/10" style={{background: hex}} />;
            })}
          </div>
          {p.ccts.length > 0 && <span className="text-[11px] text-muted-foreground">· {p.ccts.length} CCT</span>}
        </div>
      </Link>
    </Reveal>
  );
}
function ServicesBand() {
  return (
    <div className="col-span-2 md:col-span-3">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-lg bg-onyx text-white">
          <img src={serviceImg} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-black/40" />
          <div className="grid grid-cols-1 items-center gap-4 px-7 py-9 sm:grid-cols-[1fr_auto] sm:px-10">
            <div>
              <p className="type-eyebrow" style={{color: 'rgba(255,255,255,0.65)'}}>Buying for a whole space?</p>
              <h3 className="mt-2 font-heading text-[24px] leading-tight sm:text-[28px]">Get a free photometric plan and a licensed install quote.</h3>
              <p className="mt-2 max-w-lg text-[14px] text-white/75">Send a floor plan or a few photos — we return a layout, fixture count and a fixed price. C-10 licensed, Title 24, across LA County.</p>
            </div>
            <QuoteButton className="press inline-flex h-12 items-center gap-2 self-start rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90 sm:self-auto">Start a project <Arrow className="h-4 w-4" /></QuoteButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
function FilterGroup({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div>
      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function CheckRow({label, count, checked, onClick}: {label: string; count?: number; checked: boolean; onClick: () => void}) {
  return (
    <button onClick={onClick} className="press flex w-full items-center gap-2.5 py-1 text-left text-[13.5px]">
      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border ${checked ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>
        {checked && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span className={checked ? 'text-foreground' : 'text-foreground/85'}>{label}</span>
      {count !== undefined && <span className="ml-auto text-[12px] text-muted-foreground">{count}</span>}
    </button>
  );
}
function Pill({label, active, onClick}: {label: string; active: boolean; onClick: () => void}) {
  return (
    <button onClick={onClick} className={`press rounded-sm border px-2.5 py-1.5 text-[12.5px] ${active ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/40'}`}>
      {label}
    </button>
  );
}

const CATALOG_PRICES_QUERY = `#graphql
  query CatalogPrices($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 100) {
      nodes {
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
