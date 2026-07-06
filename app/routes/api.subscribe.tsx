import type {Route} from './+types/api.subscribe';
import {validateEmail, type SubscribeResult} from '~/lib/home-forms';
import {createZohoLead} from '~/lib/zoho';

/**
 * Action-only resource route for the global footer newsletter and the
 * referral offer. Both post here via `useFetcher`, so they work on any page.
 * On success the email is pushed to Zoho CRM as a lead.
 */
export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<SubscribeResult> {
  const formData = await request.formData();
  const intent: SubscribeResult['intent'] =
    formData.get('intent') === 'referral' ? 'referral' : 'newsletter';

  const {ok, error, email} = validateEmail(formData);
  if (ok) {
    await createZohoLead(context.env, {
      email,
      source:
        intent === 'referral' ? 'Website — referral' : 'Website — newsletter',
      description:
        intent === 'referral'
          ? 'Referral program signup'
          : 'Newsletter subscription',
    });
  }

  return {ok, intent, error};
}
