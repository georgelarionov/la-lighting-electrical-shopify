import {useMemo, useRef, useState} from 'react';
import {Link} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {Reveal} from '~/components/Reveal';
import {CONTACT} from '~/lib/site';
import {cn} from '~/lib/utils';
import {
  CONNECTORS,
  PROOF,
  SHAPES,
  SHOW_MOCKS,
  SIZES,
  TIERS,
  partsOf,
  type ConnectorType,
  type Part,
  type ShapeSize,
  type Size,
} from '~/lib/als';
import resortImg from '~/assets/project-7.jpg?url';

/* ------------------------------- data types ------------------------------- */
export type PartVariant = {
  id: string;
  availableForSale: boolean;
  price: {amount: string; currencyCode: string};
  selectedOptions: ReadonlyArray<{name: string; value: string}>;
};
export type AlsParts = {
  sections: ReadonlyArray<PartVariant>;
  connectors: Partial<Record<ConnectorType, ReadonlyArray<PartVariant>>>;
};

const opt = (v: PartVariant, name: string) =>
  v.selectedOptions.find((o) => o.name === name)?.value;

export function sectionVariant(
  parts: AlsParts,
  size: string,
  finish: string,
  cct: string,
) {
  return parts.sections.find(
    (v) =>
      opt(v, 'Size') === size &&
      opt(v, 'Body Color') === finish &&
      opt(v, 'Color Temperature') === cct,
  );
}
function connectorVariant(parts: AlsParts, type: ConnectorType, finish: string) {
  return parts.connectors[type]?.find((v) =>
    v.selectedOptions.some((o) => o.value === finish),
  );
}
/** List price per length, from the live variants (all CCT/finish share it). */
export function sizePrices(parts: AlsParts): Partial<Record<Size, number>> {
  const out: Partial<Record<Size, number>> = {};
  for (const s of SIZES) {
    const v = parts.sections.find((x) => opt(x, 'Size') === s);
    if (v) out[s] = Number(v.price.amount);
  }
  return out;
}

export const usd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

/* --------------------------------- atoms --------------------------------- */
/** Marks preview-only content so the owner can see what still needs a file. */
export function Mock({children, className}: {children: React.ReactNode; className?: string}) {
  if (!SHOW_MOCKS) return null;
  return (
    <div className={cn('relative rounded-sm outline-1 outline-offset-4 outline-dashed outline-amber-500/70', className)}>
      <span className="absolute -top-2.5 right-1 z-10 rounded-sm bg-amber-500 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        Mock
      </span>
      {children}
    </div>
  );
}

export function Tag({children, dark}: {children: React.ReactNode; dark?: boolean}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide',
        dark ? 'bg-black/55 text-white backdrop-blur' : 'bg-background/90 text-foreground backdrop-blur',
      )}
    >
      {children}
    </span>
  );
}

/** Ceiling, two drops, the bar — "it hangs", in 16 px. */
export function PendantGlyph({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <path d="M2 4h20" />
      <path d="M7 4v10M17 4v10" strokeWidth="1.1" />
      <rect x="4" y="14" width="16" height="3.5" rx="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ARMS: Record<ConnectorType, Array<[number, number]>> = {
  L: [[1, 0], [0, 1]],
  T: [[-1, 0], [1, 0], [0, 1]],
  X: [[-1, 0], [1, 0], [0, -1], [0, 1]],
  Y: [[-0.71, -0.71], [0.71, -0.71], [0, 1]],
};
export function ConnectorGlyph({
  type,
  finish = 'Black',
  className,
}: {
  type: ConnectorType;
  finish?: string;
  className?: string;
}) {
  const white = finish === 'White';
  return (
    <svg viewBox="-24 -24 48 48" className={className} role="img" aria-label={`${type} connector diagram`}>
      {ARMS[type].map(([dx, dy]) => (
        <line
          key={`${dx}${dy}`}
          x1={0}
          y1={0}
          x2={dx * 18}
          y2={dy * 18}
          stroke={white ? '#fff' : '#1d1d1f'}
          strokeWidth={7}
          strokeLinecap="square"
          style={white ? {filter: 'drop-shadow(0 0 0.6px #1d1d1f)'} : undefined}
        />
      ))}
      <rect x={-5} y={-5} width={10} height={10} fill="#7a7a7a" />
    </svg>
  );
}

/* ------------------------------ shape diagram ------------------------------ */
const S = 22; // px per foot — one scale for every shape (creative §2.2)
const PAD = 34;
const T_BAR = 8;
const NODE = 12;

export function ShapeDiagram({
  shape,
  name,
  finish,
  className,
}: {
  shape: ShapeSize;
  name: string;
  finish: string;
  className?: string;
}) {
  const xs = shape.segs.flatMap((g) => [g.x1, g.x2]);
  const ys = shape.segs.flatMap((g) => [g.y1, g.y2]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const W = (maxX - minX) * S + PAD * 2;
  const H = (maxY - minY) * S + PAD * 2;
  const px = (x: number) => (x - minX) * S + PAD;
  const py = (y: number) => (y - minY) * S + PAD;
  const isNode = (x: number, y: number) => shape.nodes.some((n) => n.x === x && n.y === y);
  const white = finish === 'White';
  const trim = NODE / 2 + 2;
  const parts = partsOf(shape);
  const desc = `${name} layout: ${parts
    .map((p) => (p.kind === 'section' ? `${p.qty} × ${p.size} section` : `${p.qty} × ${p.type} connector`))
    .join(', ')}, ${shape.label}.`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" className={cn('h-auto max-w-full', className)}>
      <title>{desc}</title>
      {shape.segs.map((g, i) => {
        const horiz = g.y1 === g.y2;
        const a = horiz ? Math.min(g.x1, g.x2) : Math.min(g.y1, g.y2);
        const b = horiz ? Math.max(g.x1, g.x2) : Math.max(g.y1, g.y2);
        const startTrim = isNode(horiz ? a : g.x1, horiz ? g.y1 : a) ? trim : 0;
        const endTrim = isNode(horiz ? b : g.x1, horiz ? g.y1 : b) ? trim : 0;
        const len = (b - a) * S - startTrim - endTrim;
        const x = horiz ? px(a) + startTrim : px(g.x1) - T_BAR / 2;
        const y = horiz ? py(g.y1) - T_BAR / 2 : py(a) + startTrim;
        // Length label sits outside the shape (above/below, left/right).
        const below = horiz && g.y1 === maxY && maxY > minY;
        const left = !horiz && g.x1 === minX && maxX > minX;
        const lx = horiz ? px((a + b) / 2) : left ? px(g.x1) - 10 : px(g.x1) + 10;
        const ly = horiz ? (below ? py(g.y1) + 20 : py(g.y1) - 12) : py((a + b) / 2) + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={horiz ? len : T_BAR}
              height={horiz ? T_BAR : len}
              fill={white ? '#fff' : '#1d1d1f'}
              stroke={white ? '#1d1d1f' : 'none'}
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={horiz ? 'middle' : left ? 'end' : 'start'}
              fontSize={12}
              fill="#333"
              style={{fontVariantNumeric: 'tabular-nums'}}
            >
              {(b - a)} ft
            </text>
          </g>
        );
      })}
      {shape.nodes.map((n) => (
        <rect key={`${n.x},${n.y}`} x={px(n.x) - NODE / 2} y={py(n.y) - NODE / 2} width={NODE} height={NODE} fill="#7a7a7a" />
      ))}
    </svg>
  );
}

/* ------------------------------- Build a shape ------------------------------- */
function partLabel(p: Part) {
  return p.kind === 'section' ? `ALS section · ${p.size}` : `${p.type} connector`;
}

export function BuildAShape({
  parts,
  finish,
  cct,
  path,
}: {
  parts: AlsParts;
  finish: string;
  cct: string;
  path: string;
}) {
  const {open} = useAside();
  const [shapeId, setShapeId] = useState(SHAPES[0].id);
  const [sizeIdx, setSizeIdx] = useState(0);
  const shape = SHAPES.find((s) => s.id === shapeId) ?? SHAPES[0];
  const size = shape.sizes[Math.min(sizeIdx, shape.sizes.length - 1)];
  const list = partsOf(size);

  const rows = list.map((p) => {
    const variant =
      p.kind === 'section'
        ? sectionVariant(parts, p.size, finish, cct)
        : connectorVariant(parts, p.type, finish);
    const unit = Number(variant?.price.amount ?? 0);
    return {p, variant, unit, sum: unit * p.qty};
  });
  const missing = rows.find((r) => !r.variant?.availableForSale);
  const total = rows.reduce((t, r) => t + r.sum, 0);
  const count = list.reduce((t, p) => t + p.qty, 0);
  const sectionQty = list.reduce((t, p) => t + (p.kind === 'section' ? p.qty : 0), 0);
  const tier = [...TIERS].reverse().find((t) => sectionQty >= t.min);
  const sectionSum = rows.reduce((t, r) => t + (r.p.kind === 'section' ? r.sum : 0), 0);
  const lines = missing
    ? []
    : rows.map((r) => ({merchandiseId: r.variant!.id, quantity: r.p.qty}));

  return (
    <section id="shapes" className="scroll-mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-20">
        <Reveal>
          <h2 className="type-display-sm">Build a shape</h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Pick a layout. We list every section and connector it takes and add up the price.
          </p>
        </Reveal>

        {/* shape picker */}
        <div role="tablist" aria-label="Layout" className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {SHAPES.map((s) => {
            const active = s.id === shape.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setShapeId(s.id);
                  setSizeIdx(0);
                }}
                className={cn(
                  'press flex shrink-0 items-center gap-3 rounded-sm border px-3.5 py-2.5 text-[13.5px] transition-colors',
                  active ? 'border-foreground ring-1 ring-foreground' : 'border-border hover:border-foreground/40',
                )}
              >
                <ShapeDiagram shape={s.sizes[0]} name={s.name} finish={finish} className="pointer-events-none !h-7 !w-auto [&_text]:hidden" />
                {s.name}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          {/* diagram */}
          <div className="relative flex min-h-[300px] flex-col items-center justify-center rounded-md border border-border bg-parchment px-4 pb-14 pt-12">
            <span className="absolute left-4 top-4">
              <Tag>Diagram</Tag>
            </span>
            <ShapeDiagram shape={size} name={shape.name} finish={finish} />
            <p className="absolute inset-x-4 bottom-4 text-center text-[11.5px] leading-snug text-muted-foreground">
              Illustrative layout. Section lengths are nominal; overall size also depends on the connectors. Ask us for exact dimensions.
            </p>
          </div>

          {/* parts + buy */}
          <div className="flex flex-col">
            <p className="text-[12px] font-medium text-muted-foreground">
              {shape.name} · {size.label}
            </p>
            {shape.sizes.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {shape.sizes.map((sz, i) => (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSizeIdx(i)}
                    aria-pressed={sz === size}
                    className={cn(
                      'press rounded-sm border px-3 py-2 text-[13px]',
                      sz === size ? 'border-foreground ring-1 ring-foreground' : 'border-border hover:border-foreground/40',
                    )}
                  >
                    {sz.label.replace('about ', '≈ ')}
                  </button>
                ))}
              </div>
            )}

            <ul className="mt-5 divide-y divide-border border-y border-border">
              {rows.map(({p, unit, sum, variant}) => (
                <li key={partLabel(p)} className="flex items-center justify-between gap-4 py-3 text-[14px]">
                  <span className="flex items-center gap-3">
                    {p.kind === 'connector' ? (
                      <ConnectorGlyph type={p.type} finish={finish} className="h-6 w-6 shrink-0" />
                    ) : (
                      <PendantGlyph className="h-6 w-6 shrink-0" />
                    )}
                    <span>
                      <span className="tnum">{p.qty} ×</span> {partLabel(p)}
                      <span className="block text-[12px] text-muted-foreground">
                        {p.kind === 'section' ? `${finish} · ${cct}` : finish} · {usd(unit)} each
                        {!variant?.availableForSale && ' · Out of stock'}
                      </span>
                    </span>
                  </span>
                  <span className="tnum font-medium">{usd(sum)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-[13px] text-muted-foreground">
                {count} parts at list price, before volume pricing
              </span>
              <span className="tnum font-heading text-[26px] leading-none">{usd(total)}</span>
            </div>
            {tier && (
              <Mock className="mt-4">
                <p className="text-[13px] text-foreground">
                  {sectionQty} sections qualify for {tier.pct}% off. In cart:{' '}
                  <span className="tnum font-medium">{usd(total - (sectionSum * tier.pct) / 100)}</span>
                </p>
              </Mock>
            )}

            <AddToCartButton
              lines={lines}
              disabled={!!missing}
              onClick={() => open('cart')}
              className="press mt-5 h-12 w-full gap-2 rounded-sm text-[14px] sm:w-full"
            >
              {missing ? `${partLabel(missing.p)} · ${finish} is out of stock` : `Add these ${count} parts · ${usd(total)}`}
            </AddToCartButton>
            <p className="mt-2 text-[12px] text-muted-foreground">
              Sold as separate parts, not a kit. Each part is its own line in your cart. Parts shown in {finish} · {cct} — change finish or light color above.
            </p>
            <button
              type="button"
              onClick={() =>
                open('quote', {
                  productTitle: 'ALS custom layout',
                  variantTitle: `${finish} · ${cct}`,
                  quantity: 1,
                  path,
                  kind: 'pricing',
                })
              }
              className="mt-4 self-start text-[13.5px] font-medium text-primary underline-offset-4 hover:underline"
            >
              Need a different shape? Send us your layout →
            </button>
          </div>
        </div>

        {/* connectors */}
        <div className="mt-14">
          <h3 className="text-[15px] font-medium">Connectors · $99 each</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(CONNECTORS) as ConnectorType[]).map((t) => (
              <li key={t}>
                <Link
                  to={`/products/${CONNECTORS[t].handle}?Body+Color=${finish}`}
                  prefetch="intent"
                  className="lift group flex items-center gap-3 rounded-md border border-border p-3 hover:border-foreground/40"
                >
                  <ConnectorGlyph type={t} finish={finish} className="h-10 w-10 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium">{t} connector</span>
                    <span className="block text-[12px] text-muted-foreground">{CONNECTORS[t].blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- proof ---------------------------------- */
function Modal({
  label,
  trigger,
  children,
}: {
  label: string;
  trigger: (open: () => void) => React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      {trigger(() => ref.current?.showModal())}
      {/* Backdrop click closes; Esc closes natively. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={ref}
        aria-label={label}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(920px,calc(100vw-32px))] rounded-md bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="press absolute right-3 top-3 z-10 rounded-sm bg-background/90 px-3 py-1.5 text-[13px] font-medium"
          >
            Close
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}

export function AlsProof({profileImg}: {profileImg?: {src: string; alt: string}}) {
  if (!SHOW_MOCKS) return null; // fallback (B): no unproven proof on the page
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-20">
        <Mock>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <li className="bg-background p-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Listing</p>
              <p className="mt-2 font-heading text-[20px]">{PROOF.listing}</p>
              <Modal
                label="Listing certificate"
                trigger={(o) => (
                  <button type="button" onClick={o} className="mt-2 text-[13px] font-medium text-primary underline-offset-4 hover:underline">
                    View certificate
                  </button>
                )}
              >
                <div className="p-8">
                  <p className="font-heading text-[22px]">{PROOF.listing}</p>
                  <p className="mt-2 text-[14px] text-muted-foreground">{PROOF.listingDetail}</p>
                  <div className="mt-6 grid aspect-[3/4] max-h-[60vh] place-items-center rounded-sm border border-dashed border-border text-[13px] text-muted-foreground">
                    Certificate PDF preview pending
                  </div>
                </div>
              </Modal>
            </li>
            <li className="bg-background p-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Track record</p>
              <p className="mt-2 font-heading text-[20px]">In use since {PROOF.since}</p>
              <p className="mt-1 text-[13.5px] text-muted-foreground">{PROOF.generation}</p>
            </li>
            <li className="bg-background p-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Stock</p>
              <p className="mt-2 font-heading text-[20px]">In stock in California</p>
              <p className="mt-1 text-[13.5px] text-muted-foreground">Ships in 1–2 business days</p>
            </li>
          </ul>
        </Mock>

        <Mock className="mt-14">
          <h2 className="type-display-sm">Installed on real projects</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">Photos from finished jobs. Not renderings.</p>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <li>
              <Modal
                label="The Resort, Playa Vista"
                trigger={(o) => (
                  <button type="button" onClick={o} className="lift group block w-full text-left">
                    <div className="relative overflow-hidden rounded-md" style={{aspectRatio: '4 / 3'}}>
                      <img src={resortImg} alt="Real project: white ALS linear pendants in continuous runs at The Resort, Playa Vista" className="h-full w-full object-cover" loading="lazy" />
                      <span className="absolute left-3 top-3"><Tag>Real project</Tag></span>
                    </div>
                    <p className="mt-3 text-[14px] font-medium">The Resort · Playa Vista, CA</p>
                    <p className="text-[13px] text-muted-foreground">ALS, White, continuous runs · View project</p>
                  </button>
                )}
              >
                <img src={resortImg} alt="White ALS linear pendants in continuous runs at The Resort, Playa Vista" className="max-h-[70vh] w-full rounded-t-md object-contain bg-black" />
                <div className="p-6">
                  <p className="font-heading text-[20px]">The Resort · Playa Vista, CA · 2026</p>
                  <p className="mt-1 text-[14px] text-muted-foreground">What we used: ALS sections, White, L, T, X and Y connectors.</p>
                  <Link to="/projects/the-resort-playa-vista" className="mt-3 inline-block text-[13.5px] font-medium text-primary underline-offset-4 hover:underline">
                    Full project story →
                  </Link>
                </div>
              </Modal>
            </li>
            {[1, 2].map((i) => (
              <li key={i} className="hidden sm:block">
                <div className="grid place-items-center rounded-md border border-dashed border-border bg-background text-[13px] text-muted-foreground" style={{aspectRatio: '4 / 3'}}>
                  Project photo pending
                </div>
              </li>
            ))}
          </ul>
        </Mock>

        {profileImg && (
          <Mock className="mt-14">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className="relative overflow-hidden rounded-md" style={{aspectRatio: '3 / 2'}}>
                <img src={profileImg.src} alt={profileImg.alt} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3"><Tag>Rendering</Tag></span>
              </div>
              <div>
                <h3 className="font-heading text-[26px] leading-tight">Aluminum body, built to stay straight</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Extruded aluminum, thick enough to hang long and stay straight, no heavier than it needs to be. Not foil-thin.
                </p>
              </div>
            </div>
          </Mock>
        )}
      </div>
    </section>
  );
}

/* ------------------------- shipping + volume pricing ------------------------- */
export function AlsShipping({
  prices,
  quote,
}: {
  prices: Partial<Record<Size, number>>;
  quote: () => void;
}) {
  const bands = useMemo(() => {
    const edges = [1, ...TIERS.map((t) => t.min)];
    return edges.map((min, i) => {
      const next = edges[i + 1];
      const pct = i === 0 ? 0 : TIERS[i - 1].pct;
      return {label: next ? `${min}–${next - 1}` : `${min}+`, pct};
    });
  }, []);

  return (
    <section className="border-t border-border bg-background">
      <div className={cn('mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-5 py-16 sm:px-8 md:py-20', TIERS.length > 0 && 'lg:grid-cols-2 lg:gap-16')}>
        <div>
          <h2 className="type-display-sm">Shipping and volume pricing</h2>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li className="flex gap-3"><Dot />In stock in California</li>
            <li className="flex gap-3"><Dot />Ships in 1–2 business days, delivered in about a week</li>
            <li className="flex gap-3"><Dot />Shipping cost is calculated at checkout</li>
          </ul>
          <button type="button" onClick={quote} className="mt-8 text-[14px] font-medium text-primary underline-offset-4 hover:underline">
            {TIERS.length ? 'Need 20+ sections? Ask for project pricing →' : 'Ordering for a whole project? Ask for project pricing →'}
          </button>
        </div>

        {TIERS.length > 0 && (
          <Mock>
            <table className="w-full text-left text-[14px]">
              <caption className="pb-3 text-left text-[13px] text-muted-foreground">
                Price per section. Mix any lengths — every ALS section in your cart counts. Connectors stay at $99.
              </caption>
              <thead>
                <tr className="border-b border-border text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="py-2 font-medium">Sections</th>
                  {SIZES.map((s) => (
                    <th key={s} className="py-2 text-right font-medium">{s}</th>
                  ))}
                  <th className="py-2 text-right font-medium">Save</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {bands.map((b) => (
                  <tr key={b.label} className="border-b border-border">
                    <td className="py-3">{b.label}</td>
                    {SIZES.map((s) => (
                      <td key={s} className="py-3 text-right">
                        {prices[s] ? usd(Math.round(prices[s]! * (100 - b.pct)) / 100) : '—'}
                      </td>
                    ))}
                    <td className="py-3 text-right text-muted-foreground">{b.pct ? `${b.pct}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Mock>
        )}
      </div>
    </section>
  );
}
const Dot = () => <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />;

/* ---------------------------------- help ---------------------------------- */
export function AlsHelp({install, layout}: {install: () => void; layout: () => void}) {
  return (
    <section className="bg-onyx text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-20">
        <h2 className="type-display-sm">Need help with the layout or the install?</h2>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-white/15 md:grid-cols-2">
          <div className="bg-onyx p-6 md:p-8">
            <p className="font-heading text-[20px]">Layout quote</p>
            <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-white/70">
              Send a floor plan, a sketch or photos with rough sizes. We&apos;ll send back the sections, connectors and total.
            </p>
            <button type="button" onClick={layout} className="press mt-6 inline-flex h-12 items-center rounded-sm bg-primary px-6 text-[14px] font-medium text-primary-foreground hover:bg-primary/90">
              Request a layout quote
            </button>
          </div>
          <div className="bg-onyx p-6 md:p-8">
            <p className="font-heading text-[20px]">Installation</p>
            <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-white/70">
              We also install in the Los Angeles area.
            </p>
            <button type="button" onClick={install} className="mt-6 text-[14px] font-medium text-white underline underline-offset-4 hover:text-white/80">
              Get an install quote →
            </button>
          </div>
        </div>
        <p className="mt-6 text-[13.5px] text-white/60">
          Or call <a href={CONTACT.phoneHref} className="text-white underline-offset-4 hover:underline">{CONTACT.phoneDisplay}</a> · {CONTACT.hoursDisplay}
        </p>
      </div>
    </section>
  );
}
