import {TRUST_ITEMS} from '~/lib/site';

/** Slim credential band under the hero — quiet, conversion-supporting trust. */
export function TrustStrip() {
  return (
    <section className="border-y border-hairline bg-parchment">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 md:justify-between">
        {TRUST_ITEMS.map((item) => (
          <span key={item} className="type-caption font-medium text-ink-muted">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
