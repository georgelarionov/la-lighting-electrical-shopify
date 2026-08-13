import type {NavQuery} from 'storefrontapi.generated';
import {NAV_CATEGORIES} from '~/lib/site';

type CollectionImage = NonNullable<
  NavQuery['collections']['nodes'][number]['image']
>;

/**
 * Structural, not `NavQuery`-bound: the catalog route folds the same collection
 * fields into its own products query rather than paying for a second round
 * trip, so both query shapes need to feed `buildNav`.
 */
type NavSource = {
  collections: {
    nodes: ReadonlyArray<{
      handle: string;
      title: string;
      image?: CollectionImage | null;
      products: {nodes: ReadonlyArray<{id: string}>};
    }>;
  };
};

export type NavCategory = {
  handle: string;
  title: string;
  url: string;
  /** Plain-English blurb from `NAV_CATEGORIES`; empty for unlisted collections. */
  blurb: string;
  featured: boolean;
  image: CollectionImage | null;
};

/**
 * Merge live Shopify collections with the curated order/microcopy in
 * `NAV_CATEGORIES`.
 *
 * Curated handles come first, in listed order. Anything else the merchant
 * created lands after them rather than disappearing — a category is only ever
 * missing from the nav if it is missing from Shopify.
 *
 * Two exclusions: `frontpage` is the built-in homepage collection rather than a
 * customer-facing category, and any collection with nothing published in it is
 * dropped. The second one matters — several categories here are fully stocked
 * in admin but every product is still a draft, and linking a shopper (or a
 * crawler) to a guaranteed-empty page is worse than not offering it. Publish
 * the products and the category reappears on its own; no code change.
 */
export function buildNav(nav: NavSource | null | undefined): NavCategory[] {
  const nodes = (nav?.collections?.nodes ?? []).filter(
    (c) => c.handle !== 'frontpage' && c.products.nodes.length > 0,
  );
  const meta = new Map(NAV_CATEGORIES.map((c) => [c.handle, c]));
  const rank = new Map(NAV_CATEGORIES.map((c, i) => [c.handle, i]));

  return nodes
    .map((c) => ({
      handle: c.handle,
      title: c.title,
      url: `/collections/${c.handle}`,
      blurb: meta.get(c.handle)?.blurb ?? '',
      featured: meta.get(c.handle)?.featured ?? false,
      image: c.image ?? null,
    }))
    .sort(
      (a, b) =>
        (rank.get(a.handle) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(b.handle) ?? Number.MAX_SAFE_INTEGER),
    );
}
