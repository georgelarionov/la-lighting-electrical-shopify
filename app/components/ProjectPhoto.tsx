import project1 from '~/assets/project-1.jpg?url';
import project2 from '~/assets/project-2.jpg?url';
import project3 from '~/assets/project-3.jpg?url';
import project4 from '~/assets/project-4.jpg?url';
import project5 from '~/assets/project-5.jpg?url';
import project6 from '~/assets/project-6.jpg?url';
import project7 from '~/assets/project-7.jpg?url';
import type {ProjectImage} from '~/lib/projects';
import {cn} from '~/lib/utils';

const SOURCES: Record<ProjectImage, string> = {
  '1': project1,
  '2': project2,
  '3': project3,
  '4': project4,
  '5': project5,
  '6': project6,
  '7': project7,
};

/** Resolves a project's `image` key to its self-hosted asset (plain <img>,
 * same-origin — no CSP change needed). */
export function ProjectPhoto({
  image,
  alt,
  className,
  eager = false,
}: {
  image: ProjectImage;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={SOURCES[image]}
      alt={alt}
      width={1200}
      height={720}
      loading={eager ? 'eager' : 'lazy'}
      className={cn('object-cover', className)}
    />
  );
}
