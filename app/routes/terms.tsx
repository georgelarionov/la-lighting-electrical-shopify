import type {Route} from './+types/terms';
import {LegalPage, LegalSection} from '~/components/LegalPage';
import {COMPANY_NAME, CONTACT} from '~/lib/site';

export const meta: Route.MetaFunction = () => [
  {title: `Terms and Conditions | ${COMPANY_NAME}`},
  {
    name: 'description',
    content: `The terms governing your use of the ${COMPANY_NAME} website and services.`,
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms and Conditions"
      effective="May 14, 2026"
      updated="May 14, 2026"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          These Terms and Conditions (“Terms”) govern your access to and use of
          the website https://losangeleslightingelectrical.com (the “Site”) and
          any electrical, lighting, installation, maintenance, or related services
          (collectively, the “Services”) provided by Los Angeles Lighting &amp;
          Electrical (“we,” “us,” “our,” or the “Company”).
        </p>
        <p>
          By accessing the Site, requesting a quote, scheduling Services, opting in
          to receive text messages, or otherwise communicating with us, you (“you,”
          “Customer,” or “User”) agree to be bound by these Terms and by our
          Privacy Policy, which is incorporated herein by reference. If you do not
          agree to these Terms, you must not use the Site or our Services.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 18 years of age and legally capable of entering into
          a binding contract to use the Site or request our Services. By using the
          Site or Services, you represent and warrant that you meet these
          requirements.
        </p>
      </LegalSection>

      <LegalSection title="3. Description of Services">
        <p>
          Los Angeles Lighting &amp; Electrical provides residential, commercial,
          and industrial electrical and lighting services, including but not
          limited to installation, maintenance, repair, lighting design, EV
          charging stations, off-grid solutions, and related consulting. All
          Services are subject to availability, site conditions, applicable
          permits, code requirements, and a separate written agreement or work
          order.
        </p>
        <p>
          Information shown on the Site (including product descriptions, photos,
          prices, and availability) is provided for general informational purposes
          only and is not a binding offer. Final scope, pricing, and timelines are
          confirmed in writing through a quote or service agreement.
        </p>
      </LegalSection>

      <LegalSection title="4. Quotes, Estimates, and Pricing">
        <ul>
          <li>Quotes and estimates are provided based on the information you supply and a preliminary review. Actual project cost may vary based on site conditions, materials, code requirements, change orders, and unforeseen circumstances.</li>
          <li>Unless otherwise stated, quotes are valid for thirty (30) days from the date issued.</li>
          <li>Pricing is subject to change without notice prior to acceptance of a quote.</li>
          <li>A signed quote, service agreement, or written acceptance is required before work begins.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Payment Terms">
        <ul>
          <li>Payment terms will be set forth in your individual quote or service agreement.</li>
          <li>Unless otherwise agreed in writing, payment is due upon completion of Services.</li>
          <li>We accept the payment methods listed on the Site or as agreed in writing.</li>
          <li>Late payments may be subject to interest charges and collection costs to the maximum extent permitted by law.</li>
          <li>All sales taxes, permits, inspection fees, and other government charges are the responsibility of the Customer unless expressly included in the quote.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Scheduling, Cancellations, and Changes">
        <ul>
          <li>Service appointments are scheduled by mutual agreement and are subject to technician availability.</li>
          <li>Customers must provide at least 24 hours’ notice to cancel or reschedule appointments. Late cancellations or no-shows may be subject to a service fee.</li>
          <li>Change orders requested after work has begun must be agreed to in writing and may affect pricing and timeline.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Warranties">
        <p>
          We stand behind the quality of our workmanship. The specific warranty
          terms (including duration, scope, and exclusions) applicable to your
          project will be described in your signed service agreement or quote.
        </p>
        <p>
          <strong>Manufacturer warranties</strong> for any parts, fixtures, or
          equipment installed are provided directly by the manufacturer and are
          subject to the manufacturer’s terms.
        </p>
        <p>
          EXCEPT AS EXPRESSLY PROVIDED IN A WRITTEN SERVICE AGREEMENT, THE SERVICES
          AND ANY MATERIALS OR PRODUCTS PROVIDED ARE FURNISHED “AS IS” AND “AS
          AVAILABLE,” AND WE DISCLAIM ALL OTHER WARRANTIES, EXPRESS OR IMPLIED,
          INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW.
        </p>
      </LegalSection>

      <LegalSection title="8. SMS / Text Messaging Program">
        <p>
          When you opt in to receive SMS messages from Los Angeles Lighting &amp;
          Electrical, you agree to the following:
        </p>
        <ul>
          <li><strong>Consent:</strong> By providing your mobile number and opting in, you consent to receive text messages from us related to customer care, appointment scheduling, service confirmations, quote follow-ups, and one-on-one communications.</li>
          <li><strong>Message Frequency:</strong> Message frequency may vary based on your interactions with us.</li>
          <li><strong>Carrier Charges:</strong> Standard message and data rates may apply depending on your wireless carrier and plan. We are not responsible for any charges imposed by your carrier.</li>
          <li><strong>Opt-Out:</strong> You may opt out at any time by replying <strong>STOP</strong> to any SMS message you receive from us. After opting out, you will receive a confirmation message and no further SMS messages, unless you opt back in.</li>
          <li><strong>Help:</strong> For help, reply <strong>HELP</strong> to any message, or contact us at {CONTACT.phoneDisplay} or {CONTACT.emailSupport}.</li>
          <li><strong>Supported Carriers:</strong> Major U.S. carriers are supported. Carriers are not liable for delayed or undelivered messages.</li>
          <li><strong>Eligibility:</strong> You must be the account holder of, or have authorization from the account holder of, the mobile number provided.</li>
        </ul>
        <p>
          Your SMS opt-in data and consent will be handled in accordance with our
          Privacy Policy and will not be shared with third parties for purposes
          unrelated to providing you with our messaging services.
        </p>
      </LegalSection>

      <LegalSection title="9. Use of the Site">
        <p>
          You agree to use the Site only for lawful purposes and in a manner that
          does not infringe the rights of, or restrict or inhibit the use and
          enjoyment of the Site by, any third party. You agree not to:
        </p>
        <ul>
          <li>Use the Site in any way that violates any applicable federal, state, local, or international law or regulation;</li>
          <li>Attempt to gain unauthorized access to any portion of the Site, our servers, or any related systems;</li>
          <li>Upload or transmit viruses, malware, or any other malicious code;</li>
          <li>Use any automated means (including bots, scrapers, or spiders) to access the Site without our prior written permission;</li>
          <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity;</li>
          <li>Interfere with or disrupt the operation of the Site.</li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Intellectual Property">
        <p>
          All content on the Site, including text, graphics, logos, images,
          photographs, videos, designs, software, and the selection and arrangement
          thereof, is the property of Los Angeles Lighting &amp; Electrical or its
          licensors and is protected by U.S. and international copyright, trademark,
          and other intellectual property laws.
        </p>
        <p>
          You may not copy, reproduce, distribute, modify, publicly display,
          publicly perform, republish, download, store, transmit, sell, or
          commercially exploit any content from the Site without our prior written
          consent, except as expressly permitted by these Terms.
        </p>
        <p>
          The Los Angeles Lighting &amp; Electrical name and logo are trademarks of
          the Company. All other trademarks appearing on the Site are the property
          of their respective owners.
        </p>
      </LegalSection>

      <LegalSection title="11. User Submissions">
        <p>
          If you submit, post, or transmit any content to us through the Site
          (including quote requests, reviews, photos, comments, or feedback), you
          grant us a non-exclusive, royalty-free, worldwide, perpetual,
          irrevocable, sublicensable, and transferable license to use, reproduce,
          modify, adapt, publish, and display such content in connection with our
          business.
        </p>
        <p>
          You represent and warrant that you own or have the necessary rights to
          submit such content and that the content does not violate the rights of
          any third party.
        </p>
      </LegalSection>

      <LegalSection title="12. Third-Party Links and Services">
        <p>
          The Site may contain links to third-party websites or services that are
          not owned or controlled by us. We are not responsible for the content,
          policies, or practices of any third-party websites or services. Your
          interactions with third parties are solely between you and the third
          party.
        </p>
      </LegalSection>

      <LegalSection title="13. Disclaimers">
        <p>
          THE SITE AND ALL CONTENT, MATERIALS, AND INFORMATION ON THE SITE ARE
          PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT ANY WARRANTIES OF ANY KIND,
          EITHER EXPRESS OR IMPLIED.
        </p>
        <p>
          WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE,
          OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THE
          ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT ON THE SITE.
        </p>
        <p>Your use of the Site is at your sole risk.</p>
      </LegalSection>

      <LegalSection title="14. Limitation of Liability">
        <p>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LOS
          ANGELES LIGHTING &amp; ELECTRICAL, ITS OWNERS, OFFICERS, EMPLOYEES,
          AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT
          LIMITATION DAMAGES FOR LOST PROFITS, LOST DATA, LOSS OF GOODWILL, OR
          BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF
          THE SITE OR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES.
        </p>
        <p>
          OUR TOTAL CUMULATIVE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATED TO
          THESE TERMS, THE SITE, OR THE SERVICES SHALL NOT EXCEED THE AMOUNT PAID BY
          YOU, IF ANY, FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM IN THE
          TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
        </p>
        <p>
          Some jurisdictions do not allow the limitation or exclusion of certain
          warranties or damages, so some of the above limitations may not apply to
          you.
        </p>
      </LegalSection>

      <LegalSection title="15. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Los Angeles Lighting
          &amp; Electrical, its owners, officers, employees, agents, contractors,
          and affiliates from and against any and all claims, liabilities, damages,
          losses, costs, and expenses (including reasonable attorneys’ fees) arising
          out of or in connection with: (a) your use of the Site or Services; (b)
          your violation of these Terms; (c) your violation of any rights of a third
          party; or (d) any content you submit, post, or transmit through the Site.
        </p>
      </LegalSection>

      <LegalSection title="16. Termination">
        <p>
          We reserve the right, in our sole discretion, to suspend or terminate your
          access to the Site or Services at any time, with or without notice, for
          any reason, including without limitation breach of these Terms.
        </p>
        <p>
          Upon termination, all provisions of these Terms that by their nature
          should survive termination shall survive, including ownership provisions,
          warranty disclaimers, limitations of liability, indemnification, and
          governing law.
        </p>
      </LegalSection>

      <LegalSection title="17. Governing Law and Dispute Resolution">
        <p>
          These Terms are governed by and construed in accordance with the laws of
          the State of California, without regard to its conflict of laws
          principles.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms, the Site, or the
          Services shall be resolved exclusively in the state or federal courts
          located in Los Angeles County, California, and you consent to the personal
          jurisdiction and venue of such courts.
        </p>
        <p>
          You and we agree that any cause of action arising out of or related to the
          Site or Services must commence within one (1) year after the cause of
          action arose; otherwise, such cause of action is permanently barred.
        </p>
      </LegalSection>

      <LegalSection title="18. Changes to These Terms">
        <p>
          We may revise these Terms at any time by updating this page. The “Last
          Updated” date at the top of this page indicates when the Terms were last
          revised. Your continued use of the Site or Services after any such change
          constitutes your acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="19. Severability">
        <p>
          If any provision of these Terms is found to be invalid, illegal, or
          unenforceable by a court of competent jurisdiction, the remaining
          provisions shall remain in full force and effect.
        </p>
      </LegalSection>

      <LegalSection title="20. Entire Agreement">
        <p>
          These Terms, together with our Privacy Policy and any signed service
          agreement or quote, constitute the entire agreement between you and Los
          Angeles Lighting &amp; Electrical regarding your use of the Site and
          Services and supersede all prior agreements and understandings.
        </p>
      </LegalSection>

      <LegalSection title="21. Contact Us">
        <p>
          If you have any questions or concerns about these Terms, please contact us
          at:
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
