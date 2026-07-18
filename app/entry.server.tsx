import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Allow the click-to-play YouTube embed on project pages (privacy-friendly
    // nocookie host). Setting frame-src overrides the default-src fallback, so
    // restate the prior sources ('self' + Shopify) alongside the nocookie host.
    frameSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://www.youtube-nocookie.com',
      // Google Maps place embed on the contact page (keyless ?output=embed).
      'https://www.google.com',
    ],
    // Dev-only: let the Agentation toolbar POST annotations to its local MCP
    // sync server. These values are merged into (not replacing) Hydrogen's
    // default connect-src. `import.meta.env.DEV` compiles to `false` in the
    // Oxygen prod build, so production CSP is never loosened.
    ...(import.meta.env.DEV
      ? {connectSrc: ['http://localhost:4747', 'ws://localhost:4747']}
      : {}),
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
