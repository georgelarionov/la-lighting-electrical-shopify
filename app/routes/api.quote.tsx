import type {Route} from './+types/api.quote';
import {
  validateQuote,
  describeQuoteLead,
  type HomeActionData,
} from '~/lib/home-forms';
import {createZohoLead} from '~/lib/zoho';

/**
 * Resource route for the global "Request a quote" drawer (QuoteAside posts here
 * via useFetcher, so it works from any page). Same validation as the homepage
 * quote form. On success the lead is pushed to Zoho CRM (non-blocking on CRM
 * failure — the user is still acknowledged).
 */
export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<HomeActionData> {
  const formData = await request.formData();
  const {ok, errors, values} = validateQuote(formData);
  if (ok) {
    await createZohoLead(context.env, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      source: values.product
        ? 'Website — install request (product page)'
        : 'Website — quote drawer',
      description: describeQuoteLead(values, {
        smsConsent: formData.get('smsConsent') === 'yes',
      }),
    });
  }
  return {intent: 'quote', ok, errors};
}
