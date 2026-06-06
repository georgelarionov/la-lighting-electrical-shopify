import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

const sectionHeadingClass =
  'type-body-strong border-b border-hairline pb-3 text-ink';
const linkRowClass =
  'block border-b border-hairline py-3 type-body text-ink transition-colors hover:text-primary';

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className={sectionHeadingClass}>Articles</h2>
      <div className="mt-1">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              className={linkRowClass}
              prefetch="intent"
              to={articleUrl}
              key={article.id}
            >
              {article.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className={sectionHeadingClass}>Pages</h2>
      <div className="mt-1">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              className={linkRowClass}
              prefetch="intent"
              to={pageUrl}
              key={page.id}
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className={sectionHeadingClass}>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                className="group flex items-center gap-4 border-b border-hairline py-4"
                prefetch="intent"
                to={productUrl}
                key={product.id}
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-[2px] border border-hairline bg-parchment">
                  {image && (
                    <Image
                      data={image}
                      alt={product.title}
                      aspectRatio="1/1"
                      sizes="64px"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-body-strong truncate text-ink transition-colors group-hover:text-primary">
                    {product.title}
                  </p>
                  {price && (
                    <span className="type-caption text-ink-subtle">
                      <Money data={price} />
                    </span>
                  )}
                </div>
              </Link>
            );
          });

          return (
            <div>
              <div className="mb-4 flex justify-center empty:mb-0">
                <PreviousLink className="type-caption-strong text-primary">
                  {isLoading ? 'Loading…' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div className="mt-1">{ItemsMarkup}</div>
              <div className="mt-6 flex justify-center empty:mt-0">
                <NextLink className="type-caption-strong text-primary">
                  {isLoading ? 'Loading…' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="type-body text-ink-muted">
      No results. Try a different search.
    </p>
  );
}
