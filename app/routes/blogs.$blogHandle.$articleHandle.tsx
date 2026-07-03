import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft, Clock, ArrowRight} from 'lucide-react';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Reveal} from '~/components/Reveal';
import {Button} from '~/components/ui/button';
import {COMPANY_NAME} from '~/lib/site';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.article.title ?? 'Journal'} | ${COMPANY_NAME}`}];
};

/** Thin top reading-progress bar driven by scroll position. */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-150"
        style={{width: `${pct}%`}}
      />
    </div>
  );
}

const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

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
  const authorName = author?.name ?? 'LA Lighting Team';
  const category = article.tags?.[0] ?? 'Journal';

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <article className="bg-canvas">
      <ProgressBar />

      {/* title block */}
      <div className="container-narrow pt-9 pb-8 md:pt-14">
        <Link
          to={`/blogs/${blogHandle}`}
          prefetch="intent"
          className="type-caption inline-flex items-center gap-1 text-ink-subtle transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          Back to the journal
        </Link>
        <Reveal>
          <div className="mt-6 flex items-center gap-3 type-caption text-ink-subtle">
            <span className="rounded-sm bg-parchment px-2.5 py-1 font-medium text-ink">
              {category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {readTime(contentHtml)}
            </span>
          </div>
          <h1 className="type-display mt-5 text-balance text-ink">{title}</h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-parchment type-caption-strong text-ink">
              {initials(authorName)}
            </span>
            <div className="leading-tight">
              <p className="type-caption-strong text-ink">{authorName}</p>
              <time
                dateTime={article.publishedAt}
                className="type-fine text-ink-subtle"
              >
                {publishedDate}
              </time>
            </div>
          </div>
        </Reveal>
      </div>

      {image && (
        <div className="container-page">
          <div className="overflow-hidden rounded-lg border border-hairline bg-parchment">
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

        {/* author card */}
        <div className="mt-12 flex items-start gap-4 rounded-lg border border-hairline bg-parchment p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-canvas type-body-strong text-ink">
            {initials(authorName)}
          </span>
          <div>
            <p className="type-caption-strong text-ink">{authorName}</p>
            <p className="type-caption mt-1 text-ink-muted">
              Writes about the practical side of getting light right in real
              rooms, for {COMPANY_NAME}.
            </p>
          </div>
        </div>
      </div>

      {/* CTA band */}
      <section className="dark bg-onyx text-white">
        <div className="container-narrow py-16 text-center">
          <Reveal className="mx-auto flex max-w-xl flex-col items-center">
            <h2 className="type-display-sm text-white">
              Not sure what to spec? We’ll draw it.
            </h2>
            <p className="type-body mt-4 max-w-md text-white/70">
              Send us your space and get a free photometric plan — fixture list,
              spacing and color temperature, matched to how you’ll use the room.
            </p>
            <Button asChild className="mt-7 h-12 px-7 text-[15px] font-medium">
              <Link to="/lighting-calculator">
                Start my free lighting plan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
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
        tags
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
