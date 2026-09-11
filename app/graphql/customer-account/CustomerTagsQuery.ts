// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
// Only the tags: the B2B flag is derived from them (see ~/lib/b2b.server.ts).
export const CUSTOMER_TAGS_QUERY = `#graphql
  query CustomerTags {
    customer {
      tags
    }
  }
` as const;
