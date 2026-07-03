import customImg from '~/assets/mp/twoup-config.jpg?url';
import tradeImg from '~/assets/mp/twoup-white.jpg?url';
import {ArrowLink} from '~/components/ArrowLink';

type Tile = {
  bg: string;
  title: string;
  text: string;
  linkLabel: string;
  to: string;
  img: string;
  alt: string;
};

const TILES: Tile[] = [
  {
    bg: 'bg-parchment',
    title: 'Custom fabrication',
    text: 'Shapes, lengths, and finishes built to your drawing.',
    linkLabel: 'Start a custom build',
    to: '/pages/custom',
    img: customImg,
    alt: 'Custom-fabricated linear light fixture',
  },
  {
    bg: 'bg-canvas',
    title: 'Trade & spec accounts',
    text: 'Pricing, lead times, and submittal packages for the trade.',
    linkLabel: 'Open an account',
    to: '/pages/trade',
    img: tradeImg,
    alt: 'Specification documents for a trade account',
  },
];

/**
 * Two half-width full-bleed tiles (Pencil "Two Up" oVcUY): each is a centered
 * title + one line + blue text link, then an inset image flush to the bottom.
 */
export function TwoUp() {
  return (
    <section className="grid md:grid-cols-2">
      {TILES.map((tile) => (
        <div
          key={tile.title}
          className={`flex flex-col items-center gap-8 px-10 pt-16 md:pt-20 ${tile.bg}`}
        >
          <div className="flex max-w-md flex-col items-center text-center">
            <h2 className="type-display-sm text-ink text-balance">
              {tile.title}
            </h2>
            <p className="type-body mt-3.5 max-w-sm text-ink-muted">
              {tile.text}
            </p>
            <ArrowLink to={tile.to} className="type-body mt-3.5">
              {tile.linkLabel}
            </ArrowLink>
          </div>
          <img
            src={tile.img}
            alt={tile.alt}
            width={1400}
            height={656}
            loading="lazy"
            className="aspect-[32/15] w-full border-t border-hairline object-cover"
          />
        </div>
      ))}
    </section>
  );
}
