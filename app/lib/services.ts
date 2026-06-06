/**
 * Service catalog — static brand content (services are not a Storefront API
 * resource). Mirrors the pattern in `site.ts`: marketing copy lives in code.
 * Consumed by `routes/services._index.tsx` (grid) and
 * `routes/services.$handle.tsx` (detail). `icon` is a lucide key resolved in
 * the component, the same indirection the Footer uses for socials.
 */

export type ServiceIcon =
  | 'design'
  | 'compliance'
  | 'install'
  | 'controls'
  | 'retrofit'
  | 'maintenance';

export type Service = {
  handle: string;
  title: string;
  /** One line — used on cards and as the meta description. */
  summary: string;
  /** Longer body, one entry per paragraph. */
  description: string[];
  /** "What's included" checklist on the detail page. */
  includes: string[];
  /** Concrete outcomes / who it's for. */
  outcomes: string[];
  icon: ServiceIcon;
};

export const SERVICES: ReadonlyArray<Service> = [
  {
    handle: 'lighting-design',
    title: 'Lighting design',
    summary:
      'Photometric layouts and fixture schedules, drawn to your space and your drawings.',
    description: [
      'We start from the room. Send us a plan or a set of drawings and we return a photometric layout that shows light levels, fixture placement, and the schedule to order from.',
      'Every layout is built around how the space is used, the finishes in it, and the mood you are after, so the result reads intentional rather than over-lit.',
    ],
    includes: [
      'Photometric study with calculated light levels',
      'Fixture schedule and specification sheets',
      'Reflected ceiling plan markups',
      'Mockups for key fixtures on request',
    ],
    outcomes: [
      'A documented plan you can price and permit',
      'Fewer change orders during installation',
      'A room that feels considered, not flooded',
    ],
    icon: 'design',
  },
  {
    handle: 'title-24-compliance',
    title: 'Title 24 compliance',
    summary:
      'California energy-code documentation, prepared and ready for permit.',
    description: [
      'Lighting in California has to meet Title 24. We handle the calculations and paperwork so your project clears plan check without back-and-forth.',
      'We document controls, power densities, and allowances up front, so the design you approved is the design that gets built.',
    ],
    includes: [
      'Title 24 lighting compliance forms',
      'Connected-load and power-density calculations',
      'Controls documentation for permit',
      'Coordination with your permit set',
    ],
    outcomes: [
      'A permit-ready compliance package',
      'No surprises at plan check',
      'Controls specified to code from day one',
    ],
    icon: 'compliance',
  },
  {
    handle: 'electrical-installation',
    title: 'Electrical installation',
    summary:
      'A licensed C-10 crew installs exactly what we spec — no subcontracted guesswork.',
    description: [
      'Our C-10 licensed electricians install the fixtures and controls we draw, so the layout on paper is the layout on the ceiling.',
      'Work is insured, code-compliant, and scheduled around a firm date, with the same team from rough-in to final aiming.',
    ],
    includes: [
      'Rough-in, fixture set, and final connection',
      'Controls wiring and commissioning',
      'Fixture aiming and focus',
      'Permit coordination and inspection support',
    ],
    outcomes: [
      'Installed by the people who specified it',
      'Licensed, insured, and to California code',
      'A firm date you can plan around',
    ],
    icon: 'install',
  },
  {
    handle: 'lighting-controls',
    title: 'Lighting controls',
    summary:
      'Dimming, scenes, and sensing — programmed so a room changes with the day.',
    description: [
      'Good light is not one setting. We design and program controls so a space can shift from morning to evening, from working to hosting, without a panel full of guesswork.',
      'From simple dimming to daylight and occupancy sensing, we set up scenes that people actually use and can adjust later.',
    ],
    includes: [
      'Dimming and scene design',
      'Daylight and occupancy sensing',
      'Controls programming and commissioning',
      'A simple handover and cheat sheet',
    ],
    outcomes: [
      'Scenes tuned to how the room is used',
      'Energy saved when spaces sit empty',
      'Controls people understand at a glance',
    ],
    icon: 'controls',
  },
  {
    handle: 'led-retrofits',
    title: 'LED retrofits',
    summary:
      'Swap aging fixtures for efficient LED and watch the savings pay it back.',
    description: [
      'If you are running older fluorescent or HID lighting, a retrofit is usually the fastest win available — lower bills, better light, less maintenance.',
      'We survey what you have, model the savings, and replace it with LED that matches the color and feel of the space, not just the wattage.',
    ],
    includes: [
      'Site survey and energy modeling',
      'Fixture and lamp recommendations',
      'Rebate and incentive guidance',
      'Phased installation to limit downtime',
    ],
    outcomes: [
      'Lower energy and maintenance bills',
      'A clear, documented payback period',
      'Better, more consistent light quality',
    ],
    icon: 'retrofit',
  },
  {
    handle: 'maintenance-service',
    title: 'Maintenance & service',
    summary:
      'Relamping, repairs, and tune-ups that keep a space looking the way it opened.',
    description: [
      'Lighting drifts over time — lamps fail, aim shifts, scenes get bumped. We keep it dialed in so the space stays as sharp as the day it was finished.',
      'Schedule recurring service or call us when something needs attention; either way you get the same licensed crew that knows the install.',
    ],
    includes: [
      'Scheduled relamping and cleaning',
      'Fixture and controls repair',
      'Re-aiming and scene resets',
      'Priority response for service calls',
    ],
    outcomes: [
      'Light that stays consistent over years',
      'One team that already knows your system',
      'Fewer emergencies, planned upkeep',
    ],
    icon: 'maintenance',
  },
];

export function getService(handle: string): Service | undefined {
  return SERVICES.find((service) => service.handle === handle);
}
