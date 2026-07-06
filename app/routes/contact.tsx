import {useState} from 'react';
import {Form, Link, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/contact';
import {seo} from '~/lib/seo';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import showroom from '~/assets/contact-showroom.jpg?url';
import {Reveal} from '~/components/Reveal';
import {Button} from '~/components/ui/button';
import {SmsConsent} from '~/components/SmsConsent';
import {COMPANY_NAME, CONTACT} from '~/lib/site';
import {
  validateQuote,
  describeQuoteLead,
  type QuoteErrors,
} from '~/lib/home-forms';
import {createZohoLead} from '~/lib/zoho';

export const meta: Route.MetaFunction = ({location}) => {
  return seo({
    title: `Contact | ${COMPANY_NAME}`,
    description:
      'Tell us what you’re lighting and we’ll come back with a free plan and a clear, no-obligation estimate — usually within one business day.',
    url: location.pathname,
  });
};

type ContactActionData = {ok: boolean; errors?: QuoteErrors};

export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<ContactActionData> {
  const formData = await request.formData();
  const {ok, errors, values} = validateQuote(formData);
  if (ok) {
    await createZohoLead(context.env, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      source: 'Website — contact page',
      description: describeQuoteLead(values, {
        smsConsent: formData.get('smsConsent') === 'yes',
        projectType: String(formData.get('type') ?? '').trim() || undefined,
      }),
    });
  }
  return {ok, errors};
}

const METHODS = [
  {
    icon: Phone,
    t: 'Call us',
    d: 'Mon – Fri, 8AM – 6PM PT.',
    link: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
  },
  {
    icon: Mail,
    t: 'Chat to sales',
    d: 'Project quotes, bulk orders, trade pricing.',
    link: CONTACT.emailSales,
    href: `mailto:${CONTACT.emailSales}`,
  },
  {
    icon: Mail,
    t: 'Customer service',
    d: 'Questions about an order, product or spec.',
    link: CONTACT.emailSupport,
    href: `mailto:${CONTACT.emailSupport}`,
  },
  {
    icon: MapPin,
    t: 'Visit the showroom',
    d: 'Showroom & warehouse, by appointment.',
    link: 'Marina Del Rey, CA 90292',
    href: '#map',
  },
];

const FAQ = [
  {
    q: 'How fast will I hear back?',
    a: 'We reply to most enquiries within one business day — often the same day if you reach us before mid-afternoon.',
  },
  {
    q: 'Do you install, or just ship fixtures?',
    a: 'Both. Our licensed C-10 crew installs across LA County, or we ship anywhere in the US for self-install.',
  },
  {
    q: 'Is the quote really free?',
    a: 'Yes. Send a floor plan or a few photos and you get a free photometric plan and a fixed, no-obligation quote.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We design and supply nationwide, and install throughout Los Angeles County and the surrounding areas.',
  },
];

const PROJECT_TYPES = [
  'Residential',
  'Retail',
  'Hospitality / HoReCa',
  'Office / Commercial',
  'Other',
];

export default function Contact() {
  return (
    <div className="bg-canvas">
      {/* header */}
      <header className="border-b border-hairline">
        <div className="container-page pt-12 pb-10 md:pt-16">
          <Reveal>
            <p className="type-eyebrow text-ink-subtle">Contact</p>
            <h1 className="type-hero mt-3 max-w-2xl text-ink">
              Let’s talk about your space.
            </h1>
            <p className="type-body mt-4 max-w-xl text-ink-muted">
              Tell us what you’re lighting and we’ll come back with a free plan
              and a clear, no-obligation estimate — usually within one business
              day.
            </p>
          </Reveal>
        </div>
      </header>

      {/* form + sidebar */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={80}>
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border border-hairline bg-parchment p-6">
                <h2 className="type-body-strong text-ink">Reach us directly</h2>
                <div className="mt-4 flex flex-col divide-y divide-hairline">
                  <a
                    href={CONTACT.phoneHref}
                    className="group flex items-center gap-3 py-3"
                  >
                    <Phone className="size-4 text-ink-subtle" />
                    <span className="type-caption-strong text-ink group-hover:text-primary">
                      {CONTACT.phoneDisplay}
                    </span>
                  </a>
                  <a
                    href={`mailto:${CONTACT.emailSales}`}
                    className="group flex items-center gap-3 py-3"
                  >
                    <Mail className="size-4 text-ink-subtle" />
                    <span className="type-caption truncate text-ink-muted group-hover:text-primary">
                      {CONTACT.emailSales}
                    </span>
                  </a>
                  <div className="flex items-start gap-3 py-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
                    <span className="type-caption text-ink-muted">
                      {CONTACT.addressLine1}
                      <br />
                      {CONTACT.addressLine2}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 py-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
                    <span className="type-caption text-ink-muted">
                      {CONTACT.hoursDisplay} PT
                      <br />
                      Weekends by appointment
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-onyx p-6 text-white">
                <p className="type-caption-strong">{CONTACT.licenseLine}</p>
                <p className="type-caption mt-1.5 text-white/60">
                  Fully licensed and insured. Every project documented for Title
                  24 and inspection.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* method cards */}
      <section className="bg-parchment">
        <div className="container-page section-y">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {METHODS.map((m, i) => (
              <Reveal key={m.t} delay={(i % 4) * 60}>
                <a
                  href={m.href}
                  className="lift group flex h-full flex-col rounded-lg border border-hairline bg-canvas p-6"
                >
                  <span className="grid size-11 place-items-center rounded-sm border border-hairline bg-parchment">
                    <m.icon className="size-5 text-ink" strokeWidth={1.6} />
                  </span>
                  <h3 className="type-body-strong mt-4 text-ink">{m.t}</h3>
                  <p className="type-caption mt-1.5 flex-1 text-ink-muted">
                    {m.d}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 type-fine font-medium text-ink group-hover:text-primary">
                    {m.link}
                    <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* map / showroom */}
      <section id="map" className="relative isolate overflow-hidden scroll-mt-20">
        <img
          src={showroom}
          alt="Our Marina Del Rey showroom"
          className="h-[52vh] min-h-[380px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 to-transparent sm:bg-gradient-to-r sm:from-onyx/70 sm:to-transparent" />
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="container-page w-full pb-8 sm:pb-0">
            <div className="max-w-sm rounded-lg bg-canvas p-7 shadow-product">
              <p className="type-eyebrow text-ink-subtle">Visit us</p>
              <h2 className="type-display-sm mt-2 text-ink">
                Marina Del Rey showroom
              </h2>
              <div className="mt-4 flex flex-col gap-2 type-caption text-ink-muted">
                <span className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0" />{' '}
                  {CONTACT.addressFull}
                </span>
                <span className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0" /> {CONTACT.hoursDisplay} PT
                </span>
              </div>
              <a
                href={CONTACT.mapHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 type-caption-strong text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get directions <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-narrow section-y">
        <Reveal>
          <p className="type-eyebrow text-center text-ink-subtle">
            Before you ask
          </p>
          <h2 className="type-display mt-3 text-center text-ink">
            Common questions
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-col divide-y divide-hairline border-y border-hairline">
          {FAQ.map((f, i) => (
            <FaqRow key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData?.errors;
  // Both consent boxes must be ticked before the form can be submitted.
  const [consent, setConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);

  if (actionData?.ok) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-hairline bg-parchment p-8 text-center">
        <CheckCircle2 className="size-12 text-brand-green" strokeWidth={1.75} />
        <h3 className="type-display-sm mt-5 text-ink">Thanks — we’ve got it</h3>
        <p className="type-body mt-3 max-w-sm text-ink-muted">
          Your message is on its way to our team. We’ll reach out with next
          steps, usually within one business day.
        </p>
      </div>
    );
  }

  return (
    <Form
      method="post"
      replace
      className="rounded-lg border border-hairline bg-parchment p-6 sm:p-8"
    >
      <h2 className="type-display-sm text-ink">Request a free quote</h2>
      <p className="type-caption mt-1.5 text-ink-muted">
        Fields marked with an asterisk are required.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="name" label="Full name *" placeholder="Jane Smith" error={errors?.name} />
        <Field
          name="email"
          type="email"
          label="Email *"
          placeholder="jane@company.com"
          error={errors?.email}
        />
        <Field name="phone" type="tel" label="Phone" placeholder={CONTACT.phoneDisplay} error={errors?.phone} />
        <div className="flex flex-col gap-2">
          <label htmlFor="c-type" className="type-caption-strong text-ink">
            Project type
          </label>
          <div className="relative">
            <select
              id="c-type"
              name="type"
              defaultValue={PROJECT_TYPES[0]}
              className="field-input appearance-none pr-9"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="c-msg" className="type-caption-strong text-ink">
          Project details *
        </label>
        <textarea
          id="c-msg"
          name="message"
          rows={5}
          placeholder="Tell us about the space, scope, and timeline"
          aria-invalid={Boolean(errors?.message)}
          className="w-full rounded-sm border border-hairline bg-canvas px-3.5 py-2.5 type-body text-ink outline-none transition-colors focus:border-primary"
        />
        {errors?.message ? (
          <p className="type-caption text-destructive">{errors.message}</p>
        ) : null}
      </div>
      <label className="mt-5 flex items-start gap-3 type-caption text-ink-muted">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 accent-[#3e6ae1]"
        />
        <span>
          I agree to be contacted about my enquiry and accept the{' '}
          <Link
            to="/privacy-policy"
            className="text-primary underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {errors?.consent ? (
        <p className="mt-2 type-caption text-destructive">{errors.consent}</p>
      ) : null}
      <SmsConsent
        id="c-sms"
        className="mt-4"
        checked={smsConsent}
        onCheckedChange={setSmsConsent}
      />
      <Button
        type="submit"
        disabled={submitting || !consent || !smsConsent}
        className="mt-6 h-12 w-full text-[15px] font-medium sm:w-auto sm:px-8"
      >
        {submitting ? 'Sending…' : 'Send request'}
        <ArrowRight className="size-4" />
      </Button>
    </Form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`c-${name}`} className="type-caption-strong text-ink">
        {label}
      </label>
      <input
        id={`c-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="field-input"
      />
      {error ? <p className="type-caption text-destructive">{error}</p> : null}
    </div>
  );
}

function FaqRow({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="type-body-strong text-ink">{q}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-ink-subtle transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="grid transition-all duration-300"
        style={{gridTemplateRows: open ? '1fr' : '0fr'}}
      >
        <div className="overflow-hidden">
          <p className="type-body pb-5 text-ink-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}
