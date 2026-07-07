import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blog.$articleHandle';
import {ChevronLeft, Clock, Check, ArrowRight} from 'lucide-react';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {Reveal} from '~/components/Reveal';
import {seo, SITE_URL} from '~/lib/seo';
import {COMPANY_NAME} from '~/lib/site';
import bpHero from '~/assets/mp/bp-hero.jpg?url';
import bpLayers from '~/assets/mp/bp-layers.jpg?url';
import bpRetrofit from '~/assets/mp/bp-retrofit.jpg?url';
import bpTitle24 from '~/assets/mp/bp-title24.jpg?url';

/* ============================================================
   Article (blog post) — 1:1 port of the MagicPath "Blog Post".
   Renders a real Shopify article when it exists, otherwise the
   placeholder journal entries wired from the homepage cards.
   ============================================================ */

type Block =
  | {type: 'lead'; text: string}
  | {type: 'p'; text: string}
  | {type: 'h2'; text: string}
  | {type: 'quote'; text: string}
  | {type: 'kelvin'}
  | {type: 'checklist'; items: string[]}
  | {type: 'html'; html: string};

type NormArticle = {
  title: string;
  category: string;
  author: {name: string; bio: string};
  dateISO: string;
  readMins: number;
  hero: string | null;
  heroAlt: string;
  description: string;
  blocks: Block[];
};

// The Shopify blog these articles live in. URLs are flat (/blog/<handle>) —
// the blog handle is fixed here, not part of the path.
const BLOG_HANDLE = 'news';

/** Placeholder journal entries — shown until real Shopify articles exist. */
const PLACEHOLDERS: Record<string, NormArticle> = {
  'choosing-color-temperature': {
    title: 'Choosing color temperature for a workspace',
    category: 'Design',
    author: {
      name: 'Guy Hawkins',
      bio: `Lighting designer at ${COMPANY_NAME}. Writes about the practical side of getting light right in real rooms.`,
    },
    dateISO: '2026-06-24',
    readMins: 6,
    hero: bpHero,
    heroAlt: 'Color temperature in a workspace',
    description:
      'How warm or cool light changes focus, comfort, and how a room reads — and how to match color temperature to the task.',
    blocks: [
      {
        type: 'lead',
        text: 'Color temperature is the quiet decision that changes how a room feels before anyone notices the fixtures. Get it right and a space reads calm, alert, or warm exactly when it should. Get it wrong and even a well-lit room feels off.',
      },
      {type: 'h2', text: 'What color temperature actually is'},
      {
        type: 'p',
        text: 'Measured in kelvin (K), color temperature describes how warm or cool a white light appears. Lower numbers look warm and amber; higher numbers look crisp and blue-white. It has nothing to do with brightness — a 3000K and a 4000K fixture can put out the same lumens and feel like completely different rooms.',
      },
      {type: 'kelvin'},
      {type: 'h2', text: 'Match the temperature to the task'},
      {
        type: 'p',
        text: 'For focused work, a neutral 3500K keeps people alert without the clinical edge of cooler light. Retail floors often push to 4000K so merchandise reads sharp and true. Homes and restaurants live at 3000K, where skin tones stay flattering and the room feels like somewhere you want to linger.',
      },
      {
        type: 'quote',
        text: 'The best color temperature is the one nobody comments on. It just feels right for what you’re doing in the room.',
      },
      {type: 'h2', text: 'A short checklist before you spec'},
      {
        type: 'checklist',
        items: [
          'Keep one temperature per sightline — mixing 3000K and 4000K in the same view looks like a mistake.',
          'Mind the CRI. Aim for 90+ so colors stay accurate at any temperature.',
          'Consider tunable white where the use changes through the day.',
          'Sample on site. A chip on a screen never matches the room.',
        ],
      },
      {
        type: 'p',
        text: 'When we draw a lighting plan, color temperature is specified per space and confirmed with a sample before anything ships — so the room you picture is the room you get.',
      },
    ],
  },
  'led-retrofits-that-pay': {
    title: 'LED retrofits that pay for themselves',
    category: 'Energy',
    author: {
      name: 'Jane Cooper',
      bio: `Project lead at ${COMPANY_NAME}. Focuses on energy retrofits and commercial lighting upgrades across Los Angeles.`,
    },
    dateISO: '2026-06-10',
    readMins: 5,
    hero: bpRetrofit,
    heroAlt: 'LED retrofit in a commercial space',
    description:
      'Where the savings come from in a commercial LED retrofit, and how fast the upgrade returns its cost.',
    blocks: [
      {
        type: 'lead',
        text: 'A lighting retrofit is one of the few building upgrades that starts paying you back the month it’s installed. The trick is knowing where the savings actually come from — and where they don’t.',
      },
      {type: 'h2', text: 'Where the money is'},
      {
        type: 'p',
        text: 'Most of the return is wattage: swapping fluorescent or legacy HID for modern LED typically cuts lighting energy by 50–70%. The second, quieter saving is maintenance — LED drivers outlast old ballasts by years, so the ladder time and lamp replacements disappear from the budget.',
      },
      {
        type: 'p',
        text: 'Add controls — occupancy sensors and daylight dimming — and you stop paying to light empty rooms and sunlit perimeters. That’s often another 20–30% on top of the fixture swap.',
      },
      {type: 'h2', text: 'What makes the payback fast'},
      {
        type: 'checklist',
        items: [
          'High burn hours — the more a space is lit, the faster the return.',
          'Utility rebates that offset the up-front fixture cost.',
          'Title 24 controls you were going to need anyway.',
          'Fewer service calls once the old ballasts are gone.',
        ],
      },
      {
        type: 'p',
        text: 'We scope every retrofit against your actual run hours and rate, so the estimate you get shows real payback — not a brochure number.',
      },
    ],
  },
  'what-title-24-means': {
    title: 'What Title 24 means for your remodel',
    category: 'Code',
    author: {
      name: 'Devon Lane',
      bio: `Licensed C-10 lead at ${COMPANY_NAME}. Keeps projects compliant with California energy code from plan to inspection.`,
    },
    dateISO: '2026-05-28',
    readMins: 4,
    hero: bpTitle24,
    heroAlt: 'Reviewing lighting plans for code compliance',
    description:
      'A plain-language look at California’s Title 24 lighting rules and what they mean for a remodel.',
    blocks: [
      {
        type: 'lead',
        text: 'Title 24 is California’s energy code, and its lighting section decides which fixtures and controls your remodel is allowed to use. It sounds bureaucratic — in practice it’s a short list of requirements you can plan around.',
      },
      {type: 'h2', text: 'The parts that touch lighting'},
      {
        type: 'p',
        text: 'The code caps how much power your lighting can draw per square foot, and it requires controls: dimmers or occupancy sensors in most rooms, and daylight-responsive dimming near windows and skylights. Newer fixtures make this easy — LED and modern drivers are already efficient enough to clear the power limits comfortably.',
      },
      {type: 'h2', text: 'How to stay out of trouble'},
      {
        type: 'checklist',
        items: [
          'Spec high-efficacy (LED) sources from the start.',
          'Plan controls per room early — retrofitting them later costs more.',
          'Keep documentation for inspection; certificates of compliance matter.',
          'Work with a licensed contractor who signs off on the energy forms.',
        ],
      },
      {
        type: 'p',
        text: 'On our projects the compliance paperwork is handled as part of the job — you get a design that passes inspection without last-minute changes.',
      },
    ],
  },
};

/** Related cards (1:1 with the MagicPath design). */
const RELATED: Array<{img: string; cat: string; t: string; to: string}> = [
  {img: bpLayers, cat: 'Design', t: 'The three layers every room needs', to: '/blog'},
  {
    img: bpRetrofit,
    cat: 'Energy',
    t: 'LED retrofits that pay for themselves',
    to: '/blog/led-retrofits-that-pay',
  },
  {
    img: bpTitle24,
    cat: 'Code',
    t: 'What Title 24 means for your remodel',
    to: '/blog/what-title-24-means',
  },
];

export const meta: Route.MetaFunction = ({data, location}) => {
  const a = data?.article;
  const img = a?.hero
    ? a.hero.startsWith('http')
      ? a.hero
      : `${SITE_URL}${a.hero}`
    : undefined;
  return seo({
    title: `${a?.title ?? 'Journal'} | ${COMPANY_NAME}`,
    description: a?.description,
    url: location.pathname,
    type: 'article',
    image: img,
  });
};

function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {articleHandle} = params;

  if (!articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle: BLOG_HANDLE, articleHandle},
  });

  // Real Shopify article — render it in the same template.
  if (blog?.articleByHandle) {
    redirectIfHandleIsLocalized(request, {
      handle: articleHandle,
      data: blog.articleByHandle,
    });

    const a = blog.articleByHandle;
    const article: NormArticle = {
      title: a.title,
      category: a.tags?.[0] ?? 'Journal',
      author: {
        name: a.author?.name ?? 'LA Lighting Team',
        bio: `Writes about the practical side of getting light right in real rooms, for ${COMPANY_NAME}.`,
      },
      dateISO: a.publishedAt,
      readMins: readTime(a.contentHtml),
      hero: a.image?.url ?? null,
      heroAlt: a.image?.altText ?? a.title,
      description:
        a.seo?.description ?? `${a.title} — notes from ${COMPANY_NAME}.`,
      blocks: [{type: 'html', html: a.contentHtml}],
    };
    return {article};
  }

  // Placeholder journal entry (wired from the homepage cards).
  const placeholder = PLACEHOLDERS[articleHandle];
  if (placeholder) {
    return {article: placeholder};
  }

  throw new Response(null, {status: 404});
}

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

function blockKey(block: Block) {
  switch (block.type) {
    case 'kelvin':
      return 'kelvin';
    case 'checklist':
      return `checklist:${block.items[0]}`;
    case 'html':
      return 'html';
    default:
      return `${block.type}:${block.text.slice(0, 32)}`;
  }
}

function BlockView({block}: {block: Block}) {
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-[19px] leading-[1.6] text-ink">{block.text}</p>
      );
    case 'p':
      return <p>{block.text}</p>;
    case 'h2':
      return (
        <h2 className="mt-4 font-heading text-[24px] leading-tight tracking-[-0.01em] text-ink">
          {block.text}
        </h2>
      );
    case 'quote':
      return (
        <blockquote className="my-2 border-l-2 border-primary pl-5 text-[19px] leading-relaxed text-ink">
          “{block.text}”
        </blockquote>
      );
    case 'kelvin':
      return (
        <div className="my-2 grid gap-3 sm:grid-cols-3">
          {[
            {k: '3000K', l: 'Warm', d: 'Homes, hospitality, evening rooms'},
            {k: '3500K', l: 'Neutral', d: 'Offices, mixed-use, kitchens'},
            {k: '4000K', l: 'Cool', d: 'Retail, task work, galleries'},
          ].map((c) => (
            <div
              key={c.k}
              className="rounded-lg border border-hairline bg-parchment p-4"
            >
              <p className="font-heading text-[20px] text-ink">{c.k}</p>
              <p className="mt-0.5 text-[13px] font-medium text-ink">{c.l}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">
                {c.d}
              </p>
            </div>
          ))}
        </div>
      );
    case 'checklist':
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-1 size-5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'html':
      return (
        <div
          className="rich-text"
          dangerouslySetInnerHTML={{__html: block.html}}
        />
      );
    default:
      return null;
  }
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, hero, heroAlt, category, author, blocks, readMins} = article;
  const backTo = '/blog';

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(article.dateISO));

  return (
    <div className="bg-canvas font-body text-ink antialiased">
      <ProgressBar />

      {/* title block */}
      <div className="mx-auto max-w-[760px] px-5 pt-9 pb-8 sm:px-6 md:pt-14">
        <Link
          to={backTo}
          prefetch="intent"
          className="press inline-flex items-center gap-1 text-[13px] text-ink-subtle transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" /> Back to the journal
        </Link>
        <Reveal>
          <div className="mt-6 flex items-center gap-3 text-[12px] text-ink-subtle">
            <span className="rounded-sm bg-parchment px-2.5 py-1 font-medium text-ink">
              {category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {readMins} min read
            </span>
          </div>
          <h1 className="mt-5 font-heading text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[44px]">
            {title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-parchment text-[13px] font-semibold text-ink">
              {initials(author.name)}
            </span>
            <div className="leading-tight">
              <p className="text-[13.5px] font-medium text-ink">{author.name}</p>
              <time
                dateTime={article.dateISO}
                className="text-[12px] text-ink-subtle"
              >
                {publishedDate}
              </time>
            </div>
          </div>
        </Reveal>
      </div>

      {/* hero image */}
      {hero && (
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-lg border border-hairline">
              <img
                src={hero}
                alt={heroAlt}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      )}

      {/* body */}
      <article className="mx-auto max-w-[720px] px-5 py-14 sm:px-6">
        <div className="flex flex-col gap-6 text-[17px] leading-[1.7] text-ink/85">
          {blocks.map((block) => (
            <BlockView key={blockKey(block)} block={block} />
          ))}
        </div>

        {/* author card */}
        <div className="mt-12 flex items-start gap-4 rounded-lg border border-hairline bg-parchment p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-canvas text-[15px] font-semibold text-ink">
            {initials(author.name)}
          </span>
          <div>
            <p className="text-[14.5px] font-medium text-ink">{author.name}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              {author.bio}
            </p>
          </div>
        </div>
      </article>

      {/* CTA band */}
      <section className="bg-onyx text-white">
        <div className="mx-auto flex max-w-[820px] flex-col items-center px-5 py-16 text-center sm:px-8">
          <Reveal className="flex flex-col items-center">
            <h2 className="max-w-lg font-heading text-[28px] leading-tight tracking-[-0.02em] sm:text-[38px]">
              Not sure what to spec? We’ll draw it.
            </h2>
            <p className="mt-4 max-w-md text-[15px] text-white/70">
              Send us your space and get a free photometric plan — fixture list,
              spacing and color temperature, matched to how you’ll use the room.
            </p>
            <Link
              to="/lighting-calculator"
              prefetch="intent"
              className="press mt-7 inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-7 text-[14px] font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start my free lighting plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* related */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <h2 className="font-heading text-[24px] text-ink sm:text-[28px]">
          Keep reading
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {RELATED.map((r, i) => (
            <Reveal key={r.t} delay={i * 60}>
              <Link
                to={r.to}
                prefetch="intent"
                className="lift group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas"
              >
                <div className="img-zoom overflow-hidden" style={{aspectRatio: '11 / 6'}}>
                  <img src={r.img} alt={r.t} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="rounded-sm bg-parchment px-2 py-0.5 text-[11px] font-medium text-ink">
                    {r.cat}
                  </span>
                  <h3 className="mt-3 font-heading text-[17px] leading-snug text-ink group-hover:text-primary">
                    {r.t}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
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
