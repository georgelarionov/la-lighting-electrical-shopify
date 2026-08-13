/**
 * Single source of truth for brand chrome that does NOT come from the
 * Storefront API: company contact details, the marketing navigation, and
 * the placeholder copy used while real content is being written.
 *
 * Contact data is real (provided by the client); body/blurb copy is stub.
 */

export const COMPANY_NAME = 'Los Angeles Lighting & Electrical';
export const COMPANY_NAME_SHORT = 'LA Lighting & Electrical';

export const CONTACT = {
  phoneDisplay: '(818) 474-6009',
  phoneHref: 'tel:+18184746009',
  hoursDisplay: 'Mon – Fri, 8AM – 6PM',
  addressLine1: '153 W Rosecrans Ave, Unit G7B',
  addressLine2: 'Gardena, CA 90248',
  addressFull: '153 W Rosecrans Ave, Unit G7B, Gardena, CA 90248',
  // Links to the Google Business Profile listing by CID (0x237ddaa7659a2c7c),
  // so "Get directions" opens our named place card — not a bare address pin.
  mapHref: 'https://maps.google.com/?cid=2557440575915306108',
  emailSupport: 'info@losangeleslightingelectrical.com',
  emailSales: 'sales@losangeleslightingelectrical.com',
  tagline: 'Ambient Lighting Design for Small Spaces',
  /** Right-hand credential shown in the desktop utility bar. */
  licenseLine: 'Licensed C-10 electrical contractor',
} as const;

/**
 * Category navigation for the header mega-menu and the footer Shop column.
 *
 * Titles and images come from the Shopify collection itself (`NAV_QUERY`), so
 * the merchant renames a category in admin and the nav follows. What lives here
 * is nav-only microcopy and running order:
 *
 * - `blurb` — the same category said the way a customer would say it. Nobody
 *   searches for "magnetic track"; they want "lights I can move later". The
 *   brief calls this out explicitly, so every category carries one.
 * - `featured` — the three systems the business leads with. They get image
 *   cards at the top of the panel; the rest read as a compact list.
 *
 * A collection missing from this list is NOT hidden — it renders after the
 * known ones, so a category added in admin can never silently vanish from the
 * site. Only its blurb and placement are lost until someone adds it here.
 */
export const NAV_CATEGORIES: ReadonlyArray<{
  handle: string;
  blurb: string;
  featured?: boolean;
}> = [
  {
    handle: 'linear-lights',
    blurb: 'Long, continuous lines of light — over islands, desks and counters.',
    featured: true,
  },
  {
    handle: 'magnetic-track-system',
    blurb: 'One rail, fixtures that snap on and move whenever the room changes.',
    featured: true,
  },
  {
    handle: 'track-lighting',
    blurb: 'Aimable spotlights on a rail — point the light exactly where it works.',
    featured: true,
  },
  {handle: 'ring-pendant-lights', blurb: 'A floating circle over a table or desk'},
  {handle: 'round-led-ceiling-lights', blurb: 'Even, glare-free discs of ceiling light'},
  {handle: 'led-panel-lights', blurb: 'Flat panels that wash a room softly'},
  {handle: 'wall-sconces', blurb: 'Up-and-down light for entries and facades'},
  {handle: 'bollard-lights', blurb: 'Knee-high posts for paths and gardens'},
];

/**
 * Catalog entry points phrased as the job, not the product.
 *
 * The brief is explicit that people shop without knowing the vocabulary — they
 * know they have a kitchen island and a dark ceiling, not that they want a
 * "magnetic track system". These lead with the room and hand off to the
 * category that answers it, so the professional name is something you learn on
 * arrival rather than something you must already know to search.
 */
export const CATALOG_SCENARIOS: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Over a kitchen island', to: '/collections/linear-lights'},
  {label: 'A whole office ceiling', to: '/collections/led-panel-lights'},
  {label: 'A layout I’ll rearrange', to: '/collections/magnetic-track-system'},
  {label: 'Retail displays & galleries', to: '/collections/track-lighting'},
  {label: 'Over a dining table', to: '/collections/ring-pendant-lights'},
  {
    label: 'Paths, entries & facades',
    to: '/collections?cat=Wall+Sconce&cat=Bollard+Light',
  },
];

/**
 * Primary marketing navigation shown in the centered desktop header bar.
 * `mega` marks the items that also open a panel on hover. They navigate on
 * click like any other link — the panel is additive, never a replacement.
 */
export const PRIMARY_NAV: ReadonlyArray<{
  label: string;
  to: string;
  /** Which mega-menu panel this item opens. The trigger stays a real link. */
  mega?: 'catalog' | 'services';
}> = [
  {label: 'Catalog', to: '/collections', mega: 'catalog'},
  {label: 'Services', to: '/services', mega: 'services'},
  {label: 'Projects', to: '/projects'},
  {label: 'About', to: '/pages/about'},
  {label: 'Contacts', to: '/contact'},
];

/**
 * Full-screen mobile menu navigation. Catalog and Services are deliberately
 * absent: on mobile both expand in place into their full lists, so listing them
 * here too would put the same destination on screen twice. Blog appears only
 * here — the tight centered desktop bar has no room for it.
 */
export const MOBILE_NAV: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Projects', to: '/projects'},
  {label: 'Blog', to: '/blog'},
  {label: 'About', to: '/pages/about'},
  {label: 'Contacts', to: '/contact'},
];

export const LEGAL_NAV: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Privacy policy', to: '/privacy-policy'},
  {label: 'Terms and Conditions', to: '/terms'},
];

/** Slim credential strip shown directly under the hero. */
export const TRUST_ITEMS: ReadonlyArray<string> = [
  'C-10 Licensed',
  'Fully Insured',
  '1,000+ installations',
  'Same-week quotes',
];

/** "Why specifiers work with us" ruled list. */
export const PROMISE_ITEMS: ReadonlyArray<{title: string; body: string}> = [
  {
    title: 'Free lighting plan',
    body: 'Send your space and we return a photometric layout with a fixture list, at no charge.',
  },
  {
    title: 'Licensed, insured crew',
    body: 'C-10 licensed electricians install exactly what we spec, with no subcontracted guesswork.',
  },
  {
    title: 'Built to California code',
    body: 'Every layout meets Title 24 and ships documented and ready for permits.',
  },
  {
    title: 'Lead times you can plan around',
    body: 'In-stock fixtures ship in days; custom builds get a firm date before you commit.',
  },
];

/**
 * Footer link columns. The Shop column is NOT here — it is built from the live
 * collections (`NAV_CATEGORIES` + `NAV_QUERY`) so it can never drift from what
 * the store actually sells, which is exactly how the previous hardcoded list
 * ("Recessed", "Pendants", "Controls" — none of which exist) went wrong.
 */
export const FOOTER_SERVICES: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Free lighting design', to: '/services/lighting-design'},
  {label: 'Licensed installation', to: '/services/installation'},
  {label: 'Electrical work', to: '/services/electrical'},
  {label: 'Lighting calculator', to: '/lighting-calculator'},
  {label: 'All services', to: '/services'},
];

export const FOOTER_COMPANY: ReadonlyArray<{label: string; to: string}> = [
  {label: 'About us', to: '/pages/about'},
  {label: 'Projects', to: '/projects'},
  {label: 'Blog', to: '/blog'},
  {label: 'Contact', to: '/contact'},
];

/** Social profiles (icon keys resolved in the Footer component). */
export const SOCIAL: ReadonlyArray<{
  label: string;
  icon: 'instagram' | 'youtube' | 'linkedin' | 'facebook';
  href: string;
}> = [
  {label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/la_lightingelectrical/'},
  {label: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@losangeleslightingelectrical'},
  {label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/los-angeles-lighting-electrical/'},
  {label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/people/Los-Angeles-Lighting-and-Electrical/61591577727742/'},
];

/** Footer contact cards (icons resolved in the Footer component). */
export const FOOTER_CONTACT_CARDS = [
  {
    icon: 'headset',
    title: 'Chat to customer services',
    blurb: 'Questions about an order, a product, or a fixture spec.',
    linkLabel: CONTACT.emailSupport,
    href: `mailto:${CONTACT.emailSupport}`,
  },
  {
    icon: 'message',
    title: 'Chat to our sales',
    blurb: 'Project quotes, bulk orders, and trade pricing.',
    linkLabel: CONTACT.emailSales,
    href: `mailto:${CONTACT.emailSales}`,
  },
  {
    icon: 'pin',
    title: 'Visit us',
    blurb: 'Showroom & warehouse, by appointment.',
    linkLabel: `${CONTACT.addressLine1}, ${CONTACT.addressLine2}`,
    href: CONTACT.mapHref,
  },
  {
    icon: 'phone',
    title: 'Call us',
    blurb: 'Mon – Fri, 8AM – 6PM (PT).',
    linkLabel: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
  },
] as const;
