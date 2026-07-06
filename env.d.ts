/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  // Custom Oxygen env vars (set in Oxygen → Environment variables; mirrored in
  // local .env for dev). Zoho CRM lead delivery — see app/lib/zoho.ts.
  interface Env {
    ZOHO_ACCOUNTS_HOST: string;
    ZOHO_API_HOST: string;
    ZOHO_CLIENT_ID: string;
    ZOHO_CLIENT_SECRET: string;
    ZOHO_REFRESH_TOKEN: string;
    /** Optional Zoho user id to own new leads (else the API user owns them). */
    ZOHO_LEAD_OWNER_ID: string;
    /** Optional Lead_Source value — must already exist in the Zoho picklist. */
    ZOHO_LEAD_SOURCE: string;
  }
}
