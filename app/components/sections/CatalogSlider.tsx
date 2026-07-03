import {useRef} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {PlaceholderImage} from '~/components/sections/PlaceholderImage';
import {ArrowLink} from '~/components/ArrowLink';
import {cn} from '~/lib/utils';

export type CatalogCollection = {
  id: string;
  title: string;
  handle: string;
  image?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

export function CatalogSlider({
  collections,
}: {
  collections: CatalogCollection[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 640);
    el.scrollBy({left: amount * dir, behavior: 'smooth'});
  };

  const hasData = collections.length > 0;
  const items: Array<CatalogCollection | null> = hasData
    ? collections
    : Array.from({length: 6}, () => null);

  return (
    <section className="bg-parchment">
      <div className="container-page section-y">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="type-display text-ink text-balance">
              Shop the catalog
            </h2>
            <p className="type-body mt-2.5 text-ink-muted">
              Fixtures specified by architects, in stock and ready to ship.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ArrowLink
              to="/collections"
              className="type-body hidden sm:inline-flex"
            >
              View all
            </ArrowLink>
            <div className="flex items-center gap-2">
              <SliderButton label="Previous" onClick={() => scrollBy(-1)}>
                <ArrowLeft className="size-5" />
              </SliderButton>
              <SliderButton label="Next" onClick={() => scrollBy(1)}>
                <ArrowRight className="size-5" />
              </SliderButton>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <CollectionCard
              key={item?.id ?? `ph-${i}`}
              collection={item}
              eager={i < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  eager,
}: {
  collection: CatalogCollection | null;
  eager: boolean;
}) {
  const inner = (
    <>
      <div className="overflow-hidden rounded-lg border border-hairline bg-parchment">
        {collection?.image ? (
          <Image
            data={collection.image}
            aspectRatio="4/5"
            sizes="(min-width: 1024px) 300px, 70vw"
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderImage aspect="aspect-[4/5]" label="Category" />
        )}
      </div>
      <h3 className="type-body-strong mt-4 text-ink transition-colors group-hover:text-primary">
        {collection?.title ?? 'Lighting category'}
      </h3>
    </>
  );

  const className = 'group w-[70vw] shrink-0 snap-start sm:w-[44vw] lg:w-[300px]';

  return collection ? (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className={className}
    >
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function SliderButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full border border-hairline bg-canvas text-ink',
        'transition-colors hover:border-ink hover:bg-ink hover:text-white active:scale-95',
      )}
    >
      {children}
    </button>
  );
}
