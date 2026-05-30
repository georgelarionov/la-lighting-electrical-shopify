import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
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
import {validateQuote, type HomeActionData} from '~/lib/home-forms';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = () => {
  return [
    {
      title: `${COMPANY_NAME} | Commercial & Industrial Electrical Services`,
    },
    {
      name: 'description',
      content:
        'Licensed, insured, and certified electrical services in Los Angeles — installation, maintenance, and lighting design for commercial and industrial facilities.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, articlesResult] = await Promise.all([
    context.storefront.query(HOME_COLLECTIONS_QUERY),
    context.storefront.query(HOME_ARTICLES_QUERY).catch((error: Error) => {
      console.error(error);
      return null;
    }),
  ]);

  return {
    collections: collections.nodes,
    articles: articlesResult?.articles?.nodes ?? [],
  };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<HomeActionData> {
  const formData = await request.formData();
  // The homepage handles the Request a Quote form; newsletter + referral post
  // to the /api/subscribe resource route.
  const {ok, errors} = validateQuote(formData);
  // TODO: forward `values` to email / CRM on success.
  return {intent: 'quote', ok, errors};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Hero />
      <TrustStrip />
      <CatalogSlider collections={data.collections} />
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

const HOME_COLLECTIONS_QUERY = `#graphql
  fragment HomeCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query HomeCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...HomeCollection
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
