import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import {ArrowRight} from 'lucide-react';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';
import {PageHeader} from '~/components/PageHeader';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Policies | Los Angeles Lighting & Electrical'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="bg-canvas">
      <PageHeader
        title="Policies"
        description="The legal terms behind ordering, shipping, and working with us."
      />
      <div className="container-narrow section-y">
        <div className="divide-y divide-hairline border-y border-hairline">
          {policies.map((policy) => (
            <Link
              key={policy.id}
              to={`/policies/${policy.handle}`}
              prefetch="intent"
              className="group flex items-center justify-between gap-4 py-5"
            >
              <span className="type-body-strong text-ink transition-colors group-hover:text-primary">
                {policy.title}
              </span>
              <ArrowRight className="size-5 shrink-0 text-ink-subtle transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
