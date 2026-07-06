import {useState} from 'react';
import {Play} from 'lucide-react';
import {ProjectPhoto} from '~/components/ProjectPhoto';
import type {ProjectImage} from '~/lib/projects';

/**
 * Project hero media. With a `youtubeId`, shows the project photo with a play
 * button (click-to-play facade — no YouTube requests until the user clicks),
 * then swaps to an embedded privacy-friendly (nocookie) player. Without one,
 * it renders just the photo. The nocookie host is allowlisted in the CSP
 * frame-src (see app/entry.server.tsx).
 */
export function ProjectVideo({
  image,
  youtubeId,
  alt,
}: {
  image: ProjectImage;
  youtubeId?: string;
  alt: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (youtubeId && playing) {
    return (
      <div className="relative aspect-video w-full bg-ink-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={alt}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  const photo = (
    <ProjectPhoto
      image={image}
      alt={alt}
      eager
      className="aspect-[16/9] w-full md:aspect-[2/1]"
    />
  );

  if (!youtubeId) return photo;

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${alt}`}
      className="group/vid relative block w-full"
    >
      {photo}
      <span className="absolute inset-0 grid place-items-center bg-ink-black/20 transition-colors group-hover/vid:bg-ink-black/30">
        <span className="grid size-16 place-items-center rounded-full bg-white/95 text-ink shadow-product transition-transform duration-300 group-hover/vid:scale-105 sm:size-20">
          <Play className="size-6 translate-x-0.5 fill-current sm:size-7" />
        </span>
      </span>
    </button>
  );
}
