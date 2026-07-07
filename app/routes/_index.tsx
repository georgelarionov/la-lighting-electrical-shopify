import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {seo} from '~/lib/seo';
import {Hero} from '~/components/sections/Hero';
import {TrustStrip} from '~/components/sections/TrustStrip';
import {CatalogSlider} from '~/components/sections/CatalogSlider';
import {Services} from '~/components/sections/Services';
import {TwoUp} from '~/components/sections/TwoUp';
import {Projects} from '~/components/sections/Projects';
import {PromiseSection} from '~/components/sections/Promise';
import {QuoteCta} from '~/components/sections/QuoteCta';
import {BlogPosts} from '~/components/sections/BlogPosts';
import {Offer} from '~/components/sections/Offer';
import {
  validateQuote,
  describeQuoteLead,
  type HomeActionData,
} from '~/lib/home-forms';
import {createZohoLead} from '~/lib/zoho';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `${COMPANY_NAME} | Commercial & Industrial Electrical Services`,
    description:
      'Licensed, insured, and certified electrical services in Los Angeles — installation, maintenance, and lighting design for commercial and industrial facilities.',
    url: location.pathname,
  });
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [featuredResult, articlesResult] = await Promise.all([
    context.storefront.query(HOME_FEATURED_QUERY).catch((error: Error) => {
      console.error(error);
      return null;
    }),
    context.storefront.query(HOME_ARTICLES_QUERY).catch((error: Error) => {
      console.error(error);
      return null;
    }),
  ]);

  return {
    featured: featuredResult?.collection?.products?.nodes ?? [],
    articles: articlesResult?.articles?.nodes ?? [],
  };
}

export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<HomeActionData> {
  const formData = await request.formData();
  // The homepage handles the Request a Quote form; newsletter + referral post
  // to the /api/subscribe resource route.
  const {ok, errors, values} = validateQuote(formData);
  if (ok) {
    await createZohoLead(context.env, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      source: 'Website — homepage quote',
      description: describeQuoteLead(values, {
        smsConsent: formData.get('smsConsent') === 'yes',
      }),
    });
  }
  return {intent: 'quote', ok, errors};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Hero />
      <TrustStrip />
      <CatalogSlider products={data.featured} />
      <Services />
      <TwoUp />
      <Projects />
      <PromiseSection />
      <QuoteCta />
      <BlogPosts articles={data.articles} />
      <Offer />
    </>
  );
}

// Featured products for the homepage are whatever the merchant puts in the
// "Home page" collection (handle `frontpage`, Shopify's built-in featured
// collection) — add / remove / reorder them in admin, no code change.
// COLLECTION_DEFAULT respects the collection's manual sort order.
const HOME_FEATURED_QUERY = `#graphql
  fragment HomeFeaturedProduct on Product {
    id
    title
    handle
    productType
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
  query HomeFeatured($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "frontpage") {
      products(first: 12, sortKey: COLLECTION_DEFAULT) {
        nodes {
          ...HomeFeaturedProduct
        }
      }
    }
  }
` as const;

const HOME_ARTICLES_QUERY = `#graphql
  fragment HomeArticle on Article {
    id
    title
    handle
    excerpt
    publishedAt
    image {
      id
      url
      altText
      width
      height
    }
    author: authorV2 {
      name
    }
    blog {
      handle
    }
  }
  query HomeArticles($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        ...HomeArticle
      }
    }
  }
` as const;
