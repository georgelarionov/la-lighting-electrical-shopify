import {Form, Link, useActionData, useNavigation} from 'react-router';
import {CheckCircle2} from 'lucide-react';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Textarea} from '~/components/ui/textarea';
import {Label} from '~/components/ui/label';
import {Checkbox} from '~/components/ui/checkbox';
import {SmsConsent} from '~/components/SmsConsent';
import type {HomeActionData} from '~/lib/home-forms';
import {CONTACT} from '~/lib/site';

export function QuoteCta() {
  const actionData = useActionData() as HomeActionData | undefined;
  const navigation = useNavigation();
  const quote = actionData?.intent === 'quote' ? actionData : undefined;
  const submitting =
    navigation.state !== 'idle' &&
    navigation.formData?.get('intent') === 'quote';

  return (
    <section id="quote" className="scroll-mt-24 dark bg-tile-1 text-white">
      <div className="container-page section-y grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <div className="flex flex-col justify-center">
          <h2 className="type-display text-balance">
            Tell us about your space.
          </h2>
          <p className="type-lead mt-5 max-w-md text-body-muted">
            Send the details and get a clear, no-obligation estimate, usually
            within one business day.
          </p>
          <dl className="mt-10 space-y-3 type-body text-body-muted">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-white/50">Call</dt>
              <dd>
                <a href={CONTACT.phoneHref} className="text-sky hover:underline">
                  {CONTACT.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-white/50">Email</dt>
              <dd>
                <a
                  href={`mailto:${CONTACT.emailSales}`}
                  className="text-sky hover:underline"
                >
                  {CONTACT.emailSales}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Form card */}
        <div className="rounded-[2px] bg-canvas p-6 text-ink sm:p-8">
          {quote?.ok ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-12 text-brand-green" strokeWidth={1.75} />
              <h3 className="type-display-sm mt-5 text-ink">Thanks — request received</h3>
              <p className="type-body mt-3 max-w-sm text-ink-muted">
                We’ve got your details and will reach out shortly with your
                estimate.
              </p>
            </div>
          ) : (
            <Form method="post" className="flex flex-col gap-5" replace>
              <input type="hidden" name="intent" value="quote" />
              <Field
                id="q-name"
                name="name"
                label="Full name"
                placeholder="Jane Smith"
                error={quote?.errors?.name}
              />
              <Field
                id="q-email"
                name="email"
                type="email"
                label="Email"
                placeholder="jane@company.com"
                error={quote?.errors?.email}
              />
              <Field
                id="q-phone"
                name="phone"
                type="tel"
                label="Phone (optional)"
                placeholder={CONTACT.phoneDisplay}
                error={quote?.errors?.phone}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="q-message" className="type-caption-strong text-ink">
                  Project details
                </Label>
                <Textarea
                  id="q-message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about the space, scope, and timeline"
                  className="rounded-[2px] type-body"
                  aria-invalid={Boolean(quote?.errors?.message)}
                />
                {quote?.errors?.message ? (
                  <ErrorText>{quote.errors.message}</ErrorText>
                ) : null}
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="q-consent" name="consent" className="mt-1" />
                <Label htmlFor="q-consent" className="type-caption font-normal text-ink-muted">
                  I agree to the{' '}
                  <Link to="/privacy-policy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
              {quote?.errors?.consent ? (
                <ErrorText>{quote.errors.consent}</ErrorText>
              ) : null}

              <SmsConsent id="q-sms" />

              <Button
                type="submit"
                disabled={submitting}
                className="mt-1 h-12 w-full type-body font-normal"
              >
                {submitting ? 'Sending…' : 'Request a quote'}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
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
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({children}: {children: React.ReactNode}) {
  return <p className="type-caption text-destructive">{children}</p>;
}
