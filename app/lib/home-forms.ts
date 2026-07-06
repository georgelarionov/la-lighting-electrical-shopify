/**
 * Validation + result types for the marketing forms. Pure, Web-standard
 * (FormData) — safe on the workerd runtime.
 *
 * - Request a Quote posts to the homepage `_index` action.
 * - Newsletter (global footer) and the referral offer post to the
 *   `/api/subscribe` resource route, so they work from any page.
 *
 * NOTE: these currently validate and acknowledge only. Wire the validated
 * payloads to email / a CRM / Klaviyo where the TODOs indicate before launch.
 */

export type QuoteErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'message' | 'consent', string>
>;

export type HomeActionData = {
  intent: 'quote';
  ok: boolean;
  errors?: QuoteErrors;
};

export type SubscribeIntent = 'newsletter' | 'referral';
export type SubscribeResult = {
  ok: boolean;
  intent: SubscribeIntent;
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateQuote(formData: FormData): {
  ok: boolean;
  errors?: QuoteErrors;
  values: {
    name: string;
    email: string;
    phone: string;
    message: string;
    // Optional lighting-plan preferences (design wishes, not Shopify variants).
    direction: string;
    dimming: string;
    shape: string;
    runLength: string;
  };
} {
  const name = str(formData.get('name'));
  const email = str(formData.get('email'));
  const phone = str(formData.get('phone'));
  const message = str(formData.get('message'));
  const consent = formData.get('consent');
  const direction = str(formData.get('direction'));
  const dimming = str(formData.get('dimming'));
  const shape = str(formData.get('shape'));
  const runLength = str(formData.get('runLength'));

  const errors: QuoteErrors = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email.';
  if (!message) errors.message = 'Tell us a little about the project.';
  if (!consent) errors.consent = 'Please accept the Privacy Policy to continue.';

  const ok = Object.keys(errors).length === 0;
  return {
    ok,
    errors: ok ? undefined : errors,
    values: {name, email, phone, message, direction, dimming, shape, runLength},
  };
}

/**
 * Compose a Zoho Lead description from a validated quote submission — the
 * message plus any optional lighting preferences and consent flags.
 */
export function describeQuoteLead(
  values: ReturnType<typeof validateQuote>['values'],
  opts: {smsConsent: boolean; projectType?: string},
): string {
  const lines: string[] = [];
  if (values.message) lines.push(values.message);
  if (opts.projectType) lines.push(`Project type: ${opts.projectType}`);
  const prefs = [
    values.direction && `Direction: ${values.direction}`,
    values.dimming && `Dimming: ${values.dimming}`,
    values.shape && `Geometry: ${values.shape}`,
    values.runLength && `Run length: ${values.runLength} ft`,
  ].filter(Boolean);
  if (prefs.length) lines.push(`Lighting preferences — ${prefs.join(', ')}`);
  lines.push(`SMS consent: ${opts.smsConsent ? 'yes' : 'no'}`);
  return lines.join('\n');
}

/** Single-field email validation, shared by newsletter + referral. */
export function validateEmail(formData: FormData): {
  ok: boolean;
  email: string;
  error?: string;
} {
  const email = str(formData.get('email'));
  if (!email) return {ok: false, email, error: 'Please enter your email.'};
  if (!EMAIL_RE.test(email))
    return {ok: false, email, error: 'Please enter a valid email.'};
  return {ok: true, email};
}
