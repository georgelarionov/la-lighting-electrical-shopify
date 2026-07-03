/**
 * The 11-service catalog from the MagicPath "Services — All" mockup, ported 1:1.
 * Marketing copy + imagery only (services are not a Storefront resource).
 * Consumed by `routes/services._index.tsx` (grid + tabs) and
 * `routes/services.$handle.tsx` (universal detail template).
 *
 * `getServiceEntry` also resolves the legacy 6-service handles in `services.ts`
 * (referenced by project cross-links) so every /services/<handle> renders.
 */
import {getService} from '~/lib/services';
import design from '~/assets/mp/svc-design.jpg?url';
import designHero from '~/assets/mp/svc-design-hero.jpg?url';
import linear from '~/assets/mp/svc-linear.jpg?url';
import track from '~/assets/mp/svc-track.jpg?url';
import museum from '~/assets/mp/svc-museum.jpg?url';
import electrical from '~/assets/mp/svc-electrical.jpg?url';
import install from '~/assets/mp/catalog-service.jpg?url';

export type SvcCat = 'Design' | 'Linear' | 'Track' | 'Install';

export type ServiceEntry = {
  id: string;
  cat: SvcCat;
  name: string;
  blurb: string;
  img: string;
  featured?: boolean;
};

export const SERVICE_IMAGES = {design, designHero, linear, track, museum, electrical, install};

export const SERVICES: ServiceEntry[] = [
  {id: 'lighting-design', cat: 'Design', name: 'Lighting Design', blurb: 'A free photometric plan — layout, fixture list and spacing for your exact space.', img: design, featured: true},
  {id: 'office-linear', cat: 'Linear', name: 'Office Linear Lighting', blurb: 'Even, glare-free linear light that makes open-plan offices easy to work in.', img: linear},
  {id: 'retail-linear', cat: 'Linear', name: 'Retail Linear Lighting', blurb: 'Continuous lines that pull the eye to the product, not the fixture.', img: linear},
  {id: 'horeca-linear', cat: 'Linear', name: 'HoReCa Linear Lighting', blurb: 'Warm, seamless linear light for restaurants, bars and hotels.', img: linear},
  {id: 'residential-track', cat: 'Track', name: 'Residential Track Lighting', blurb: 'Modern European track for homes — flexible, adjustable, beautiful.', img: track},
  {id: 'horeca-track', cat: 'Track', name: 'HoReCa Track Lighting', blurb: 'Accent and ambience for hospitality, on a clean modern track.', img: track},
  {id: 'office-track', cat: 'Track', name: 'Office Track Lighting', blurb: 'Adjustable track that adapts as the floor plan changes.', img: track},
  {id: 'retail-track', cat: 'Track', name: 'Retail Track Lighting', blurb: 'Sharp, aimable accent light that sells the merchandise.', img: track},
  {id: 'museum-track', cat: 'Track', name: 'Museum Track Lighting', blurb: 'Specialized, glare-free spotlighting that protects and reveals the work.', img: museum},
  {id: 'installation', cat: 'Install', name: 'Licensed Installation', blurb: 'C-10 electricians install any fixture to Title 24 — fully turnkey.', img: install},
  {id: 'electrical', cat: 'Install', name: 'Licensed Electrical Work', blurb: 'Panels, circuits and controls by a licensed C-10 contractor.', img: electrical},
];

export const SERVICE_TABS: {id: 'All' | SvcCat; label: string}[] = [
  {id: 'All', label: 'All services'},
  {id: 'Design', label: 'Design'},
  {id: 'Linear', label: 'Linear lighting'},
  {id: 'Track', label: 'Track lighting'},
  {id: 'Install', label: 'Install & electrical'},
];

/** Resolve a service by handle — the 11 catalog entries plus legacy 6-service handles. */
export function getServiceEntry(handle: string): ServiceEntry | undefined {
  const found = SERVICES.find((s) => s.id === handle);
  if (found) return found;
  const legacy = getService(handle);
  if (legacy) {
    return {
      id: legacy.handle,
      cat: 'Design',
      name: legacy.title,
      blurb: legacy.summary,
      img: design,
    };
  }
  return undefined;
}
