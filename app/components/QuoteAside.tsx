import {useState} from 'react';
import {Link, useFetcher} from 'react-router';
import {CheckCircle2} from 'lucide-react';
import {Aside, useAside} from '~/components/Aside';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Textarea} from '~/components/ui/textarea';
import {Label} from '~/components/ui/label';
import {Checkbox} from '~/components/ui/checkbox';
import {SmsConsent} from '~/components/SmsConsent';
import type {HomeActionData} from '~/lib/home-forms';
import {CONTACT} from '~/lib/site';

/**
 * Global "Request a quote" slide-over. Opened via useAside().open('quote')
 * (see QuoteButton). Posts to the /api/quote resource route so it works from
 * any page. Mirrors the homepage quote form + the required SMS opt-in.
 *
 * Two modes. Opened bare, it is the project enquiry: tell us about the space.
 * Opened from a product page with a `quoteContext`, it becomes the install
 * request for that fixture — the item is stated at the top and travels with the
 * lead, the address of the job is asked for, and the free-text box and lighting
 * preferences stop being the point (installing a known fixture is not a design
 * brief). Sales should never receive one of these wondering what to quote.
 */
export function QuoteAside() {
  const {quoteContext} = useAside();
  const forProduct = Boolean(quoteContext);
  const fetcher = useFetcher<HomeActionData>();
  const data = fetcher.data;
  const errors = data?.ok === false ? data.errors : undefined;
  const submitting = fetcher.state !== 'idle';
  // Both consent boxes must be ticked before the form can be submitted.
  const [consent, setConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);

  return (
    <Aside
      type="quote"
      heading={forProduct ? 'Request an install quote' : 'Request a free quote'}
    >
      {data?.ok ? (
        <div className="flex h-full flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="size-12 text-primary" strokeWidth={1.75} />
          <h3 className="type-display-sm mt-5 text-ink">
            Thanks — request received
          </h3>
          <p className="type-body mt-3 max-w-sm text-ink-muted">
            We’ve got your details and will reach out shortly, usually within one
            business day, with your estimate.
          </p>
        </div>
      ) : (
        <fetcher.Form
          method="post"
          action="/api/quote"
          className="flex flex-col gap-5"
        >
          {quoteContext ? (
            <>
              <input type="hidden" name="productTitle" value={quoteContext.productTitle} />
              <input type="hidden" name="productVariant" value={quoteContext.variantTitle ?? ''} />
              <input type="hidden" name="productQuantity" value={String(quoteContext.quantity)} />
              <input type="hidden" name="productPath" value={quoteContext.path} />
              <div className="rounded-[2px] border border-hairline bg-parchment p-4">
                <p className="type-fine font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  Installing
                </p>
                <p className="type-body-strong mt-1.5 text-ink">
                  {quoteContext.productTitle}
                </p>
                <p className="type-caption mt-0.5 text-ink-muted">
                  {[quoteContext.variantTitle, `Qty ${quoteContext.quantity}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <p className="type-caption text-ink-muted">
                Install is priced per site, so we need to see the space. Send
                your details and we come back with a fixed price — usually
                within one business day.
              </p>
            </>
          ) : (
            <p className="type-caption text-ink-muted">
              Send the details and get a clear, no-obligation estimate — usually
              within one business day.
            </p>
          )}
          <QField id="qd-name" name="name" label="Full name" placeholder="Jane Smith" error={errors?.name} />
          <QField id="qd-email" name="email" type="email" label="Email" placeholder="jane@company.com" error={errors?.email} />
          <QField id="qd-phone" name="phone" type="tel" label="Phone (optional)" placeholder={CONTACT.phoneDisplay} error={errors?.phone} />
          {forProduct ? (
            <QField
              id="qd-address"
              name="address"
              label="Job site address"
              placeholder="Street, city, ZIP"
              error={errors?.address}
            />
          ) : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="qd-message" className="type-caption-strong text-ink">
              {forProduct ? (
                <>
                  Anything we should know{' '}
                  <span className="type-caption font-normal text-ink-muted">
                    (optional)
                  </span>
                </>
              ) : (
                'Project details'
              )}
            </Label>
            <Textarea
              id="qd-message"
              name="message"
              rows={4}
              placeholder={
                forProduct
                  ? 'Ceiling height, access, timeline…'
                  : 'Tell us about the space, scope, and timeline'
              }
              className="rounded-[2px] type-body"
              aria-invalid={Boolean(errors?.message)}
            />
            {errors?.message ? (
              <p className="type-caption text-destructive">{errors.message}</p>
            ) : null}
          </div>

          {/* Design wishes belong to a project enquiry. Someone asking us to
              install a fixture they already picked has made those choices. */}
          {forProduct ? null : <LightingPreferences />}

          <div className="flex items-start gap-3">
            <Checkbox
              id="qd-consent"
              name="consent"
              className="mt-1"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
            />
            <Label htmlFor="qd-consent" className="type-caption font-normal text-ink-muted">
              I agree to the{' '}
              <Link
                to="/privacy-policy"
                className="text-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          {errors?.consent ? (
            <p className="type-caption text-destructive">{errors.consent}</p>
          ) : null}

          <SmsConsent
            id="qd-sms"
            checked={smsConsent}
            onCheckedChange={setSmsConsent}
          />

          <Button
            type="submit"
            disabled={submitting || !consent || !smsConsent}
            className="mt-1 h-12 w-full type-body font-normal"
          >
            {submitting
              ? 'Sending…'
              : forProduct
                ? 'Request install quote'
                : 'Request a quote'}
          </Button>
        </fetcher.Form>
      )}
    </Aside>
  );
}

/**
 * Optional lighting-plan preferences. These are design wishes (not purchasable
 * Shopify variants), so they live on the quote request rather than the product
 * buy box. All optional; captured with the quote payload.
 */
const DIRECTIONS = ['Down', 'Up & Down'];
const DIMMING = ['0–10V', 'Non-dim'];
const SHAPES = ['Straight line', 'L-shape', 'Rectangle', 'Grid', 'Custom'];

function LightingPreferences() {
  return (
    <details className="rounded-[2px] border border-hairline">
      <summary className="type-caption-strong cursor-pointer select-none px-4 py-3 text-ink">
        Lighting preferences{' '}
        <span className="type-caption font-normal text-ink-muted">
          (optional)
        </span>
      </summary>
      <div className="flex flex-col gap-4 border-t border-hairline p-4">
        <div className="grid grid-cols-2 gap-4">
          <QSelect id="qd-direction" name="direction" label="Light direction" options={DIRECTIONS} />
          <QSelect id="qd-dimming" name="dimming" label="Dimming" options={DIMMING} />
        </div>
        <QSelect id="qd-shape" name="shape" label="Geometry" options={SHAPES} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="qd-run" className="type-caption-strong text-ink">
            Approx. run length (ft)
          </Label>
          <Input
            id="qd-run"
            name="runLength"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="e.g. 24"
            className="h-11 rounded-[2px] type-body"
          />
        </div>
      </div>
    </details>
  );
}

function QSelect({
  id,
  name,
  label,
  options,
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="type-caption-strong text-ink">
        {label}
      </Label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="h-11 rounded-[2px] border border-hairline bg-canvas px-3 type-body text-ink"
      >
        <option value="">No preference</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function QField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="type-caption-strong text-ink">
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="h-11 rounded-[2px] type-body"
      />
      {error ? <p className="type-caption text-destructive">{error}</p> : null}
    </div>
  );
}
