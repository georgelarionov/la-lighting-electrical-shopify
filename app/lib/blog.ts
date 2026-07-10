/**
 * Blog helpers shared by the listing (`blog._index`) and the article page
 * (`blog.$articleHandle`) so their behaviour stays in sync.
 */

// Map a post category (article tag) to the related service page, so the
// category chip links to that service. Unmapped categories render as plain text.
export const CATEGORY_SERVICE: Record<string, string> = {
  'Architectural Lighting Installation':
    'hospitality-architectural-lighting-installation',
  Design: 'lighting-design',
  Energy: 'led-retrofits',
  Code: 'title-24-compliance',
  'How-to': 'lighting-controls',
  Commercial: 'hospitality-architectural-lighting-installation',
};

/** The service page URL for a category, or undefined when none is mapped. */
export function categoryServiceHref(cat: string): string | undefined {
  const handle = CATEGORY_SERVICE[cat];
  return handle ? `/services/${handle}` : undefined;
}
