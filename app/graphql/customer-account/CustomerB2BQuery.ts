// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
// The merchant-set B2B fields (definitions custom.b2b_group and
// custom.b2b_discount, customer account access READ) plus the customer ID,
// which per-customer variant prices are keyed by. Read once per login, see
// ~/lib/b2b.server.ts.
export const CUSTOMER_B2B_QUERY = `#graphql
  query CustomerB2B {
    customer {
      id
      group: metafield(namespace: "custom", key: "b2b_group") {
        value
      }
      discount: metafield(namespace: "custom", key: "b2b_discount") {
        value
      }
    }
  }
` as const;
