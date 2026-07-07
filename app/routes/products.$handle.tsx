import React, {useState, useRef, useEffect} from 'react';
import {useLoaderData, Link, useNavigate} from 'react-router';
import type {Route} from './+types/products.$handle';
import {seo} from '~/lib/seo';
import {
  getSelectedProductOptions,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
  Analytics,
  type MappedProductOptions,
} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {Reveal} from '~/components/Reveal';
import {QuoteButton} from '~/components/QuoteButton';
import {PlaceholderImage} from '~/components/sections/PlaceholderImage';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {cn} from '~/lib/utils';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
// hero + serviceImg back the two globally-shared marketing blocks (final CTA
// background, lighting-design section). Per-product imagery now comes from
// Shopify media/metafields, so the other mockup imports are gone.
import hero from '~/assets/mp/linear-hero.jpg?url';
import serviceImg from '~/assets/mp/catalog-service.jpg?url';

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
  return {product, content: buildContent(product)};
}

/* --------- content-manager metafields → clean render model ---------- */
// Every PDP marketing section is driven by product metafields (namespace
// `custom`) a content manager edits in Shopify admin. Empty → the section is
// hidden (see the component), so an un-authored product shows only the buy box
// + the four globally-shared blocks — never another product's copy.
function parseJsonList(v?: string | null): string[] {
  if (!v) return [];
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p.map(String) : [];
  } catch {
    return [];
  }
}
// Flatten a metaobject's fields into {key: {value, imageUrl, imageAlt}}.
function moFields(node: {
  fields?: ReadonlyArray<{
    key: string;
    value?: string | null;
    reference?: {image?: {url: string; altText?: string | null} | null} | null;
  }>;
}) {
  const out: Record<string, {value: string; url: string | null; alt: string | null}> =
    {};
  for (const f of node.fields ?? []) {
    const img = f.reference && 'image' in f.reference ? f.reference.image : null;
    out[f.key] = {
      value: f.value ?? '',
      url: img?.url ?? null,
      alt: img?.altText ?? null,
    };
  }
  return out;
}
function buildContent(product: ProductFragment) {
  const metaobjects = (
    mf?: {references?: {nodes: ReadonlyArray<unknown>} | null} | null,
  ) =>
    ((mf?.references?.nodes ?? []) as ReadonlyArray<unknown>)
      .filter(
        (n): n is Parameters<typeof moFields>[0] =>
          !!n && typeof n === 'object' && 'fields' in n,
      )
      .map(moFields);

  return {
    eyebrow: product.eyebrow?.value?.trim() || null,
    subtitle: product.subtitle?.value?.trim() || null,
    highlights: parseJsonList(product.highlights?.value),
    features: metaobjects(product.features).map((f) => ({
      heading: f.heading?.value ?? '',
      body: f.body?.value ?? '',
      img: f.image?.url ?? null,
      imgAlt: f.image?.alt ?? f.heading?.value ?? '',
    })),
    featureCards: metaobjects(product.featureCards).map((f) => ({
      icon: (f.icon?.value ?? '').toLowerCase().trim(),
      heading: f.heading?.value ?? '',
      body: f.body?.value ?? '',
    })),
    specs: metaobjects(product.specs).map((f) => ({
      label: f.label?.value ?? '',
      value: f.value?.value ?? '',
    })),
    faqs: metaobjects(product.faqs).map((f) => ({
      question: f.question?.value ?? '',
      answer: f.answer?.value ?? '',
    })),
    crossSell: ((product.crossSell?.references?.nodes ?? []) as ReadonlyArray<any>)
      .filter((n) => n && 'handle' in n)
      .map((p) => ({
        handle: p.handle as string,
        title: p.title as string,
        img: (p.featuredImage?.url as string) ?? null,
        imgAlt: (p.featuredImage?.altText as string) ?? (p.title as string),
        price: (p.priceRange?.minVariantPrice?.amount as string) ?? null,
      })),
    downloads: ((product.downloads?.references?.nodes ?? []) as ReadonlyArray<any>)
      .map((n) => {
        if (n && 'url' in n && n.url) return {url: n.url as string, label: (n.alt as string) || 'Download'};
        if (n && 'image' in n && n.image?.url)
          return {url: n.image.url as string, label: (n.image.altText as string) || 'Download'};
        return null;
      })
      .filter((d): d is {url: string; label: string} => !!d),
  };
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

/* --------------------------- data (globally shared) ------ */
// Body-color swatch fallbacks when a Shopify option has no configured swatch.
const COLOR_HEX: Record<string, string> = {black: '#1c1a17', white: '#f3f1ec'};
// Icon keys a content manager can type into a PDP Feature Card's `icon` field.
const ICONS: Record<string, typeof Bolt> = {
  ruler: Ruler,
  bolt: Bolt,
  shield: Shield,
  check: Check,
  star: Star,
};
// Reviews and the three purchase tiers are identical on every product (the
// globally-shared blocks), so they stay in code — not per-product metafields.
const REVIEWS = [
  {n: 'Marina D.', r: 'Retail rollout · 1,200 ft', t: 'The continuous runs are flawless — not a single visible joint. Their team drew the whole layout before we ordered a thing.'},
  {n: 'Anthony R.', r: 'Office TI · Culver City', t: 'Spec, supply and licensed install from one place. Passed Title 24 inspection first time.'},
  {n: 'Priya S.', r: 'Restaurant · West Hollywood', t: '3000K up-and-down completely changed the room. Warm, even, zero glare on the tables.'},
];
const TIERS = [
  {id: 'fixture', t: 'Fixture only', s: 'You install it.', d: 'The configured fixture, shipped to your door with a clear install guide.', cta: 'Add to cart', tag: ''},
  {id: 'design', t: 'Fixture + Lighting design', s: 'Free photometric plan.', d: 'We return a layout, fixture count and spacing for your exact space — at no charge.', cta: 'Add design plan', tag: ''},
  {id: 'install', t: 'Fixture + Licensed install', s: 'Turnkey, to code.', d: 'C-10 electricians install everything to Title 24. You flip the switch.', cta: 'Get install quote', tag: 'Most popular'},
] as const;
// Prices render from the selected Shopify variant (variant currency) — see money() in the component.

/* ============================ component ============================ */
export default function ProductPage() {
  const {product, content} = useLoaderData<typeof loader>();
  const {open} = useAside();
  const navigate = useNavigate();

  // Real Shopify variant selection — the buy box, price, availability and
  // add-to-cart all follow the product's actual options and variants.
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions ?? []);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const [qty, setQty] = useState(1);
  const [tier, setTier] = useState<(typeof TIERS)[number]['id']>('design');
  const [active, setActive] = useState(0);
  const [specOpen, setSpecOpen] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const currency = selectedVariant?.price?.currencyCode ?? 'USD';
  const money = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  const unitAmount = Number(selectedVariant?.price?.amount ?? 0);
  const total = unitAmount * qty;

  // Real Shopify product media only — no mock fallback (an un-authored product
  // shows a neutral placeholder, never another product's photos).
  const gallery = (product.images?.nodes ?? []).map((n) => ({
    src: n.url,
    alt: n.altText || product.title,
  }));
  const safeActive = gallery.length ? Math.min(active, gallery.length - 1) : 0;
  const heroImg = gallery[safeActive];

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

  const configSummary =
    selectedVariant?.selectedOptions
      ?.filter((o) => o.name !== 'Title')
      .map((o) => o.value)
      .join(' · ') ?? '';
  const canBuy = Boolean(
    selectedVariant?.availableForSale && selectedVariant?.id,
  );
  const lines = selectedVariant?.id
    ? [{merchandiseId: selectedVariant.id, quantity: qty}]
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
            {heroImg ? (
              <img key={safeActive} src={heroImg.src} alt={heroImg.alt} className="h-full w-full object-cover" style={{animation: 'fadeIn .5s var(--ease-out)'}} />
            ) : (
              <PlaceholderImage aspect="" className="h-full w-full" />
            )}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-sm bg-background/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur">
              <Shield className="h-3.5 w-3.5" /> C-10 licensed install available
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="no-scrollbar mt-3 flex min-w-0 gap-3 overflow-x-auto">
              {gallery.map((g, i) => (
                <button key={g.src} onClick={() => setActive(i)} className={`press relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-sm bg-parchment ${safeActive === i ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}>
                  <img src={g.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* configurator / buy box */}
        <div className="flex min-w-0 flex-col">
          {content.eyebrow && <p className="type-eyebrow">{content.eyebrow}</p>}
          <h1 className="mt-3 font-heading text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[46px]">{product.title}</h1>
          {content.subtitle && (
            <p className="mt-4 max-w-md whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
              {content.subtitle}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-foreground">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4" />)}</div>
            <span className="text-[13px] text-muted-foreground">4.9 · <span className="underline-offset-2 hover:underline cursor-pointer">320 reviews</span></span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="tnum font-heading text-[32px] leading-none">{money(unitAmount)}</span>
            {selectedVariant?.compareAtPrice ? (
              <s className="text-[15px] text-muted-foreground">{money(Number(selectedVariant.compareAtPrice.amount))}</s>
            ) : null}
            <span className="text-[12.5px] text-muted-foreground">per fixture</span>
          </div>

          {/* real Shopify variant options */}
          <ProductOptions
            productOptions={productOptions}
            onSelect={(query) =>
              void navigate(`?${query}`, {
                replace: true,
                preventScrollReset: true,
              })
            }
          />

          {/* spec readout */}
          {content.highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 rounded-md border border-border bg-parchment px-4 py-3 text-[12px] text-muted-foreground">
              {content.highlights.slice(0, 4).map((s) => <span key={s} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-foreground" />{s}</span>)}
            </div>
          )}

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
                {canBuy ? <>{addLabel} · {money(total)}</> : 'Sold out'}
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
      {content.highlights.length > 0 && (
        <div className="border-y border-border bg-parchment">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-[12px] tracking-wide text-muted-foreground sm:px-8">
            {content.highlights.map((t, i) => <span key={t} className="flex items-center gap-2">{i > 0 && <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />}{t}</span>)}
          </div>
        </div>
      )}

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

      {/* feature rows + cards (per-product) */}
      {(content.features.length > 0 || content.featureCards.length > 0) && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
            {content.features.length > 0 && (
              <div className="space-y-16 md:space-y-24">
                {content.features.map((f, i) => (
                  <Reveal key={f.heading + i}>
                    <div className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                      <div className="img-zoom overflow-hidden rounded-lg bg-background" style={{aspectRatio: '4 / 3'}}>
                        {f.img ? (
                          <img src={f.img} alt={f.imgAlt} className="h-full w-full object-cover" />
                        ) : (
                          <PlaceholderImage aspect="" className="h-full w-full" />
                        )}
                      </div>
                      <div>
                        <span className="tnum font-heading text-[14px] text-muted-foreground">0{i + 1}</span>
                        <h3 className="mt-2 font-heading text-[26px] leading-tight sm:text-[30px]">{f.heading}</h3>
                        <p className="mt-3 max-w-md whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
            {content.featureCards.length > 0 && (
              <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 ${content.features.length > 0 ? 'mt-20' : ''}`}>
                {content.featureCards.map((f, i) => {
                  const Icon = ICONS[f.icon] ?? Bolt;
                  return (
                    <Reveal key={f.heading + i} delay={i * 60} className="bg-background">
                      <div className="h-full p-7">
                        <Icon className="h-6 w-6 text-foreground" />
                        <h4 className="mt-4 font-heading text-[18px]">{f.heading}</h4>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{f.body}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Geometry / run-length planning moved into the free lighting-plan
          request (quote drawer) — it drives a quote, not a variant. */}

      {/* specifications */}
      {(content.specs.length > 0 || content.downloads.length > 0) && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8">
            <button onClick={() => setSpecOpen((o) => !o)} className="press flex w-full items-center justify-between border-b border-border pb-4 text-left">
              <h2 className="font-heading text-[24px]">Specifications</h2>
              <Chevron className={`h-5 w-5 transition-transform duration-300 ${specOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="grid transition-all duration-500" style={{gridTemplateRows: specOpen ? '1fr' : '0fr'}}>
              <div className="overflow-hidden">
                {content.specs.length > 0 && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2">
                    {content.specs.map((s, i) => (
                      <div key={s.label + i} className={`flex items-start justify-between gap-6 border-b border-border py-3 ${i % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
                        <dt className="text-[13px] text-muted-foreground">{s.label}</dt>
                        <dd className="text-right text-[13px] font-medium">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {content.downloads.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {content.downloads.map((d) => <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 text-[12.5px] hover:border-foreground/40"><Arrow className="h-3.5 w-3.5 -rotate-45" /> {d.label}</a>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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
      {content.faqs.length > 0 && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-[840px] px-5 py-16 sm:px-8">
            <Reveal><h2 className="font-heading text-[28px]">Questions, answered</h2></Reveal>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {content.faqs.map((f, i) => {
                const isOpen = faqOpen === i;
                return (
                  <div key={f.question + i}>
                    <button onClick={() => setFaqOpen(isOpen ? null : i)} className="press flex w-full items-center justify-between gap-6 py-5 text-left">
                      <span className="text-[15px] font-medium">{f.question}</span>
                      <Chevron className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="grid transition-all duration-300" style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}>
                      <div className="overflow-hidden"><p className="whitespace-pre-line pb-5 pr-10 text-[14px] leading-relaxed text-muted-foreground">{f.answer}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* cross-sell */}
      {content.crossSell.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <Reveal><h2 className="font-heading text-[28px]">Complete the system</h2></Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {content.crossSell.map((c, i) => (
              <Reveal key={c.handle} delay={i * 60}>
                <Link to={`/products/${c.handle}`} prefetch="intent" className="lift group block">
                  <div className="img-zoom overflow-hidden rounded-lg bg-parchment" style={{aspectRatio: '1 / 1'}}>
                    {c.img ? (
                      <img src={c.img} alt={c.imgAlt} className="h-full w-full object-cover" />
                    ) : (
                      <PlaceholderImage aspect="" className="h-full w-full" />
                    )}
                  </div>
                  <h3 className="mt-3 text-[14px] font-medium">{c.title}</h3>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-muted-foreground">View <Arrow className="h-3 w-3" /></p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

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
          {heroImg && <img src={heroImg.src} alt="" className="hidden h-11 w-14 rounded-sm object-cover sm:block" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium">{product.title}</p>
            <p className="truncate text-[11.5px] text-muted-foreground">{configSummary}</p>
          </div>
          <span className="tnum hidden font-heading text-[18px] sm:block">{money(total)}</span>
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
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
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

/* ------------------- real Shopify variant options ------------------- */
// Renders the product's actual options/variants in the buy-box chip style.
// Selecting a value navigates to that variant (via variantUriQuery); the
// optimistic variant then updates price/availability/add-to-cart.
function ProductOptions({
  productOptions,
  onSelect,
}: {
  productOptions: MappedProductOptions[];
  onSelect: (variantUriQuery: string) => void;
}) {
  return (
    <>
      {productOptions.map((option) => {
        // A single value isn't a choice — don't render it as one.
        if (option.optionValues.length <= 1) return null;
        const current = option.optionValues.find((v) => v.selected)?.name;
        const isColor = /colou?r/i.test(option.name);
        const layout = isColor
          ? 'flex flex-wrap gap-2.5'
          : 'grid grid-cols-3 gap-2';

        return (
          <Field key={option.name} label={option.name} value={current}>
            <div className={layout}>
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;
                const chipClass = cn(
                  'press rounded-sm border px-3 py-2.5 text-center text-[13px]',
                  selected
                    ? 'border-foreground bg-foreground/[0.03] ring-1 ring-foreground'
                    : 'border-border hover:border-foreground/40',
                  !available && 'opacity-40',
                  !exists && 'cursor-not-allowed',
                );
                const inner = (
                  <OptionValueContent
                    name={name}
                    swatch={swatch}
                    isColor={isColor}
                  />
                );

                if (isDifferentProduct) {
                  // Combined-listing child that lives at another URL.
                  return (
                    <Link
                      key={option.name + name}
                      to={`/products/${handle}?${variantUriQuery}`}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      className={chipClass}
                    >
                      {inner}
                    </Link>
                  );
                }
                return (
                  <button
                    key={option.name + name}
                    type="button"
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) onSelect(variantUriQuery);
                    }}
                    className={chipClass}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </Field>
        );
      })}
    </>
  );
}

function OptionValueContent({
  name,
  swatch,
  isColor,
}: {
  name: string;
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  isColor: boolean;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color ?? (isColor ? COLOR_HEX[name.toLowerCase()] : undefined);

  if (isColor && (color || image)) {
    return (
      <span className="flex items-center justify-center gap-2">
        <span
          className="h-4 w-4 rounded-full border border-black/10"
          style={{
            background: color || 'transparent',
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
          }}
        />
        {name}
      </span>
    );
  }
  return <span>{name}</span>;
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

    # ---- Content-manager–editable PDP content (namespace: custom) ----
    eyebrow: metafield(namespace: "custom", key: "eyebrow") { value }
    subtitle: metafield(namespace: "custom", key: "subtitle") { value }
    highlights: metafield(namespace: "custom", key: "highlights") { value }
    features: metafield(namespace: "custom", key: "features") {
      references(first: 6) { nodes { ...PdpMetaobject } }
    }
    featureCards: metafield(namespace: "custom", key: "feature_cards") {
      references(first: 6) { nodes { ...PdpMetaobject } }
    }
    specs: metafield(namespace: "custom", key: "specs") {
      references(first: 40) { nodes { ...PdpMetaobject } }
    }
    faqs: metafield(namespace: "custom", key: "faqs") {
      references(first: 20) { nodes { ...PdpMetaobject } }
    }
    crossSell: metafield(namespace: "custom", key: "cross_sell") {
      references(first: 8) {
        nodes {
          ... on Product {
            id
            title
            handle
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
    downloads: metafield(namespace: "custom", key: "downloads") {
      references(first: 8) {
        nodes {
          ... on GenericFile { id url alt mimeType }
          ... on MediaImage { id image { url altText } }
        }
      }
    }
  }
  fragment PdpMetaobject on Metaobject {
    id
    type
    fields {
      key
      value
      reference {
        ... on MediaImage { image { url altText } }
      }
    }
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
