import type {Route} from './+types/account_.authorize';

export async function loader({context}: Route.LoaderArgs) {
  // A fresh sign-in may be a different customer: drop the cached B2B flag so
  // the root loader looks the tag up again (see ~/lib/b2b.server.ts).
  context.session.unset('b2b');
  return context.customerAccount.authorize();
}
