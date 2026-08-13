import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {EmptyState} from '~/components/EmptyState';
import {QuoteButton} from '~/components/QuoteButton';
import {Reveal} from '~/components/Reveal';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {buildNav} from '~/lib/nav';
import {seo, SITE_URL} from '~/lib/seo';
import {COMPANY_NAME, NAV_CATEGORIES} from '~/lib/site';

/**
 * Per-category SEO landing page.
 *
 * Everything on it is merchant-owned or derived from real product data — the
 * title, the SEO fields, the intro copy and the image all come from the Shopify
 * collection, and the facts strip is computed from the variants actually on
 * sale. Nothing is invented in code, so a category reads differently from its
 * siblings only because the merchant made it different.
 */
export const meta: Route.MetaFunction = ({data, location}) => {
  const c = data?.collection;
  if (!c) return seo({url: location.pathname});
  // The merchant authored proper SEO titles in admin; prefer them over the
  // display title, which is tuned for the nav rather than for a SERP.
  const base = seo({
    title: c.seo?.title
      ? `${c.seo.title} | ${COMPANY_NAME}`
      : `${c.title} | ${COMPANY_NAME}`,
    description: c.seo?.description || c.description || undefined,
    url: location.pathname,
    image: c.image?.url,
  });
  return [
    ...base,
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Catalog',
                item: `${SITE_URL}/collections`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: c.title,
                item: `${SITE_URL}/collections/${c.handle}`,
              },
            ],
          },
          {
            '@type': 'CollectionPage',
            name: c.title,
            description: c.seo?.description || c.description || undefined,
            url: `${SITE_URL}/collections/${c.handle}`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: c.products.nodes.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.title,
                url: `${SITE_URL}/products/${p.handle}`,
              })),
            },
          },
        ],
      },
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  // Every category here holds well under 24 products, so one page shows the
  // whole thing: no pagination chrome, and the facts strip below is computed
  // from the complete set rather than from whatever the first page happened to
  // contain. Pagination still works if a category ever outgrows this.
  const paginationVariables = getPaginationVariables(request, {pageBy: 24});

  if (!handle) {
    throw redirect('/collections');
  }

  const [data] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  const collection = data?.collection;
  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    siblings: buildNav(data).filter((c) => c.handle !== handle),
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

/** The one-line, jargon-free framing shared with the header mega-menu. */
function blurbFor(handle: string) {
  return NAV_CATEGORIES.find((c) => c.handle === handle)?.blurb ?? '';
}

export default function Collection() {
  const {collection, siblings} = useLoaderData<typeof loader>();
  const products = collection.products.nodes;
  const blurb = blurbFor(collection.handle);

  // Derived from the variants on sale, never hand-written: a spec that appears
  // here is a spec a shopper can actually buy today.
  const ccts = [
    ...new Set(
      products.flatMap((p) =>
        p.options
          .filter((o) => o.name === 'Color Temperature')
          .flatMap((o) => o.optionValues.map((v) => v.name)),
      ),
    ),
  ].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const finishes = [
    ...new Set(
      products.flatMap((p) =>
        p.options
          .filter((o) => FINISH_OPTS.has(o.name))
          .flatMap((o) => o.optionValues.map((v) => v.name)),
      ),
    ),
  ];
  const from = products.reduce(
    (min, p) => Math.min(min, Number(p.priceRange.minVariantPrice.amount)),
    Infinity,
  );

  const facts = [
    {
      label: products.length === 1 ? 'Fixture' : 'Fixtures',
      value: String(products.length),
    },
    ...(Number.isFinite(from)
      ? [{label: 'From', value: '$' + Math.round(from).toLocaleString('en-US')}]
      : []),
    ...(ccts.length ? [{label: 'Color temperature', value: ccts.join(' · ')}] : []),
    ...(finishes.length ? [{label: 'Finishes', value: finishes.join(' · ')}] : []),
  ];

  return (
    <div className="bg-canvas">
      {/* Header: image band on the left, the words on the right. The photo is
          load-bearing here — it is how someone confirms they landed on the
          right kind of light before reading a single line. */}
      <header className="border-b border-hairline">
        <div className="container-page pb-10 pt-8 md:pb-14 md:pt-10">
          <nav aria-label="Breadcrumb" className="type-caption text-ink-subtle">
            <Link to="/collections" prefetch="intent" className="hover:text-ink">
              Catalog
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <span className="text-ink">{collection.title}</span>
          </nav>

          <div className="mt-6 grid items-start gap-8 md:mt-8 md:grid-cols-[minmax(0,1fr)_22rem] md:gap-12">
            <div>
              <h1 className="type-display text-ink text-balance">
                {collection.title}
              </h1>
              {blurb ? (
                <p className="mt-4 type-lead max-w-2xl text-ink-muted">{blurb}</p>
              ) : null}
              {collection.descriptionHtml ? (
                <div
                  className="rich-text mt-5 max-w-2xl type-body text-ink-muted"
                  dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
                />
              ) : null}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <QuoteButton className="press inline-flex h-11 items-center rounded-sm bg-primary px-6 type-caption font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Get a free lighting plan
                </QuoteButton>
                <Link
                  to="/services/installation"
                  prefetch="intent"
                  className="press inline-flex h-11 items-center rounded-sm border border-hairline px-6 type-caption font-medium text-ink transition-colors hover:border-ink"
                >
                  Have it installed
                </Link>
              </div>
            </div>

            {collection.image ? (
              <div
                className="relative overflow-hidden rounded-lg bg-parchment"
                style={{aspectRatio: '4 / 3'}}
              >
                <Image
                  data={collection.image}
                  sizes="(min-width: 768px) 22rem, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {facts.length > 1 ? (
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 type-body-strong text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </header>

      <div className="container-page section-y">
        {products.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="This category doesn’t have any fixtures listed right now. Browse the full catalog in the meantime."
            action={{to: '/collections', label: 'View the full catalog'}}
          />
        ) : (
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
            resourcesClassName="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        )}
      </div>

      {siblings.length > 0 ? (
        <section className="border-t border-hairline bg-parchment">
          <div className="container-page section-y">
            <Reveal>
              <h2 className="type-display-sm text-ink">
                Other kinds of light we make
              </h2>
              <ul className="mt-8 grid list-none grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {siblings.map((cat) => (
                  <li key={cat.handle}>
                    <Link
                      to={cat.url}
                      prefetch="intent"
                      className="lift group block"
                    >
                      <div
                        className="img-zoom relative overflow-hidden rounded-lg bg-canvas"
                        style={{aspectRatio: '16 / 10'}}
                      >
                        {cat.image ? (
                          <Image
                            data={cat.image}
                            sizes="(min-width: 1024px) 18rem, 45vw"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <h3 className="mt-3 type-body-strong text-ink transition-colors group-hover:text-primary">
                        {cat.title}
                      </h3>
                      {cat.blurb ? (
                        <p className="mt-1 type-caption text-ink-subtle">
                          {cat.blurb}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ) : null}

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/** Which variant option names count as a "finish" — mirrors the catalog. */
const FINISH_OPTS = new Set(['Body Color', 'Finish', 'Color']);

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    options {
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    # Sibling categories for the internal-linking block, filtered by buildNav to
    # whatever is actually live.
    collections(first: 25) {
      nodes {
        handle
        title
        image {
          url
          altText
          width
          height
        }
        products(first: 1) {
          nodes {
            id
          }
        }
      }
    }
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
