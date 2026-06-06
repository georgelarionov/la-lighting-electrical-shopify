import heroImg from '~/assets/hero.jpg?url';
import {ArrowLink} from '~/components/ArrowLink';

/**
 * Centered Apple-style hero (Pencil "Hero" T3jqOv): headline + tagline + two
 * blue text links, then a full-bleed image below (capped at the 1440 grid).
 */
export function Hero() {
  return (
    <section className="bg-canvas">
      <div className="flex flex-col items-center gap-10 pt-12 md:gap-13 md:pt-16">
        <div className="container-page flex flex-col items-center text-center">
          <h1 className="type-display max-w-4xl text-balance text-ink">
            Spec-grade light, designed and installed in Los Angeles.
          </h1>
          <p className="type-lead mt-4 max-w-2xl font-medium text-ink-muted md:mt-5">
            Licensed electrical work and a catalog of architectural fixtures —
            designed, supplied, and installed by one team.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:mt-7">
            <ArrowLink to="/#services" className="type-body">
              Our Services
            </ArrowLink>
            <ArrowLink to="/#projects" className="type-body">
              Our Work
            </ArrowLink>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1440px]">
          <img
            src={heroImg}
            alt="Architectural lighting in a Los Angeles interior"
            width={2400}
            height={1029}
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[12/5]"
          />
        </div>
      </div>
    </section>
  );
}
