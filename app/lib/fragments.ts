// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
    parentRelationship {
      parent {
        id
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
    lineComponents {
      ...CartLine
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    # Carries the buyer's name. buyerIdentity has no name field, and its
    # deliveryAddressPreferences was deprecated in 2025-01, so the name rides on
    # the cart as an attribute and reaches the merchant on the order.
    attributes {
      key
      value
    }
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

/**
 * Category navigation — the single source for the header mega-menu and the
 * footer "Shop" column.
 *
 * This replaces the skeleton's `menu(handle: "main-menu")` query: a Shopify
 * navigation menu only yields a title and a URL, while a mega-menu that lets
 * someone pick a fixture by sight needs the collection's own image. Collections
 * are already what the merchant curates, so there is no second system to keep
 * in sync. Display order and the plain-English blurbs live in
 * `~/lib/site.ts` (`NAV_CATEGORIES`); anything the merchant adds later still
 * shows up, just at the end of the list.
 */
export const NAV_QUERY = `#graphql
  query Nav($country: CountryCode, $language: LanguageCode)
    @inContext(language: $language, country: $country) {
    collections(first: 25) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
          width
          height
        }
        # Presence probe only — buildNav drops categories with nothing live in
        # them. The Storefront API hides DRAFT/unpublished products but still
        # returns the collection, so without this a category whose whole
        # contents are still drafts would advertise an empty page.
        products(first: 1) {
          nodes {
            id
          }
        }
      }
    }
  }
` as const;
