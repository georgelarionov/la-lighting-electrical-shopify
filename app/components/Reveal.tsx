import {useEffect, useRef, useState} from 'react';
import {cn} from '~/lib/utils';

/**
 * Scroll-reveal wrapper used across the redesigned pages. Fades + lifts its
 * children in once they enter the viewport (IntersectionObserver, once). The
 * motion itself lives in `.reveal` / `.reveal.in` in tailwind.css and is
 * disabled under `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      {threshold: 0.1, rootMargin: '0px 0px -40px 0px'},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', shown && 'in', className)}
      style={{transitionDelay: delay ? `${delay}ms` : undefined}}
    >
      {children}
    </Tag>
  );
}
