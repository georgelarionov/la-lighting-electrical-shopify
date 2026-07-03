import {Checkbox} from '~/components/ui/checkbox';
import {Label} from '~/components/ui/label';
import {cn} from '~/lib/utils';

/**
 * TCPA/A2P SMS opt-in checkbox. Unchecked by default, optional (not required to
 * submit). Drop into any form that collects a phone number. In native <Form>
 * contexts leave it uncontrolled (submits `smsConsent=yes` when checked); pass
 * `checked`/`onCheckedChange` for client-managed forms (e.g. the calculator).
 */
export const SMS_CONSENT_TEXT =
  'You are agreeing to receive SMS messages regarding customer care, appointment scheduling, marketing sms, service confirmations, quote follow-ups, and one-on-one communications from Los Angeles Lighting & Electrical. Message frequency may vary. Standard Message and Data Rates may apply. Reply STOP to opt out. Reply HELP for help.';

export function SmsConsent({
  id = 'sms-consent',
  checked,
  onCheckedChange,
  className,
}: {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  className?: string;
}) {
  const controlled =
    checked !== undefined
      ? {checked, onCheckedChange: (v: boolean | 'indeterminate') => onCheckedChange?.(v === true)}
      : {};
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Checkbox id={id} name="smsConsent" value="yes" className="mt-0.5 shrink-0" {...controlled} />
      <Label
        htmlFor={id}
        className="type-fine font-normal leading-relaxed text-ink-subtle"
      >
        {SMS_CONSENT_TEXT}
      </Label>
    </div>
  );
}
