import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {PlaceholderImage} from '~/components/sections/PlaceholderImage';
import {ArrowLink} from '~/components/ArrowLink';
import blog1 from '~/assets/blog-1.jpg?url';
import blog2 from '~/assets/blog-2.jpg?url';
import blog3 from '~/assets/blog-3.jpg?url';

export type HomeArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt?: string | null;
  contentExcerpt?: string | null;
  image?: {
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  author?: {name: string} | null;
  blog: {handle: string};
};

/** Fallback posts (with self-hosted imagery) shown until real articles exist. */
const FALLBACK: Array<HomeArticle & {img: string}> = [
  {
    id: 'fb1',
    title: 'Choosing color temperature for a workspace',
    handle: '#',
    excerpt:
      'How warm or cool light changes focus, comfort, and how a room reads.',
    author: {name: 'Guy Hawkins'},
    blog: {handle: 'news'},
    img: blog1,
  },
  {
    id: 'fb2',
    title: 'LED retrofits that pay for themselves',
    handle: '#',
    excerpt:
      'Where the savings come from, and how fast a commercial retrofit returns.',
    author: {name: 'Jane Cooper'},
    blog: {handle: 'news'},
    img: blog2,
  },
  {
    id: 'fb3',
    title: 'What Title 24 means for your remodel',
    handle: '#',
    excerpt: 'A plain-language look at California’s lighting rules for remodels.',
    author: {name: 'Devon Lane'},
    blog: {handle: 'news'},
    img: blog3,
  },
];

export function BlogPosts({articles}: {articles: HomeArticle[]}) {
  const isReal = articles.length > 0;
  const posts: Array<HomeArticle & {img?: string}> = isReal
    ? articles.slice(0, 3)
    : FALLBACK;

  return (
    <section className="bg-canvas">
      <div className="container-page pt-16 pb-13 md:pt-20 lg:pt-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="type-display text-ink text-balance">
              From the journal
            </h2>
            <p className="type-body mt-2.5 text-ink-muted">
              Notes on lighting, energy, and getting a room to feel right.
            </p>
          </div>
          <ArrowLink to="/blogs" className="type-body shrink-0">
            Read the blog
          </ArrowLink>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <ArticleCard
              key={post.id}
              post={post}
              isReal={isReal}
              eager={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  post,
  isReal,
  eager,
}: {
  post: HomeArticle & {img?: string};
  isReal: boolean;
  eager: boolean;
}) {
  const href = isReal ? `/blogs/${post.blog.handle}/${post.handle}` : '/blogs';
  const excerpt = post.excerpt || post.contentExcerpt || '';
  const initials = (post.author?.name ?? 'LA')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article className="lift img-zoom group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas">
      <Link to={href} prefetch="intent" tabIndex={-1} aria-hidden>
        {post.image ? (
          <Image
            data={post.image}
            aspectRatio="11/6"
            sizes="(min-width: 1024px) 384px, 100vw"
            loading={eager ? 'eager' : 'lazy'}
            className="aspect-[11/6] w-full object-cover"
          />
        ) : post.img ? (
          <img
            src={post.img}
            alt={post.title}
            width={1200}
            height={655}
            loading={eager ? 'eager' : 'lazy'}
            className="aspect-[11/6] w-full object-cover"
          />
        ) : (
          <PlaceholderImage aspect="aspect-[11/6]" className="rounded-none" label="Article" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight text-ink">
          <Link
            to={href}
            prefetch="intent"
            className="transition-colors group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="type-caption mt-3.5 text-ink-muted">{excerpt}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-2.5 pt-5">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-parchment type-caption-strong text-ink">
            {initials}
          </span>
          <div className="leading-tight">
            <p className="type-caption-strong text-ink">
              {post.author?.name ?? 'LA Lighting Team'}
            </p>
            <p className="type-fine text-ink-subtle">Author</p>
          </div>
        </div>
      </div>
    </article>
  );
}
