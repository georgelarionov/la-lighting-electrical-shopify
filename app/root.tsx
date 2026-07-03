import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  Link,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import {seo} from '~/lib/seo';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import tailwindStyles from '~/styles/tailwind.css?url';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';
// Dev-only annotation toolbar. `import.meta.env.DEV` is a Vite build-time
// constant (`false` in the Oxygen prod build), so this import and its render
// are dead-code-eliminated from production — it only ever runs on localhost.
import {Agentation} from 'agentation';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '48x48'},
    {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
    {rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96'},
    {rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180'},
    {rel: 'manifest', href: '/site.webmanifest'},
  ];
}

/**
 * Sitewide metadata fallback: any route that doesn't export its own `meta`
 * inherits these Open Graph / Twitter / canonical defaults. Routes override by
 * returning `seo({...})` themselves.
 */
export const meta: Route.MetaFunction = ({location}) => {
  return seo({url: location?.pathname});
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#171a20" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={tailwindStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {import.meta.env.DEV && <Agentation />}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData<RootLoader>('root');
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;

  const content = (
    <div className="bg-canvas">
      <div className="container-narrow flex min-h-[60vh] flex-col items-start justify-center py-20">
        <p className="type-tagline text-primary">{errorStatus}</p>
        <h1 className="type-display mt-3 text-balance text-ink">
          {isNotFound ? 'This page moved or never existed.' : 'Something went wrong.'}
        </h1>
        <p className="type-body mt-4 max-w-xl text-ink-muted">
          {isNotFound
            ? 'The link may be broken or the page may have been removed. Head back to the catalog or start from the homepage.'
            : 'An unexpected error occurred while loading this page. Please try again, or head back to the homepage.'}
        </p>
        {!isNotFound && errorMessage ? (
          <pre className="mt-6 max-w-full overflow-x-auto rounded-[2px] border border-hairline bg-parchment p-4 type-caption text-ink-muted">
            {errorMessage}
          </pre>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 type-body-strong text-white transition-colors hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            to="/collections"
            className="inline-flex h-12 items-center justify-center rounded-[2px] border border-hairline px-7 type-body-strong text-ink transition-colors hover:border-ink"
          >
            Browse the catalog
          </Link>
        </div>
      </div>
    </div>
  );

  // Wrap in the global chrome (header + footer) when the root loader succeeded —
  // i.e. for child-route 404s/errors. Analytics.Provider is required because the
  // Header cart toggle calls useAnalytics(). If the root loader itself failed,
  // rootData is undefined and we render the bare notice.
  if (rootData) {
    return (
      <Analytics.Provider
        cart={rootData.cart}
        shop={rootData.shop}
        consent={rootData.consent}
      >
        <PageLayout {...rootData}>{content}</PageLayout>
      </Analytics.Provider>
    );
  }
  return content;
}
