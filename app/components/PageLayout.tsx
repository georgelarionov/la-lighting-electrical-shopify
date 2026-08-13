import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment, NavQuery} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {QuoteAside} from '~/components/QuoteAside';
import {CartMain} from '~/components/CartMain';
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
      <CartAside cart={cart} />
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

/**
 * The step between "add to cart" and the cart page.
 *
 * Adding from a product page used to redirect straight to /cart, which threw
 * away where you were mid-browse. This confirms the add in place instead: the
 * line appears immediately (the optimistic cart renders it before the server
 * answers), and you either carry on, open the full cart, or check out. The
 * header cart icon still goes to /cart — this drawer is the confirmation, not
 * the cart itself.
 */
function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Added to cart">
      <Suspense
        fallback={<p className="type-body text-ink-subtle">Loading cart…</p>}
      >
        <Await resolve={cart}>
          {(cart) => <CartDrawerBody cart={cart} />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartDrawerBody({cart}: {cart: CartApiQueryFragment | null}) {
  const {close} = useAside();
  // The resolved promise still holds the pre-add cart until the root loader
  // revalidates, so the count has to come from the optimistic cart — otherwise
  // the drawer opens on the very first add with its buttons missing.
  const optimistic = useOptimisticCart(cart);
  if (!optimistic?.totalQuantity) {
    return <CartMain cart={cart} layout="aside" />;
  }
  return (
    <>
      <CartMain cart={cart} layout="aside" />
      <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
        <Link
          to="/cart"
          prefetch="intent"
          className="press inline-flex h-11 items-center justify-center rounded-[2px] border border-hairline px-6 type-caption font-medium text-ink transition-colors hover:border-ink"
        >
          View cart
        </Link>
        <button
          type="button"
          onClick={close}
          className="type-caption text-ink-subtle transition-colors hover:text-ink"
        >
          Continue shopping
        </button>
      </div>
    </>
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
