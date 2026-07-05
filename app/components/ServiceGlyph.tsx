import {
  PencilRuler,
  ClipboardCheck,
  PlugZap,
  SlidersHorizontal,
  Leaf,
  Wrench,
  Rows3,
  type LucideIcon,
} from 'lucide-react';
import type {ServiceIcon} from '~/lib/services';
import {cn} from '~/lib/utils';

const ICONS: Record<ServiceIcon, LucideIcon> = {
  design: PencilRuler,
  compliance: ClipboardCheck,
  install: PlugZap,
  controls: SlidersHorizontal,
  retrofit: Leaf,
  maintenance: Wrench,
  linear: Rows3,
};

/** Resolves a service's `icon` key to its lucide glyph, in a brand tile. */
export function ServiceGlyph({
  icon,
  className,
}: {
  icon: ServiceIcon;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <span
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-[2px] bg-parchment text-primary',
        className,
      )}
    >
      <Icon className="size-5.5" strokeWidth={1.6} />
    </span>
  );
}
