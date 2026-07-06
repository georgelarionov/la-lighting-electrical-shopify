import {useRef} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import resort1 from '~/assets/resort-1.jpg?url';
import resort2 from '~/assets/resort-2.jpg?url';
import resort3 from '~/assets/resort-3.jpg?url';
import resort4 from '~/assets/resort-4.jpg?url';
import resort5 from '~/assets/resort-5.jpg?url';
import resort6 from '~/assets/resort-6.jpg?url';
import {cn} from '~/lib/utils';

type GalleryImage = {src: string; alt: string};

// Per-project photo galleries. Self-hosted assets (same-origin — no CSP
// change). Each image links to the full-size file, opened in a new tab.
const GALLERIES: Record<string, GalleryImage[]> = {
  'the-resort-playa-vista': [
    {src: resort1, alt: 'Cardio floor lit by continuous linear pendant runs'},
    {src: resort2, alt: 'Covered terrace under architectural linear lighting'},
    {src: resort3, alt: 'Feature staircase beneath twin linear light runs'},
    {src: resort4, alt: 'Treadmill hall with seamless linear light overhead'},
    {src: resort5, alt: 'Lobby with living wall and linear lighting'},
    {src: resort6, alt: 'Glass breezeway with linear pendant runs'},
  ],
};

/**
 * Horizontal photo carousel for a project. Native CSS scroll-snap (no JS
 * library) with optional prev/next buttons; each photo opens full-size in a
 * new tab. Renders nothing for projects without a gallery.
 */
export function ProjectGallery({handle}: {handle: string}) {
  const images = GALLERIES[handle];
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!images?.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.8, 640);
    el.scrollBy({left: amount * dir, behavior: 'smooth'});
  };

  return (
    <section className="container-page mt-12 md:mt-16">
      <div className="flex items-end justify-between gap-6">
        <h2 className="type-display-sm text-ink">Project gallery</h2>
        <div className="hidden items-center gap-2 sm:flex">
          <GalleryButton label="Previous" onClick={() => scrollBy(-1)}>
            <ArrowLeft className="size-5" />
          </GalleryButton>
          <GalleryButton label="Next" onClick={() => scrollBy(1)}>
            <ArrowRight className="size-5" />
          </GalleryButton>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <a
            key={img.src}
            href={img.src}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[520px]"
          >
            <div className="overflow-hidden rounded-lg border border-hairline bg-parchment">
              <img
                src={img.src}
                alt={img.alt}
                width={1600}
                height={900}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function GalleryButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full border border-hairline bg-canvas text-ink',
        'transition-colors hover:border-ink hover:bg-ink hover:text-white active:scale-95',
      )}
    >
      {children}
    </button>
  );
}
