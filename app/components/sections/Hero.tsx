import heroImg from '~/assets/hero.jpg?url';
import {ArrowLink} from '~/components/ArrowLink';

/**
 * Centered Apple-style hero (Pencil "Hero" T3jqOv): headline + tagline + two
 * blue text links, then a full-bleed image below.
 */
export function Hero() {
  return (
    <section className="bg-canvas">
      <div className="flex flex-col items-center gap-13 pt-16 md:pt-20">
        <div className="container-page flex flex-col items-center text-center">
          <h1 className="type-hero max-w-[15ch] text-ink text-balance">
            Light is the detail people remember.
          </h1>
          <p className="type-lead mt-5 max-w-[40ch] text-ink-muted">
            Spec-grade architectural lighting and licensed electrical work,
            designed and installed in Los Angeles.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <ArrowLink to="/collections" className="type-body">
              Explore the catalog
            </ArrowLink>
            <ArrowLink to="/#quote" className="type-body">
              Request a quote
            </ArrowLink>
          </div>
        </div>

        <img
          src={heroImg}
          alt="Architectural lighting in a Los Angeles interior"
          width={2400}
          height={1029}
          className="aspect-[21/9] w-full object-cover"
        />
      </div>
    </section>
  );
}
