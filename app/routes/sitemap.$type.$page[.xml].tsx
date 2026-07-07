import type {Route} from './+types/sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-US', 'EN-CA', 'FR-CA'],
    getLink: ({type, baseUrl, handle, locale}) => {
      // The blog uses a flat structure: /blog (listing) and /blog/<article>.
      const path =
        type === 'articles'
          ? `blog/${handle}`
          : type === 'blogs'
            ? 'blog'
            : `${type}/${handle}`;
      return locale ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${path}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
