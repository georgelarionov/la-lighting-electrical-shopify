import {COMPANY_NAME, CONTACT, SOCIAL} from '~/lib/site';

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

/** Stable @id + logo for the business entity, reused by page-level schema. */
export const ORG_ID = `${SITE_URL}/#business`;
export const ORG_LOGO = `${SITE_URL}/web-app-manifest-512x512.png`;

/**
 * Site-wide LocalBusiness (Electrician) for local SEO — NAP, service area,
 * hours and social profiles. Rendered once, in the root document head, so it
 * appears on every page (including the blog). Keep NAP identical to the
 * Google Business Profile for consistency.
 */
export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': ORG_ID,
    name: COMPANY_NAME,
    url: SITE_URL,
    image: OG_IMAGE,
    logo: ORG_LOGO,
    telephone: CONTACT.phoneHref.replace('tel:', ''),
    email: CONTACT.emailSupport,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.addressLine1,
      addressLocality: 'Gardena',
      addressRegion: 'CA',
      postalCode: '90248',
      addressCountry: 'US',
    },
    areaServed: [
      {'@type': 'City', name: 'Los Angeles'},
      {'@type': 'AdministrativeArea', name: 'Los Angeles County'},
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: SOCIAL.map((s) => s.href),
    hasMap: CONTACT.mapHref,
  };
}

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
