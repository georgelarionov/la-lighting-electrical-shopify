import {COMPANY_NAME} from '~/lib/site';

/**
 * One place to build page metadata. Every route's `meta` should return
 * `seo({...})` so title, description, Open Graph, Twitter card, and the
 * canonical link stay consistent. Pass `url: location.pathname` for an accurate
 * canonical/og:url; pass `noindex` on utility pages (cart, account, search).
 */
export const SITE_URL = 'https://losangeleslightingelectrical.com';

const DEFAULT_DESCRIPTION =
  'Licensed, insured C-10 electrical and architectural lighting in Los Angeles — designed, supplied, and installed by one team for commercial, industrial, and residential spaces.';

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

type SeoInput = {
  /** Full, already-formatted <title>. Falls back to a brand default. */
  title?: string;
  description?: string;
  /** Path only (e.g. location.pathname); canonical + og:url derive from SITE_URL. */
  url?: string;
  /** Absolute image URL (defaults to the site OG image). */
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
};

export function seo({
  title,
  description,
  url,
  image,
  type = 'website',
  noindex = false,
}: SeoInput = {}) {
  const t = title ?? `${COMPANY_NAME} — Architectural Lighting & Electrical`;
  const d = description ?? DEFAULT_DESCRIPTION;
  const canonical = `${SITE_URL}${url ?? ''}`;
  const img = image ?? OG_IMAGE;

  return [
    {title: t},
    {name: 'description', content: d},

    {property: 'og:title', content: t},
    {property: 'og:description', content: d},
    {property: 'og:type', content: type},
    {property: 'og:url', content: canonical},
    {property: 'og:image', content: img},
    {property: 'og:site_name', content: COMPANY_NAME},
    {property: 'og:locale', content: 'en_US'},

    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: t},
    {name: 'twitter:description', content: d},
    {name: 'twitter:image', content: img},

    {tagName: 'link', rel: 'canonical', href: canonical},
    ...(noindex ? [{name: 'robots', content: 'noindex, nofollow'}] : []),
  ];
}
