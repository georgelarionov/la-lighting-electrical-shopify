/**
 * Project portfolio — static brand content (projects are not a Storefront API
 * resource). Mirrors `services.ts`: marketing copy lives in code. Consumed by
 * `routes/projects._index.tsx` (grid) and `routes/projects.$handle.tsx`
 * (detail). `image` is a key resolved by `ProjectPhoto` (self-hosted assets);
 * `services` cross-links handles into `services.ts`.
 */

export type ProjectImage = '1' | '2' | '3';

export type Project = {
  handle: string;
  title: string;
  location: string;
  category: string;
  year: string;
  /** One line — used on cards and as the meta description. */
  summary: string;
  /** Longer body, one entry per paragraph. */
  description: string[];
  /** What the job involved. */
  scope: string[];
  image: ProjectImage;
  /** Handles into `services.ts` for cross-linking. */
  services: string[];
};

export const PROJECTS: ReadonlyArray<Project> = [
  {
    handle: 'marina-del-rey-residence',
    title: 'Ambient lighting for compact interiors',
    location: 'Marina Del Rey',
    category: 'Private Residence',
    year: '2024',
    summary:
      'A layered, low-glare scheme that makes a small home feel calm and open after dark.',
    description: [
      'A compact residence near the water wanted light that felt warm and unhurried without crowding the ceilings. We kept fixtures recessed and tight, then let dimming do the rest.',
      'The result is a home that shifts easily from bright and practical in the morning to soft and quiet in the evening, all from a handful of scenes.',
    ],
    scope: [
      'Photometric layout tuned to the existing ceilings',
      'Recessed fixtures with a consistent warm color',
      'Whole-home dimming with morning and evening scenes',
      'Licensed install and final aiming',
    ],
    image: '1',
    services: ['lighting-design', 'electrical-installation', 'lighting-controls'],
  },
  {
    handle: 'santa-monica-storefront',
    title: 'Storefront relight on a tight footprint',
    location: 'Santa Monica',
    category: 'Retail',
    year: '2023',
    summary:
      'An LED relight that brightened the merchandise and cut the energy bill on a small retail floor.',
    description: [
      'An aging storefront was running hot, dim, and uneven. We surveyed the floor, modeled the savings, and replaced the old fixtures with LED that flatters the product instead of flattening it.',
      'Sales staff got brighter, cleaner light to work under, and the owner got a power bill that pays the upgrade back on a schedule we could show on paper.',
    ],
    scope: [
      'Energy survey and savings model',
      'LED retrofit matched to the existing color',
      'Accent lighting on key displays',
      'Permit coordination and install',
    ],
    image: '2',
    services: ['lighting-design', 'led-retrofits', 'electrical-installation'],
  },
  {
    handle: 'beverly-hills-evening-room',
    title: 'Layered lighting for an evening room',
    location: 'Beverly Hills',
    category: 'Hospitality',
    year: '2023',
    summary:
      'Three layers of light and a set of scenes that carry a room from afternoon to late night.',
    description: [
      'A hospitality space needed to feel different at 4pm than it does at 10pm. We built it in layers — ambient, accent, and detail — so each can be dialed independently.',
      'A small set of scenes lets the staff change the whole mood from a single tap, and the controls are simple enough that nobody fights the panel.',
    ],
    scope: [
      'Three-layer lighting design',
      'Scene programming for service hours',
      'Dimming and warm-glow tuning',
      'Licensed install and commissioning',
    ],
    image: '3',
    services: ['lighting-design', 'lighting-controls', 'electrical-installation'],
  },
  {
    handle: 'culver-city-office',
    title: 'Daylight-tuned lighting for an open office',
    location: 'Culver City',
    category: 'Office',
    year: '2024',
    summary:
      'A code-compliant office layout that follows the daylight and stays comfortable all day.',
    description: [
      'An open-plan office wanted even, glare-free light that did not fight the windows. We laid it out for comfort at the desk and documented it for Title 24 up front.',
      'Daylight and occupancy sensing trim the lights when the sun does the work or a zone sits empty, so the space meets code and quietly saves energy.',
    ],
    scope: [
      'Photometric layout for desk-level comfort',
      'Title 24 compliance documentation',
      'Daylight and occupancy sensing',
      'Controls programming and handover',
    ],
    image: '2',
    services: ['lighting-design', 'title-24-compliance', 'lighting-controls'],
  },
  {
    handle: 'venice-gallery',
    title: 'Gallery lighting that disappears',
    location: 'Venice',
    category: 'Retail',
    year: '2022',
    summary:
      'Clean, accurate light on the work and almost nothing visible on the ceiling.',
    description: [
      'A gallery needed light that served the work without ever drawing attention to itself. We kept the hardware minimal and the color accurate, so what you notice is the art.',
      'Adjustable heads let the team re-aim for each show in minutes, and a maintenance plan keeps the color consistent as lamps age.',
    ],
    scope: [
      'Accurate, high-color-rendering fixtures',
      'Adjustable heads for changing shows',
      'Discreet ceiling layout',
      'Ongoing maintenance and re-aiming',
    ],
    image: '1',
    services: ['lighting-design', 'electrical-installation', 'maintenance-service'],
  },
  {
    handle: 'downtown-la-restaurant',
    title: 'Warm scenes for a dining room',
    location: 'Downtown LA',
    category: 'Hospitality',
    year: '2022',
    summary:
      'A warm, efficient relight with scenes that match the room to the hour.',
    description: [
      'A downtown dining room felt flat at night and expensive to run. We brought the color temperature down, layered in accents, and put the whole room on scenes.',
      'An LED retrofit lowered the running cost while the new controls let the staff move from bright lunch service to a soft dinner glow without touching a dimmer dial by dial.',
    ],
    scope: [
      'Warm LED retrofit',
      'Accent lighting on tables and bar',
      'Scene programming for service hours',
      'Licensed install and commissioning',
    ],
    image: '3',
    services: ['lighting-controls', 'led-retrofits', 'electrical-installation'],
  },
];

export function getProject(handle: string): Project | undefined {
  return PROJECTS.find((project) => project.handle === handle);
}
