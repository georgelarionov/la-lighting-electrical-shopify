/**
 * Zoho CRM lead delivery. Pushes captured form submissions into Zoho CRM as
 * Leads via the v2 REST API using the refresh-token OAuth flow. Server-only —
 * every secret comes from `context.env` (never `process.env`, never in code).
 *
 * Runs on workerd: Web-standard `fetch` + Web Crypto only.
 *
 * Env: ZOHO_ACCOUNTS_HOST, ZOHO_API_HOST, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET,
 * ZOHO_REFRESH_TOKEN (US data center → accounts.zoho.com / www.zohoapis.com).
 */

export type ZohoLead = {
  /** Full name from the form; split into First/Last for Zoho. */
  name?: string;
  email?: string;
  phone?: string;
  /** Zoho Leads requires a Company — defaults when a form doesn't collect one. */
  company?: string;
  /** Which form/page the lead came from (goes into the Description). */
  source: string;
  /** Free-text body: message + preferences + consents. */
  description?: string;
};

// Per-isolate access-token cache. Access tokens live ~1h; caching avoids
// re-minting one on every submit (Zoho rate-limits token generation). Safe:
// tokens are short-lived and the cache is scoped to a single worker isolate.
let cachedToken: {value: string; expiresAt: number} | null = null;

function hasZohoConfig(env: Env): boolean {
  return Boolean(
    env.ZOHO_ACCOUNTS_HOST &&
      env.ZOHO_API_HOST &&
      env.ZOHO_CLIENT_ID &&
      env.ZOHO_CLIENT_SECRET &&
      env.ZOHO_REFRESH_TOKEN,
  );
}

async function getAccessToken(env: Env): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(`${env.ZOHO_ACCOUNTS_HOST}/oauth/v2/token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      refresh_token: env.ZOHO_REFRESH_TOKEN,
    }),
  });
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!json.access_token) {
    throw new Error(`Zoho token error: ${json.error ?? res.status}`);
  }
  cachedToken = {
    value: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

function splitName(name?: string): {First_Name?: string; Last_Name: string} {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return {Last_Name: 'Website lead'};
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return {Last_Name: parts[0]};
  return {
    First_Name: parts.slice(0, -1).join(' '),
    Last_Name: parts[parts.length - 1],
  };
}

/**
 * Create a Lead in Zoho CRM. Never throws — returns `false` on any failure so a
 * CRM hiccup can't break the user-facing form submit (callers still ack the
 * user). Errors are logged for debugging. No-op (returns `false`) when the
 * ZOHO_* env isn't configured.
 */
export async function createZohoLead(
  env: Env,
  lead: ZohoLead,
): Promise<boolean> {
  if (!hasZohoConfig(env)) {
    console.warn('[zoho] skipped — ZOHO_* env not configured');
    return false;
  }

  try {
    const token = await getAccessToken(env);

    // Prepend the source so it's always captured (Lead_Source is a Zoho
    // picklist and would reject unlisted values, so we keep it in Description).
    const description = lead.description
      ? `Source: ${lead.source}\n\n${lead.description}`
      : `Source: ${lead.source}`;

    const record = {
      ...splitName(lead.name),
      ...(lead.email ? {Email: lead.email} : {}),
      ...(lead.phone ? {Phone: lead.phone} : {}),
      Company: lead.company?.trim() || 'Website lead',
      Description: description,
      // Lead_Source is a Zoho picklist — the value MUST already exist in the
      // Leads › Lead Source picklist or Zoho rejects the record. Only sent when
      // configured, so leads still create if the value hasn't been added yet.
      ...(env.ZOHO_LEAD_SOURCE ? {Lead_Source: env.ZOHO_LEAD_SOURCE} : {}),
      // Assign to a specific Zoho user when configured; otherwise Zoho defaults
      // the owner to the API user (token owner).
      ...(env.ZOHO_LEAD_OWNER_ID
        ? {Owner: {id: env.ZOHO_LEAD_OWNER_ID}}
        : {}),
    };

    const res = await fetch(`${env.ZOHO_API_HOST}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: [record]}),
    });

    // A stale/invalid access token → drop the cache so the next call re-mints.
    if (res.status === 401) cachedToken = null;

    // Zoho returns HTTP 202 with a per-record error (e.g. MANDATORY_NOT_FOUND,
    // DUPLICATE_DATA) — res.ok is still true, so inspect the record status.
    const json = (await res.json().catch(() => null)) as {
      data?: Array<{code?: string; status?: string; message?: string}>;
    } | null;
    const result = json?.data?.[0];

    if (!res.ok || result?.code !== 'SUCCESS') {
      console.error(
        `[zoho] lead create failed (${res.status}): ${result?.code ?? ''} ${
          result?.message ?? JSON.stringify(json)
        }`,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error('[zoho] lead create error', err);
    return false;
  }
}
