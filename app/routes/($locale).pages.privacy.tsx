import {Link} from 'react-router';
import type {Route} from './+types/pages.privacy';
import {CollectionHeader} from '~/components/collection/CollectionHeader';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Privacy Policy | Gizmody'}];
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Privacy Policy',
          description: 'Last updated: February 27, 2025',
        }}
      />

      <div className="section-container py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-brand-500">
            <li>
              <Link to="/" className="hover:text-brand-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-brand-900 font-medium" aria-current="page">
                Privacy Policy
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto space-y-10 text-brand-700 text-sm sm:text-base leading-relaxed">

          {/* Introduction */}
          <section>
            <p>
              This website is owned and operated by Gizmody Pty Ltd and will be
              referred to as &ldquo;we&rdquo;, &ldquo;our&rdquo; and &ldquo;us&rdquo;
              in this Internet Privacy Policy. By using and/or visiting our website
              located at www.gizmody.com (and its related sub-domains and apps), you
              agree to be bound by this Internet Privacy Policy.
            </p>
            <p className="mt-4">
              We reserve the right to modify this policy at any time. We recommend
              that you revisit this page regularly to stay informed of any changes.
              This Internet Privacy Policy relates to the collection and use of
              personal information you may supply to us through your use of the Site.
            </p>
            <p className="mt-4">
              We recognise the importance of protecting the privacy of information
              collected about visitors to our Site. &ldquo;Personal information&rdquo;
              means information that identifies you as an individual. This policy
              governs how personal data obtained through our website is managed.
            </p>
          </section>

          <Divider />

          <Section title="1. Personal Information">
            <p>
              Personal information about visitors to our Site is collected only when
              knowingly and voluntarily submitted. Information collection supports the
              provision of our services and the handling of your requests.
            </p>
            <p className="mt-4">
              We aim to protect your personal data from being dealt with in any way
              that is inconsistent with applicable privacy laws in Australia.
            </p>
          </Section>

          <Divider />

          <Section title="2. Use of Information">
            <p>
              Personal information that visitors submit to our Site is used only for
              the purpose for which it is submitted, or for such other secondary
              purposes that are related to the primary purpose of collection.
            </p>
            <p className="mt-4">
              Copies of correspondence that you send to us are stored as archives for
              record-keeping and back-up purposes only.
            </p>
          </Section>

          <Divider />

          <Section title="3. Disclosure">
            <p>
              We will only disclose your personal information where you have consented
              to such disclosure, or where it is necessary to fulfil the purpose for
              which the information was submitted.
            </p>
            <p className="mt-4">
              Personal information may be disclosed in special situations where we
              have reason to believe that doing so is necessary to identify, contact,
              or bring legal action against anyone damaging, injuring, or interfering
              with our rights or property, or those of others who could be harmed by
              such activities.
            </p>
            <p className="mt-4">
              We may engage third parties to provide you with goods or services on our
              behalf and may share your personal information with those third parties
              in order to fulfil such service requests.
            </p>
          </Section>

          <Divider />

          <Section title="4. Security">
            <p>
              We strive to ensure the security, integrity and privacy of personal
              information submitted to our Site and periodically review and update our
              security measures in line with current technologies.
            </p>
            <p className="mt-4">
              Unfortunately, no data transmission over the internet can be guaranteed
              to be totally secure. However, we will endeavour to take all reasonable
              steps to protect the personal information you transmit to us or that we
              collect from you.
            </p>
            <p className="mt-4">
              Our employees and contractors are obliged to respect the confidentiality
              of any personal information held by us. However, we will not be held
              responsible for events arising from unauthorised access to your personal
              information.
            </p>
          </Section>

          <Divider />

          <Section title="5. Cookies">
            <p>
              Cookies are small data files that a website transfers to your device for
              record-keeping purposes. Cookies are an industry-standard tool that can
              facilitate your ongoing access to and use of our Site and allow us to
              provide a customised experience.
            </p>
            <p className="mt-4">
              You may set your browser to deny cookies; however, cookies may be
              necessary to provide you with some features of our online services. If
              you disable cookies, certain features of the Site may not function
              correctly.
            </p>
          </Section>

          <Divider />

          <Section title="6. Access to Information">
            <p>
              We will endeavour to take all reasonable steps to keep secure any
              information we hold about you, and to keep that information accurate and
              up to date.
            </p>
            <p className="mt-4">
              If you believe that any information we hold about you is inaccurate,
              out of date, incomplete, irrelevant or misleading, please contact us and
              we will take reasonable steps to correct it. Our staff and contractors
              are obliged to respect the confidentiality of all personal information
              held by us.
            </p>
          </Section>

          <Divider />

          <Section title="7. Links to Other Sites">
            <p>
              Our Site may provide links to websites outside of our own, including
              third-party websites. We cannot accept responsibility for the privacy
              practices or conduct of companies linked to our website.
            </p>
            <p className="mt-4">
              We encourage you to examine the terms and conditions and privacy
              statements of all external websites you visit before submitting any
              personal information.
            </p>
          </Section>

          <Divider />

          <Section title="8. Problems or Questions">
            <p>
              If we become aware of any ongoing concerns or problems with our website,
              we will take these issues seriously and work to address them promptly.
            </p>
            <p className="mt-4">
              If you have any questions, concerns or complaints about this Privacy
              Policy or our handling of your personal information, please{' '}
              <Link
                to="/pages/contact"
                className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
              >
                contact us
              </Link>
              .
            </p>
          </Section>

          <Divider />

          <Section title="9. Further Privacy Information">
            <p>
              For further information about privacy issues in Australia and the
              protection of your privacy, visit the Office of the Australian
              Information Commissioner at{' '}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
              >
                www.oaic.gov.au
              </a>
              .
            </p>
          </Section>

          <Divider />

          {/* Contact */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-brand-900 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="font-semibold text-brand-900">Email: </span>
                <a
                  href="mailto:info@gizmody.com"
                  className="text-accent-600 hover:text-accent-700 transition-colors"
                >
                  info@gizmody.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-brand-900">Website: </span>
                <Link
                  to="/pages/contact"
                  className="text-accent-600 hover:text-accent-700 transition-colors"
                >
                  gizmody.com/contact
                </Link>
              </li>
            </ul>
          </section>

          <div className="border-t border-brand-200 pt-6">
            <p className="text-xs text-brand-400">
              &copy; {new Date().getFullYear()} Gizmody. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-brand-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="border-brand-100" />;
}
