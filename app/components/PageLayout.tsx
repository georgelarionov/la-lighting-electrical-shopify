import {Link} from 'react-router';
import {useId} from 'react';
import type {CartApiQueryFragment, NavQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {QuoteAside} from '~/components/QuoteAside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  nav: NavQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  nav,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <SearchAside />
      <QuoteAside />
      <Header
        nav={nav}
        cart={cart}
        isLoggedIn={isLoggedIn}
        publicStoreDomain={publicStoreDomain}
      />
      <main className="min-h-[60vh]">{children}</main>
      <Footer nav={nav} />
    </Aside.Provider>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Search">
      <div className="predictive-search flex flex-col gap-4">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex items-center gap-2">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search products, collections…"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="h-11 w-full rounded-[2px] border border-input bg-canvas px-4 type-body text-ink outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <button
                onClick={goToSearch}
                className="h-11 shrink-0 rounded-[2px] bg-primary px-5 type-caption font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="type-caption text-ink-subtle">Loading…</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="type-caption font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View all results for “{term.current}” →
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}
