import type {Route} from './+types/privacy-policy';
import {LegalPage, LegalSection, LegalSubheading} from '~/components/LegalPage';
import {COMPANY_NAME, CONTACT} from '~/lib/site';

export const meta: Route.MetaFunction = () => [
  {title: `Privacy Policy | ${COMPANY_NAME}`},
  {
    name: 'description',
    content: `How ${COMPANY_NAME} collects, uses, and protects your personal information.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" effective="May 14, 2026" updated="May 14, 2026">
      <LegalSection title="1. Introduction">
        <p>
          Los Angeles Lighting &amp; Electrical (“we,” “us,” “our,” or the
          “Company”) respects your privacy and is committed to protecting the
          personal information you share with us. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you visit
          our website https://losangeleslightingelectrical.com (the “Site”),
          request a quote, communicate with us, or otherwise use our services.
        </p>
        <p>
          By accessing the Site or providing your information to us, you agree to
          the terms of this Privacy Policy. If you do not agree, please do not use
          the Site or our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We may collect the following categories of information:</p>
        <p>
          <strong>a) Personal Information You Provide.</strong> Name, business
          name, mailing address, billing address, email address, telephone number,
          mobile number, project details, payment information, and any other
          information you submit through forms, quote requests, newsletter
          sign-ups, phone calls, text messages, or email correspondence.
        </p>
        <p>
          <strong>b) Information Collected Automatically.</strong> When you visit
          the Site, we may automatically collect certain technical information,
          including your IP address, browser type, device type, operating system,
          referring URL, pages visited, time spent on pages, and clickstream data.
          This is collected through cookies, pixels, web beacons, and similar
          tracking technologies.
        </p>
        <p>
          <strong>c) Information From Third Parties.</strong> We may receive
          information about you from business partners, advertising networks,
          analytics providers, payment processors, and publicly available sources.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To provide, operate, and maintain our electrical and lighting services;</li>
          <li>To respond to quote requests, inquiries, and customer service messages;</li>
          <li>To schedule appointments, dispatch technicians, and complete projects;</li>
          <li>To process payments and manage billing;</li>
          <li>To send service updates, appointment reminders, follow-ups, and one-on-one communications;</li>
          <li>To send marketing, promotional, and newsletter communications (with your consent where required);</li>
          <li>To improve our Site, products, and services;</li>
          <li>To comply with legal obligations and enforce our Terms and Conditions;</li>
          <li>To prevent fraud, protect security, and resolve disputes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. SMS / Text Messaging Program">
        <p>
          When you opt in to receive SMS messages from Los Angeles Lighting &amp;
          Electrical, you agree to receive text messages related to customer care,
          appointment scheduling, service confirmations, quote follow-ups, and
          one-on-one communications from us.
        </p>
        <ul>
          <li><strong>Message frequency may vary.</strong></li>
          <li><strong>Standard message and data rates may apply</strong> depending on your wireless carrier and plan.</li>
          <li><strong>To opt out at any time,</strong> reply <strong>STOP</strong> to any message you receive from us.</li>
          <li><strong>For help,</strong> reply <strong>HELP</strong> or contact us at {CONTACT.phoneDisplay} or {CONTACT.emailSupport}.</li>
          <li>Opting out of SMS messages will not affect your ability to receive services from us through other channels.</li>
        </ul>
        <LegalSubheading>SMS Consent and Data Sharing</LegalSubheading>
        <p>
          <strong>
            We will not share your opt-in to an SMS campaign with any third party
            for purposes unrelated to providing you with the services of that
            campaign. We may share your Personal Data, including your SMS opt-in or
            consent status, with third parties that help us provide our messaging
            services, including but not limited to platform providers, phone
            companies, and any other vendors who assist us in the delivery of text
            messages.
          </strong>
        </p>
        <p>
          <strong>
            All the above categories exclude text messaging originator opt-in data
            and consent; this information will not be shared with any third
            parties.
          </strong>
        </p>
      </LegalSection>

      <LegalSection title="5. How We Share Your Information">
        <p>
          Except as described in Section 4 above regarding SMS opt-in data, we may
          share your information with:
        </p>
        <ul>
          <li><strong>Service Providers / Vendors</strong> that perform services on our behalf, such as payment processors, hosting providers, CRM platforms, email and SMS platform providers, scheduling software, accounting providers, and analytics services.</li>
          <li><strong>Business Partners and Subcontractors</strong> that help us deliver electrical and lighting services to you.</li>
          <li><strong>Legal and Regulatory Authorities</strong> when required by law, subpoena, court order, or other legal process, or to protect our rights, property, or safety, or that of our customers or others.</li>
          <li><strong>Successors in Interest</strong> in connection with a merger, acquisition, financing, reorganization, bankruptcy, or sale of all or a portion of our assets.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </LegalSection>

      <LegalSection title="6. Cookies and Tracking Technologies">
        <p>
          The Site uses cookies and similar technologies to enhance your
          experience, analyze traffic, and improve our marketing. You can manage
          cookie preferences through your browser settings. Disabling cookies may
          affect certain features of the Site.
        </p>
      </LegalSection>

      <LegalSection title="7. Data Retention">
        <p>
          We retain personal information for as long as necessary to fulfill the
          purposes outlined in this Privacy Policy, comply with our legal
          obligations, resolve disputes, and enforce our agreements.
        </p>
      </LegalSection>

      <LegalSection title="8. Data Security">
        <p>
          We implement reasonable administrative, technical, and physical
          safeguards designed to protect your personal information from
          unauthorized access, disclosure, alteration, and destruction. However,
          no method of transmission over the internet or electronic storage is
          100% secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="9. Children’s Privacy">
        <p>
          Our Site and services are not directed to children under the age of 13.
          We do not knowingly collect personal information from children. If you
          believe a child has provided us with personal information, please contact
          us so we can promptly delete it.
        </p>
      </LegalSection>

      <LegalSection title="10. Your Rights and Choices">
        <p>
          Depending on your state of residence, you may have certain rights
          regarding your personal information, including:
        </p>
        <ul>
          <li>The right to access the personal information we hold about you;</li>
          <li>The right to request correction or deletion of your personal information;</li>
          <li>The right to opt out of marketing communications (including SMS by replying STOP and email by clicking “unsubscribe”);</li>
          <li>The right to opt out of the sale or sharing of personal information (we do not sell personal information).</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information in
          Section 13.
        </p>
        <LegalSubheading>California Residents</LegalSubheading>
        <p>
          If you are a California resident, you have additional rights under the
          California Consumer Privacy Act (CCPA), including the right to know what
          categories of personal information we collect, the right to request
          deletion, and the right to non-discrimination for exercising your rights.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-Party Links">
        <p>
          The Site may contain links to third-party websites. We are not
          responsible for the privacy practices or content of those websites. We
          encourage you to review the privacy policies of any third-party site you
          visit.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
          revise the “Last Updated” date at the top of this page. Material changes
          will be communicated through the Site or by other reasonable means. Your
          continued use of the Site or our services after the changes take effect
          constitutes your acceptance of the revised Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Us">
        <p>
          If you have any questions, concerns, or requests regarding this Privacy
          Policy or our privacy practices, please contact us at:
        </p>
        <p>
          <strong>Los Angeles Lighting &amp; Electrical</strong>
          <br />
          {CONTACT.addressFull}
          <br />
          Phone: <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          <br />
          Email: <a href={`mailto:${CONTACT.emailSupport}`}>{CONTACT.emailSupport}</a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
