import {Link} from 'react-router';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {
  ALS_HANDLE,
  CONNECTORS,
  DEFAULT_CCT,
  DEFAULT_FINISH,
  OUTPUT,
  SHAPES,
  SIZES,
  VARIANT_FRAME,
  frameIndex,
  type ConnectorType,
} from '~/lib/als';
import {ConnectorGlyph, Mock, ShapeDiagram, Tag, usd} from './AlsBlocks';

/**
 * /collections/linear-lights — sells ALS by the section (release.md, creative §3):
 * three length tiles → Build a shape → connectors → other linear lights.
 * ponytail: handle-specific layout; the generic collection grid stays for every
 * other category.
 */
export function LinearLanding({
  products,
  alsImages,
  alsVariants,
}: {
  products: ReadonlyArray<ProductItemFragment>;
  alsImages: ReadonlyArray<{url: string; altText?: string | null}>;
  alsVariants: ReadonlyArray<{
    price: {amount: string};
    selectedOptions: ReadonlyArray<{name: string; value: string}>;
  }>;
}) {
  const als = products.find((p) => p.handle === ALS_HANDLE);
  const connectorHandles = new Set<string>(Object.values(CONNECTORS).map((c) => c.handle));
  const others = products.filter((p) => p.handle !== ALS_HANDLE && !connectorHandles.has(p.handle));
  const img = (frame: number) => alsImages.find((i) => frameIndex(i.url) === frame);
  // One live price per length (finish/CCT share it) — no hardcoded prices.
  const price: Record<string, string> = {};
  for (const v of alsVariants) {
    const size = v.selectedOptions.find((o) => o.name === 'Size')?.value;
    if (size && !price[size]) price[size] = v.price.amount;
  }
  const header = img(3);

  return (
    <div className="bg-canvas">
      <header className="border-b border-hairline">
        <div className="container-page pb-10 pt-8 md:pb-14 md:pt-10">
          <nav aria-label="Breadcrumb" className="type-caption text-ink-subtle">
            <Link to="/collections" prefetch="intent" className="hover:text-ink">Catalog</Link>
            <span className="px-2" aria-hidden>/</span>
            <span className="text-ink">Linear Pendant Lights</span>
          </nav>
          <div className="mt-6 grid items-start gap-8 md:mt-8 md:grid-cols-[minmax(0,1fr)_24rem] md:gap-12">
            <div>
              <h1 className="type-display text-ink text-balance">Linear Pendant Lights</h1>
              <p className="mt-4 type-lead max-w-2xl text-ink-muted">
                ALS pendant sections in 2, 4 and 8 ft. Join them with connectors into lines, L-shapes, rectangles and T-shapes. Pendant mount only.
              </p>
              <p className="mt-4 type-caption text-ink-subtle">In stock in California · Ships in 1–2 business days</p>
            </div>
            {header ? (
              <div className="relative hidden overflow-hidden rounded-lg bg-parchment md:block" style={{aspectRatio: '4 / 3'}}>
                <img src={header.url} alt={header.altText || 'Rendering: black ALS pendant sections joined into a rectangle over a conference table'} className="absolute inset-0 h-full w-full object-cover" style={{objectPosition: '50% 0'}} />
                <span className="absolute left-3 top-3"><Tag>Rendering</Tag></span>
              </div>
            ) : null}
          </div>
          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-4">
            {[
              ['Section lengths', '2 · 4 · 8 ft'],
              ['From', price['2 ft'] ? `${usd(Number(price['2 ft']))} per section` : '—'],
              ['Light color', '3000K · 3500K · 4000K'],
              ['Finishes', 'Black · White'],
            ].map(([l, v]) => (
              <div key={l}>
                <dt className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">{l}</dt>
                <dd className="mt-1.5 type-body-strong text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {als && (
        <section className="container-page section-y">
          <h2 className="type-display-sm text-ink">ALS pendant sections</h2>
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {SIZES.map((size) => {
              const frame = img(VARIANT_FRAME[`${size}|Black`]);
              const q = new URLSearchParams({
                Size: size,
                'Body Color': DEFAULT_FINISH,
                'Color Temperature': DEFAULT_CCT,
              });
              const p = price[size];
              return (
                <li key={size}>
                  <Link to={`/products/${ALS_HANDLE}?${q}`} prefetch="intent" className="lift group block">
                    <div className="img-zoom relative overflow-hidden rounded-lg" style={{aspectRatio: '1 / 1', background: 'radial-gradient(120% 120% at 50% 32%, #eef0f3 0%, #d9dce1 100%)'}}>
                      {frame && <img src={frame.url} alt={`ALS ${size} section in black, hanging on two cables, studio view`} className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                    <h3 className="mt-3 type-body-strong text-ink transition-colors group-hover:text-primary">ALS section · {size}</h3>
                    <p className="type-caption text-ink-subtle">{OUTPUT[size].lm} · {OUTPUT[size].w}</p>
                    <p className="mt-1 type-body-strong text-ink tnum">{p ? usd(Number(p)) : null}</p>
                    <p className="type-fine text-ink-subtle">{size === '8 ft' ? 'Lowest cost per foot' : 'Connects into shapes'}</p>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link to={`/products/${ALS_HANDLE}#shapes`} prefetch="intent" className="lift group block">
                <div className="relative grid grid-cols-2 place-items-center gap-2 overflow-hidden rounded-lg border border-hairline bg-background p-5" style={{aspectRatio: '1 / 1'}}>
                  <span className="absolute left-3 top-3"><Tag>Diagram</Tag></span>
                  {SHAPES.map((s) => (
                    <ShapeDiagram key={s.id} shape={s.sizes[0]} name={s.name} finish="Black" className="!h-auto !w-full [&_text]:hidden" />
                  ))}
                </div>
                <h3 className="mt-3 type-body-strong text-ink transition-colors group-hover:text-primary">Build a shape</h3>
                <p className="type-caption text-ink-subtle">Line, L, rectangle, T: parts and totals</p>
                <p className="mt-1 type-caption font-medium text-primary">See parts and prices →</p>
              </Link>
            </li>
          </ul>

          <h2 className="mt-16 type-body-strong text-ink">Connectors · $99 each</h2>
          <p className="type-caption text-ink-subtle">For ALS sections. Black or White.</p>
          <ul className="mt-5 grid list-none grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(CONNECTORS) as ConnectorType[]).map((t) => (
              <li key={t}>
                <Link to={`/products/${CONNECTORS[t].handle}`} prefetch="intent" className="lift flex items-center gap-3 rounded-md border border-hairline bg-background p-3 hover:border-ink/40">
                  <ConnectorGlyph type={t} className="h-10 w-10 shrink-0" />
                  <span>
                    <span className="block type-caption-strong text-ink">{t} connector</span>
                    <span className="block type-fine text-ink-subtle">{CONNECTORS[t].blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Mock className="mt-4">
            <p className="type-fine text-ink-subtle">Connector photos pending (PH-1) — diagrams stand in.</p>
          </Mock>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t border-hairline">
          <div className="container-page section-y">
            <h2 className="type-display-sm text-ink">More linear lights</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {others.map((p) => (
                <ProductItem key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
