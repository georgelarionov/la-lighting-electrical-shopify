import type {Route} from './+types/api.subscribe';
import {validateEmail, type SubscribeResult} from '~/lib/home-forms';

/**
 * Action-only resource route for the global footer newsletter and the
 * referral offer. Both post here via `useFetcher`, so they work on any page.
 */
export async function action({
  request,
}: Route.ActionArgs): Promise<SubscribeResult> {
  const formData = await request.formData();
  const intent: SubscribeResult['intent'] =
    formData.get('intent') === 'referral' ? 'referral' : 'newsletter';

  const {ok, error} = validateEmail(formData);
  // TODO: on `ok`, forward the email (and intent) to the email platform / CRM.

  return {ok, intent, error};
}
