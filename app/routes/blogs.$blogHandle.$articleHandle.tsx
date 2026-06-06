import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft} from 'lucide-react';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article, blogHandle: blog.handle};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article, blogHandle} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className="bg-canvas">
      <div className="container-narrow pt-9 pb-10 md:pt-14">
        <Link
          to={`/blogs/${blogHandle}`}
          prefetch="intent"
          className="type-caption inline-flex items-center gap-1 text-ink-subtle transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          Back to the journal
        </Link>
        <h1 className="type-display mt-6 text-balance text-ink">{title}</h1>
        <div className="type-caption mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-ink-subtle">
          <time dateTime={article.publishedAt}>{publishedDate}</time>
          {author?.name ? (
            <>
              <span aria-hidden>·</span>
              <address className="not-italic">{author.name}</address>
            </>
          ) : null}
        </div>
      </div>

      {image && (
        <div className="container-page">
          <div className="overflow-hidden rounded-[2px] border border-hairline bg-parchment">
            <Image
              data={image}
              sizes="(min-width: 1440px) 1392px, 100vw"
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="container-narrow section-y">
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="rich-text"
        />
      </div>
    </article>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
