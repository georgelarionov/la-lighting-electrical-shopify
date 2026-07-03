import type {Route} from './+types/api.quote';
import {validateQuote, type HomeActionData} from '~/lib/home-forms';

/**
 * Resource route for the global "Request a quote" drawer (QuoteAside posts here
 * via useFetcher, so it works from any page). Same validation as the homepage
 * quote form. `smsConsent` is captured (optional opt-in).
 */
export async function action({
  request,
}: Route.ActionArgs): Promise<HomeActionData> {
  const formData = await request.formData();
  const {ok, errors} = validateQuote(formData);
  // TODO: forward the validated payload + smsConsent opt-in to email / CRM.
  return {intent: 'quote', ok, errors};
}
