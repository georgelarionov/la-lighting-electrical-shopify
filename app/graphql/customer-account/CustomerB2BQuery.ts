// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
// The merchant-set "B2B discount %" (definition custom.b2b_discount, customer
// account access READ). Read once per login, see ~/lib/b2b.server.ts.
export const CUSTOMER_B2B_QUERY = `#graphql
  query CustomerB2B {
    customer {
      metafield(namespace: "custom", key: "b2b_discount") {
        value
      }
    }
  }
` as const;
