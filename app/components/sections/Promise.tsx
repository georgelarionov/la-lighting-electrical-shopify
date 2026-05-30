import {PROMISE_ITEMS} from '~/lib/site';

/** "Why specifiers work with us" — a ruled value-prop list (conversion). */
export function PromiseSection() {
  return (
    <section className="bg-canvas">
      <div className="container-page section-y grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-20">
        <div>
          <h2 className="type-display-sm text-ink text-balance">
            Why specifiers work with us
          </h2>
          <p className="type-body mt-4 max-w-xs text-ink-muted">
            Four reasons our fixtures and crews keep getting specified.
          </p>
        </div>

        <dl className="border-t border-hairline">
          {PROMISE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 border-b border-hairline py-7 md:flex-row md:gap-8"
            >
              <dt className="type-body-strong text-ink md:w-64 md:shrink-0">
                {item.title}
              </dt>
              <dd className="type-body text-ink-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
