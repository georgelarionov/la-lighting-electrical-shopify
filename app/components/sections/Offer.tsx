import {useFetcher} from 'react-router';
import {CheckCircle2} from 'lucide-react';
import {Button} from '~/components/ui/button';
import type {SubscribeResult} from '~/lib/home-forms';

/** Dark referral offer — secondary conversion, with soft glowing-orb accents. */
export function Offer() {
  const fetcher = useFetcher<SubscribeResult>();
  const data = fetcher.data;
  const shared = data?.ok && data.intent === 'referral';
  const submitting = fetcher.state !== 'idle';

  return (
    <section className="dark relative overflow-hidden bg-tile-deep text-white">
      {/* Glowing orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-12 size-44 rounded-full bg-[#ffd9a0] opacity-30 blur-3xl" />
        <div className="absolute right-[10%] top-1/3 size-56 rounded-full bg-[#ffcf94] opacity-25 blur-3xl" />
        <div className="absolute right-[26%] top-8 size-28 rounded-full bg-[#8fb8ff] opacity-25 blur-3xl" />
      </div>

      <div className="container-page section-y relative flex flex-col items-center text-center">
        <h2 className="type-display max-w-2xl text-balance">
          Refer a project, earn $250.
        </h2>
        <p className="type-lead mt-5 max-w-xl text-body-muted">
          Give a colleague 10% off their first order over $500, and earn $250 in
          credit for every project that books.
        </p>

        {shared ? (
          <div className="mt-8 flex items-center gap-3 type-body text-white">
            <CheckCircle2 className="size-6 text-brand-green" strokeWidth={1.75} />
            Sent — thanks for sharing.
          </div>
        ) : (
          <fetcher.Form
            method="post"
            action="/api/subscribe"
            className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="intent" value="referral" />
            <label htmlFor="referral-email" className="sr-only">
              Colleague’s email
            </label>
            <input
              id="referral-email"
              name="email"
              type="email"
              placeholder="Enter a colleague’s email"
              className="h-12 w-full rounded-[2px] border border-white/20 bg-white/10 px-4 type-body text-white outline-none placeholder:text-white/50 focus-visible:border-white/50"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 shrink-0 px-7 type-body font-normal"
            >
              {submitting ? 'Sending…' : 'Share the offer'}
            </Button>
          </fetcher.Form>
        )}
        {data && !data.ok && data.error ? (
          <p className="mt-3 type-caption text-[#ff8a8a]">{data.error}</p>
        ) : null}
      </div>
    </section>
  );
}
