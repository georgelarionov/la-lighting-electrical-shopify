/**
 * ALS (internal name ILS) — the linkable linear pendant system. Everything the
 * ALS selling page needs that Shopify does not hold yet lives here, sourced in
 * marketing/runs/2026-11-10-alsftc/iterations/01-ALS-sections/{release,copy,creative}.md.
 *
 * ponytail: product-specific config in code. At release the copy overrides
 * (title/eyebrow/subtitle/specs/faqs) move into Shopify metafields and are
 * deleted here; shapes, tiers and gallery order stay until a second linkable
 * system exists.
 */

export const ALS_HANDLE = 'als-architectural-linear-system';

/**
 * Preview-only content (cert, "in use since", projects, volume tiers) whose
 * proof files have not arrived. Must be `false` on main unless the matching
 * claim in marketing/.../claims.csv is closed — that is a release gate.
 */
export const SHOW_MOCKS = true;

export const SIZES = ['2 ft', '4 ft', '8 ft'] as const;
export type Size = (typeof SIZES)[number];
export const FEET: Record<Size, number> = {'2 ft': 2, '4 ft': 4, '8 ft': 8};

/** Owner-confirmed output per section length (D8; spec sheet pending → C10). */
export const OUTPUT: Record<Size, {lm: string; w: string}> = {
  '2 ft': {lm: '2,600 lm', w: '20 W'},
  '4 ft': {lm: '5,200 lm', w: '40 W'},
  '8 ft': {lm: '10,400 lm', w: '80 W'},
};

/** Defaults when a shopper lands without picking a length (release R1). */
export const DEFAULT_FINISH = 'Black';
export const DEFAULT_CCT = '3500K';

export const ALS_COPY = {
  // ponytail: preview overrides — written to Shopify (title, custom.eyebrow,
  // custom.subtitle) at release, then removed from code.
  title: 'ALS Linkable Linear Pendant Light',
  eyebrow: 'Architectural Linear System',
  subtitle:
    'LED sections in 2, 4 and 8 ft. Link them with L, T, X and Y connectors. Pendant mount only.',
  ship: 'In stock in California · Ships in 1–2 business days · Delivered in about a week',
  mounting: 'Pendant mount only. Not for surface or recessed mounting.',
  optionLabels: {
    Size: 'Length',
    'Body Color': 'Finish',
    'Color Temperature': 'Light color',
  } as Record<string, string>,
  cctNote: {'3000K': 'warm', '3500K': 'neutral', '4000K': 'cool'} as Record<
    string,
    string
  >,
};

/* --------------------------- gallery (creative §4.1) --------------------------- */
// Indexes are the `-N` suffix of the Shopify file names. 1 and 12–17 show the
// fixture flush to the ceiling, which ALS cannot do (C13) → hidden.
// ponytail: order/hide by file name until the media is fixed in Shopify at release.
export const GALLERY_ORDER = [3, 4, 2, 8, 5, 0, 6, 11, 10, 9, 7, 19, 18];
export const RENDERING = new Set([0, 2, 3, 4, 5]);
export const FIRST_FRAME = 3;
export const FRAME_CAPTION: Record<number, string> = {
  3: 'Rectangle made from sections and L connectors',
};
/** Studio frame per Size × Finish (verified 1 : 2.1 : 4.0 in creative F4). */
export const VARIANT_FRAME: Record<string, number> = {
  '2 ft|Black': 6,
  '2 ft|White': 10,
  '4 ft|Black': 8,
  '4 ft|White': 9,
  '8 ft|Black': 11,
  '8 ft|White': 7,
};
export function frameIndex(url: string): number {
  const m = /-(\d+)\.(?:jpe?g|png|webp)/i.exec(url);
  return m ? Number(m[1]) : -1;
}

/* ------------------------------- connectors ------------------------------- */
export const CONNECTORS = {
  L: {handle: 'l-connector-als-system', blurb: 'Joins 2 sections at a corner'},
  T: {handle: 't-connector-als-system', blurb: 'Joins 3 sections in a T'},
  X: {handle: 'x-connector-als-system', blurb: 'Joins 4 sections in a cross'},
  Y: {handle: 'y-connector-als-system', blurb: 'Joins 3 sections in a Y'},
} as const;
export type ConnectorType = keyof typeof CONNECTORS;

/* --------------------------------- shapes --------------------------------- */
// Plan-view geometry in feet. Parts are derived from the geometry, so the
// diagram, the parts list and the total can never disagree (creative §2.2).
type Seg = {x1: number; y1: number; x2: number; y2: number};
type Node = {x: number; y: number; type: ConnectorType};
export type ShapeSize = {
  label: string;
  segs: Seg[];
  nodes: Node[];
};
export type Shape = {id: string; name: string; sizes: ShapeSize[]};

const h = (x: number, y: number, len: number): Seg => ({x1: x, y1: y, x2: x + len, y2: y});
const v = (x: number, y: number, len: number): Seg => ({x1: x, y1: y, x2: x, y2: y + len});

const line = (a: number): ShapeSize => ({label: `${a} ft`, segs: [h(0, 0, a)], nodes: []});
const ell = (a: number, b: number): ShapeSize => ({
  label: `about ${a} × ${b} ft`,
  segs: [h(0, 0, a), v(0, 0, b)],
  nodes: [{x: 0, y: 0, type: 'L'}],
});
const rect = (a: number, b: number): ShapeSize => ({
  label: `about ${a} × ${b} ft`,
  segs: [h(0, 0, a), h(0, b, a), v(0, 0, b), v(a, 0, b)],
  nodes: [
    {x: 0, y: 0, type: 'L'},
    {x: a, y: 0, type: 'L'},
    {x: 0, y: b, type: 'L'},
    {x: a, y: b, type: 'L'},
  ],
});
const tee = (a: number): ShapeSize => ({
  label: `about ${2 * a} × ${a} ft`,
  segs: [h(0, 0, a), h(a, 0, a), v(a, 0, a)],
  nodes: [{x: a, y: 0, type: 'T'}],
});

// Y is left out until the spec sheet names its angle (creative Q6); straight
// runs past 8 ft until we know how two sections join end to end (Q4).
export const SHAPES: Shape[] = [
  {id: 'rectangle', name: 'Rectangle', sizes: [rect(8, 4), rect(4, 4), rect(8, 8), rect(4, 2)]},
  {id: 'l', name: 'L-shape', sizes: [ell(8, 4), ell(4, 4), ell(8, 8)]},
  {id: 't', name: 'T-shape', sizes: [tee(4), tee(8)]},
  {id: 'line', name: 'Line', sizes: [line(8), line(4), line(2)]},
];

export type Part =
  | {kind: 'section'; size: Size; qty: number}
  | {kind: 'connector'; type: ConnectorType; qty: number};

export function partsOf(s: ShapeSize): Part[] {
  const out: Part[] = [];
  for (const size of [...SIZES].reverse()) {
    const qty = s.segs.filter(
      (g) => Math.abs(g.x2 - g.x1) + Math.abs(g.y2 - g.y1) === FEET[size],
    ).length;
    if (qty) out.push({kind: 'section', size, qty});
  }
  for (const type of Object.keys(CONNECTORS) as ConnectorType[]) {
    const qty = s.nodes.filter((n) => n.type === type).length;
    if (qty) out.push({kind: 'connector', type, qty});
  }
  return out;
}

/* ---------------------------- volume tiers (C09) ---------------------------- */
// [MOCK] numbers are a Warehouse-Lighting-style placeholder until the owner
// gives real tiers and lale-profit checks margin. Real discount = 3 Shopify
// automatic discounts (min qty) created at release — no code.
export const TIERS = SHOW_MOCKS
  ? [
      {min: 3, pct: 5},
      {min: 10, pct: 10},
      {min: 15, pct: 12},
    ]
  : [];
export function tierFor(qty: number) {
  return [...TIERS].reverse().find((t) => qty >= t.min) ?? null;
}
export function nextTier(qty: number) {
  return TIERS.find((t) => qty < t.min) ?? null;
}

/* ------------------------------- proof (mocks) ------------------------------- */
// [MOCK: C05, C06, C12] — shown only with SHOW_MOCKS.
export const PROOF = {
  listing: 'UL Listed', // UL or ETL exactly as the certificate says
  listingDetail: 'File no. E000000 · Covers: ALS 2, 4 and 8 ft sections',
  since: '2019',
  generation: '4th generation',
};

/* ------------------------- spec + FAQ overrides ------------------------- */
// ponytail: preview overrides of custom.specs / custom.faqs — pushed to the
// metaobjects at release, then deleted.
export const SPEC_OVERRIDES: Record<string, string | null> = {
  'Fixture type': 'LED linear pendant',
  Mounting: 'Pendant only. Not for surface or recessed mounting.',
  'Light direction': null, // until up/down is confirmed (Q7)
  Compliance: null, // "Title 24 certified" is not how it's documented (C05)
  'Outdoor rated': null,
};
export const SPEC_EXTRA = [
  {label: 'Lengths', value: '2 ft, 4 ft, 8 ft (nominal)'},
  {label: 'Connectors', value: 'L, T, X, Y · $99 each · Black or White'},
  {label: 'Use', value: 'Indoor use only'},
];

export const FAQS = [
  {
    question: 'Can I mount it flush or recessed?',
    answer: "No. ALS is pendant mount only. It isn't made for surface or recessed mounting.",
  },
  {
    question: 'How do sections connect?',
    answer:
      'With L, T, X and Y connectors, $99 each, sold separately. Pick a layout in Build a shape to see which ones you need. Planning a straight run longer than 8 ft? Call us before you order.',
  },
  {
    question: 'How fast will it ship?',
    answer:
      "It's in stock in California. Orders ship in 1–2 business days and arrive in about a week.",
  },
  {
    question: 'Will it work with my dimmer?',
    answer: 'ALS dims on 0–10V. Use a 0–10V dimmer or control system.',
  },
  {
    question: 'What comes in the box?',
    answer:
      "Call (818) 474-6009 before you order and we'll tell you exactly what ships with each section.",
  },
  SHOW_MOCKS
    ? {
        question: 'Do you have volume pricing?',
        answer:
          'Yes. 3+ sections: 5% off. 10+: 10% off. 15+: 12% off. Mix any lengths. Need 20+? Ask for project pricing.',
      }
    : {
        question: 'Do you have volume pricing?',
        answer: "Send us your parts and quantities and we'll quote the whole order.",
      },
];
