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
  addressLine1: '13157 Mindanao Way #642',
  addressLine2: 'Marina Del Rey, CA 90292',
  addressFull: '13157 Mindanao Way #642, Marina Del Rey, CA 90292',
  mapHref:
    'https://maps.google.com/?q=13157+Mindanao+Way+%23642,+Marina+Del+Rey,+CA+90292',
  emailSupport: 'info@losangeleslightingelectrical.com',
  emailSales: 'sales@losangeleslightingelectrical.com',
  tagline: 'Ambient Lighting Design for Small Spaces',
  /** Right-hand credential shown in the desktop utility bar. */
  licenseLine: 'Licensed C-10 electrical contractor',
} as const;

/** Primary marketing navigation shown in the centered desktop header bar. */
export const PRIMARY_NAV: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Catalog', to: '/collections'},
  {label: 'Projects', to: '/projects'},
  {label: 'Services', to: '/services'},
  {label: 'About', to: '/pages/about'},
  {label: 'Contacts', to: '/contact'},
];

/**
 * Full-screen mobile menu navigation — the desktop bar plus Blog (which the
 * tight centered desktop bar omits for space). Blog sits after Services, as in
 * the footer.
 */
export const MOBILE_NAV: ReadonlyArray<{label: string; to: string}> = [
  ...PRIMARY_NAV.slice(0, 3),
  {label: 'Blog', to: '/blogs'},
  ...PRIMARY_NAV.slice(3),
];

/** Footer link columns. */
export const FOOTER_NAV: ReadonlyArray<{label: string; to: string}> = [
  {label: 'Catalog', to: '/collections'},
  {label: 'Projects', to: '/projects'},
  {label: 'Services', to: '/services'},
  {label: 'Blog', to: '/blogs'},
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
  '4.9 ★ · 320 reviews',
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

/** Footer link columns (Shop / Company). */
export const FOOTER_COLUMNS: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{label: string; to: string}>;
}> = [
  {
    heading: 'Shop',
    links: [
      {label: 'Recessed', to: '/collections'},
      {label: 'Linear systems', to: '/collections'},
      {label: 'Pendants', to: '/collections'},
      {label: 'Outdoor', to: '/collections'},
      {label: 'Controls', to: '/collections'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About', to: '/pages/about'},
      {label: 'Projects', to: '/projects'},
      {label: 'Services', to: '/services'},
      {label: 'Blog', to: '/blogs'},
      {label: 'Contacts', to: '/contact'},
    ],
  },
];

/** Social profiles (icon keys resolved in the Footer component). */
export const SOCIAL: ReadonlyArray<{
  label: string;
  icon: 'instagram' | 'youtube' | 'linkedin' | 'facebook';
  href: string;
}> = [
  {label: 'Instagram', icon: 'instagram', href: 'https://instagram.com'},
  {label: 'YouTube', icon: 'youtube', href: 'https://youtube.com'},
  {label: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com'},
  {label: 'Facebook', icon: 'facebook', href: 'https://facebook.com'},
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
