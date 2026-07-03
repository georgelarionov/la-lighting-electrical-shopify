import {Link} from 'react-router';
import {ArrowRight} from 'lucide-react';
import heroImg from '~/assets/hero.jpg?url';
import {Button} from '~/components/ui/button';
import {Reveal} from '~/components/Reveal';
import {useAside} from '~/components/Aside';

/**
 * Centered hero (Tesla redesign): eyebrow + headline + tagline + a primary
 * quote CTA and a ghost "See our work" link, then a full-bleed image below
 * (capped at the 1440 grid).
 */
export function Hero() {
  const {open} = useAside();
  return (
    <section className="bg-canvas">
      <div className="flex flex-col items-center gap-12 pt-14 md:gap-16 md:pt-20">
        <div className="container-page flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <p className="type-eyebrow text-ink-subtle">
              Los Angeles · Licensed C-10
            </p>
            <h1 className="type-hero mt-4 max-w-4xl text-balance text-ink">
              Spec-grade light, designed and installed in Los Angeles.
            </h1>
            <p className="type-lead mt-5 max-w-2xl font-medium text-ink-muted">
              Licensed electrical work and a catalog of architectural fixtures —
              designed, supplied, and installed by one team.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                onClick={() => open('quote')}
                className="h-9 px-7 text-[15px] font-medium"
              >
                Request a free quote
                <ArrowRight className="size-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 border-ink/25 px-6 text-[15px] font-medium hover:border-ink/50"
              >
                <Link to="/projects">See our work</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto w-full max-w-[1440px]">
          <div className="img-zoom overflow-hidden">
            <img
              src={heroImg}
              alt="Architectural lighting in a Los Angeles interior"
              width={2400}
              height={1029}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[12/5]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
