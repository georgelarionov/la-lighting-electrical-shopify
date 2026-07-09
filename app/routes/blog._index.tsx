import {useMemo, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Clock} from 'lucide-react';
import type {Route} from './+types/blog._index';
import {seo} from '~/lib/seo';
import {Reveal} from '~/components/Reveal';
import {COMPANY_NAME} from '~/lib/site';
import {cn} from '~/lib/utils';
import blog1 from '~/assets/blog-1.jpg?url';
import blog2 from '~/assets/blog-2.jpg?url';
import blog3 from '~/assets/blog-3.jpg?url';
import blog4 from '~/assets/blog-4.jpg?url';
import blog5 from '~/assets/blog-5.jpg?url';
import blog6 from '~/assets/blog-6.jpg?url';
import russAvatar from '~/assets/russ-avatar.jpg?url';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `Journal | ${COMPANY_NAME}`,
    description:
      'Practical notes on lighting, energy and code — from the team that designs and installs it across Los Angeles.',
    url: location.pathname,
  });
};

export async function loader({context}: Route.LoaderArgs) {
  const result = await context.storefront
    .query(JOURNAL_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
  return {articles: result?.articles?.nodes ?? []};
}

type Post = {
  img?: string;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  cat: string;
  title: string;
  excerpt: string;
  author: string;
  authorPhoto?: string;
  date: string;
  href: string;
  read: string;
};

const FALLBACK: Post[] = [
  {img: blog1, cat: 'Design', title: 'Choosing color temperature for a workspace', excerpt: 'How warm or cool light changes focus, comfort, and how a room reads — and where to land for an office, a shop, or a home.', author: 'Guy Hawkins', date: 'Jun 24, 2026', href: '/blog', read: '6 min'},
  {img: blog2, cat: 'Energy', title: 'LED retrofits that pay for themselves', excerpt: 'Where the savings come from, and how fast a commercial retrofit returns on a schedule you can show on paper.', author: 'Jane Cooper', date: 'Jun 12, 2026', href: '/blog', read: '5 min'},
  {img: blog3, cat: 'Code', title: 'What Title 24 means for your remodel', excerpt: 'A plain-language look at California’s lighting rules for remodels, and how to stay ahead of inspection.', author: 'Devon Lane', date: 'May 30, 2026', href: '/blog', read: '7 min'},
  {img: blog4, cat: 'Design', title: 'The three layers every room needs', excerpt: 'Ambient, accent, and detail — how layering light makes a space feel finished instead of merely bright.', author: 'Guy Hawkins', date: 'May 18, 2026', href: '/blog', read: '4 min'},
  {img: blog5, cat: 'How-to', title: 'Lighting controls, explained simply', excerpt: 'Dimmers, scenes, and sensors without the jargon — what actually earns its place on the wall.', author: 'Jane Cooper', date: 'Apr 29, 2026', href: '/blog', read: '5 min'},
  {img: blog6, cat: 'Commercial', title: 'Designing light for the open office', excerpt: 'Even, glare-free light that follows the daylight and keeps people comfortable at the desk all day.', author: 'Devon Lane', date: 'Apr 15, 2026', href: '/blog', read: '6 min'},
];

const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
// Same estimate as the article page (blog.$articleHandle) so the two match.
const readTime = (html: string) =>
  Math.max(
    1,
    Math.round(html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length / 200),
  );
const fmtDate = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(iso))
    : '';

export default function Journal() {
  const {articles} = useLoaderData<typeof loader>();

  const posts: Post[] = articles.length
    ? articles.map((a) => ({
        image: a.image,
        cat: a.tags?.[0] ?? 'Journal',
        title: a.title,
        excerpt: a.excerpt ?? '',
        author: a.author?.name ?? 'LA Lighting Team',
        authorPhoto:
          a.author?.name === 'Russ Oshkin' ? russAvatar : undefined,
        date: fmtDate(a.publishedAt),
        href: `/blog/${a.handle}`,
        read: `${readTime(a.contentHtml ?? '')} min`,
      }))
    : FALLBACK;

  const categories = useMemo(
    () => ['All', ...new Set(posts.map((p) => p.cat))],
    [posts],
  );
  const [tab, setTab] = useState('All');
  const filtered = tab === 'All' ? posts : posts.filter((p) => p.cat === tab);
  const [featured, ...rest] = filtered;

  return (
    <div className="bg-canvas">
      {/* header */}
      <header className="border-b border-hairline">
        <div className="container-page pt-12 pb-10 md:pt-16">
          <Reveal>
            <p className="type-eyebrow text-ink-subtle">Journal</p>
            <h1 className="type-hero mt-3 max-w-2xl text-ink">
              Notes on light, energy &amp; code.
            </h1>
            <p className="type-body mt-4 max-w-xl text-ink-muted">
              Practical writing on lighting, energy and getting a room to feel
              right — from the team that designs and installs it.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="container-page py-12">
        {categories.length > 2 && (
          <Reveal>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTab(cat)}
                  className={cn(
                    'press shrink-0 rounded-sm border px-4 py-2 type-caption font-medium transition-colors',
                    tab === cat
                      ? 'border-ink bg-ink text-white'
                      : 'border-hairline bg-canvas text-ink hover:border-ink/40',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* featured */}
        {featured && (
          <Reveal>
            <Link
              to={featured.href}
              prefetch="intent"
              className="lift group mt-8 grid overflow-hidden rounded-lg border border-hairline bg-canvas md:grid-cols-2"
            >
              <div
                className="img-zoom overflow-hidden md:order-2"
                style={{aspectRatio: '16 / 10'}}
              >
                <PostImage post={featured} eager className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 md:order-1 md:h-0 md:min-h-full md:overflow-hidden">
                <div className="flex items-center gap-3 type-fine text-ink-subtle">
                  <span className="rounded-sm bg-parchment px-2.5 py-1 font-medium text-ink">
                    {featured.cat}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" /> {featured.read} read
                  </span>
                </div>
                <h2 className="type-display-sm mt-4 line-clamp-2 text-ink transition-colors group-hover:text-primary">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="type-body mt-3 line-clamp-3 max-w-md text-ink-muted">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-2.5">
                  {featured.authorPhoto ? (
                    <img
                      src={featured.authorPhoto}
                      alt={featured.author}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid size-9 place-items-center rounded-full bg-parchment type-caption-strong text-ink">
                      {initials(featured.author)}
                    </span>
                  )}
                  <div className="leading-tight">
                    <p className="type-fine font-medium text-ink">
                      {featured.author}
                    </p>
                    <p className="type-fine text-ink-subtle">{featured.date}</p>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal as="article" key={p.title} delay={(i % 3) * 60}>
              <Link
                to={p.href}
                prefetch="intent"
                className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-canvas"
              >
                <div
                  className="img-zoom overflow-hidden"
                  style={{aspectRatio: '11 / 6'}}
                >
                  <PostImage post={p} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 type-fine text-ink-subtle">
                    <span className="rounded-sm bg-parchment px-2 py-0.5 font-medium text-ink">
                      {p.cat}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {p.read}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="type-caption mt-2.5 flex-1 text-ink-muted">
                      {p.excerpt}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-2.5">
                    {p.authorPhoto ? (
                      <img
                        src={p.authorPhoto}
                        alt={p.author}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-8 place-items-center rounded-full bg-parchment type-fine font-semibold text-ink">
                        {initials(p.author)}
                      </span>
                    )}
                    <div className="leading-tight">
                      <p className="type-fine font-medium text-ink">{p.author}</p>
                      <p className="type-fine text-ink-subtle">{p.date}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* newsletter band */}
      <section className="bg-parchment">
        <div className="container-page section-y text-center">
          <Reveal className="mx-auto flex max-w-xl flex-col items-center">
            <h2 className="type-display-sm text-ink">
              Get new posts in your inbox.
            </h2>
            <p className="type-body mt-3 max-w-md text-ink-muted">
              A short note when we publish — lighting, energy and code, no
              filler.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="field-input h-12"
              />
              <button className="press h-12 shrink-0 rounded-sm bg-primary px-7 type-caption-strong text-primary-foreground transition-colors hover:bg-primary/90">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function PostImage({
  post,
  className,
  eager,
}: {
  post: Post;
  className?: string;
  eager?: boolean;
}) {
  if (post.image) {
    return (
      <Image
        data={post.image}
        sizes="(min-width: 1024px) 400px, 100vw"
        loading={eager ? 'eager' : 'lazy'}
        className={className}
      />
    );
  }
  return (
    <img
      src={post.img}
      alt={post.title}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
    />
  );
}

const JOURNAL_QUERY = `#graphql
  query Journal($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    articles(first: 13, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        excerpt
        contentHtml
        publishedAt
        tags
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
    }
  }
` as const;
