import {ImageIcon} from 'lucide-react';
import {cn} from '~/lib/utils';

type Tone = 'parchment' | 'dark' | 'blue';

const TONES: Record<Tone, string> = {
  parchment: 'bg-parchment text-ink-subtle',
  dark: 'bg-tile-1 text-white/40',
  blue: 'bg-gradient-to-br from-primary to-[#1d3a8a] text-white/60',
};

/**
 * Dependency-free, network-free image placeholder used wherever real
 * photography is not yet supplied (hero, services, projects). Stays on-brand
 * (parchment / dark tile / blue) and never lifts proprietary assets.
 */
export function PlaceholderImage({
  tone = 'parchment',
  label,
  className,
  aspect = 'aspect-[4/3]',
}: {
  tone?: Tone;
  label?: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label ?? 'Placeholder image'}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-[2px]',
        aspect,
        TONES[tone],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <ImageIcon className="size-8" strokeWidth={1.5} />
        {label ? (
          <span className="type-fine font-medium uppercase tracking-wide">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
