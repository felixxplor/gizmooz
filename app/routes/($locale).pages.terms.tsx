import {Link} from 'react-router';
import type {Route} from './+types/pages.terms';
import {CollectionHeader} from '~/components/collection/CollectionHeader';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Terms & Conditions | Gizmody'}];
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Terms & Conditions',
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
                Terms &amp; Conditions
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto space-y-10 text-brand-700 text-sm sm:text-base leading-relaxed">
          {/* Introduction */}
          <section>
            <p>
              Gizmody.com and its apps and sub-domains (the &ldquo;Site&rdquo;)
              is a marketplace platform owned and operated by Gizmody
              (&ldquo;Gizmody&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
              &ldquo;our&rdquo;). Through the Site, users (&ldquo;you&rdquo; or
              &ldquo;User&rdquo;) may browse and purchase products from
              third-party sellers (&ldquo;Sellers&rdquo;) or directly from
              Gizmody.
            </p>
            <p className="mt-4">
              By accessing or using the Site, you agree to be bound by these
              Terms and Conditions (&ldquo;Agreement&rdquo;). Please read them
              carefully. Gizmody reserves the right to modify or discontinue the
              Site or its services at any time without advance notice.
            </p>
            <p className="mt-4">
              Gizmody earns fees from Sellers on Products sold. Any
              modifications to these Terms are effective immediately upon
              publication; continued use of the Site constitutes your acceptance
              of the updated Terms.
            </p>
          </section>

          <Divider />

          {/* About You */}
          <Section title="1. About You">
            <p>To use the Site, you must:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Be at least 18 years of age;</li>
              <li>Be a resident of Australia;</li>
              <li>
                Have the legal capacity to enter into binding agreements; and
              </li>
              <li>Comply with all applicable laws and this Agreement.</li>
            </ul>
          </Section>

          <Divider />

          {/* Registration */}
          <Section title="2. Registration & Guest Checkout">
            <p>
              You may register an account to save your details, access order
              history, and manage your preferences, or use guest checkout for
              one-time purchases.
            </p>
            <p className="mt-4">
              You are responsible for maintaining the confidentiality of your
              account credentials. If your account is accessed by an
              unauthorised party and you failed to maintain adequate security,
              you may be held responsible for any resulting activity.
            </p>
            <p className="mt-4">
              Accounts are personal and non-transferable. Gizmody may suspend,
              terminate and/or close your account if you breach this Agreement
              or engage in fraudulent or unlawful activity.
            </p>
          </Section>

          <Divider />

          {/* Site Usage */}
          <Section title="3. Our Site, Licence and Restrictions on Use">
            <p>
              Gizmody grants you a limited, non-exclusive, non-transferable
              licence to access and use the Site for personal, non-commercial
              purposes.
            </p>
            <p className="mt-4">You must not:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Interrupt or interfere with the Site&rsquo;s operations;</li>
              <li>Use automated scraping tools or bots;</li>
              <li>Use the Site for any illegal or unauthorised purpose;</li>
              <li>
                Reproduce, modify, distribute or reverse engineer any content or
                intellectual property on the Site without authorisation; or
              </li>
              <li>
                Supply content to Gizmody that is obscene, defamatory, unlawful,
                or infringes the rights of any third party.
              </li>
            </ul>
          </Section>

          <Divider />

          {/* Marketplace Role */}
          <Section title="4. Our Role in Transactions">
            <p>
              Gizmody&rsquo;s Site is a marketplace platform where you, the
              User, may purchase Products from Sellers. Gizmody acts as a
              limited agent, facilitating purchases, collecting payments, and
              providing customer support.
            </p>
            <p className="mt-4">
              When a Seller&rsquo;s Product is purchased via the Site, the User
              and the Seller will at that time form a legally binding agreement
              separate from and in addition to this Agreement with Gizmody.
              Sellers bear sole responsibility for their products, pricing,
              supply, delivery, quality, and legal compliance.
            </p>
          </Section>

          <Divider />

          {/* Products */}
          <Section title="5. Products">
            <p>
              Product images on the Site are provided for illustrative purposes
              only and the actual Products may vary to a small extent. Product
              information is sourced from Sellers or their suppliers.
            </p>
            <p className="mt-4">
              Gizmody does not warrant that all product listings are error-free.
              Gizmody and its Sellers reserve the right to change, suspend or
              remove any Product from the Site at any time without notice.
            </p>
          </Section>

          <Divider />

          {/* Ordering */}
          <Section title="6. Ordering and Delivery">
            <p>
              By placing an order, you agree to purchase the selected Products
              at the prices displayed, inclusive of GST but excluding delivery
              costs. Your order will not be processed until payment is received
              by Gizmody in full.
            </p>
            <p className="mt-4">
              We accept multiple payment methods. Third-party payment methods
              are subject to their own separate terms and conditions.
            </p>
            <p className="mt-4">
              Delivery time estimates can be viewed on Product listings. Actual
              delivery times may vary. Seller products ship from the
              Seller&rsquo;s distribution centre.
            </p>
          </Section>

          <Divider />

          {/* Cancellations */}
          <Section title="7. Cancelling Orders">
            <p>
              Gizmody or its Sellers may reject or cancel your order after it
              has been placed, including where:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>The item is out of stock;</li>
              <li>A pricing or listing error has occurred; or</li>
              <li>There are safety or compliance concerns.</li>
            </ul>
            <p className="mt-4">
              If your order is cancelled, you will be notified and a full refund
              will be issued. You may request cancellation before your order has
              been dispatched. Once an order has been processed, is ready for
              dispatch or has already been sent, it cannot be cancelled.
            </p>
            <p className="mt-4">
              Gizmody&rsquo;s maximum liability for a cancelled order is limited
              to the amount refunded to you. Gizmody reserves the right to
              cancel orders suspected of being placed for resale purposes.
            </p>
          </Section>

          <Divider />

          {/* Returns */}
          <Section title="8. Change of Mind Returns">
            <p>
              Sellers have their own policies and procedures in relation to
              change of mind returns. Sellers may refuse a refund or exchange
              where the return is due to user error.
            </p>
            <p className="mt-4 font-semibold text-brand-900">
              For Gizmody direct products:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                Items must be unused, unopened, and in resalable condition;
              </li>
              <li>Returns must be initiated within 30 days of delivery;</li>
              <li>Return postage costs are at the customer&rsquo;s expense.</li>
            </ul>
            <p className="mt-4">
              Gizmody may refuse change-of-mind returns for big and bulky items,
              health products, jewellery, intimate apparel, consumables,
              bedding, or hygiene-sensitive products. Non-conforming returns
              will be charged back to the user.
            </p>
          </Section>

          <Divider />

          {/* Problems */}
          <Section title="9. Problems with Your Products">
            <p>
              All Products sold on Gizmody come with guarantees that cannot be
              excluded under the Australian Consumer Law. You are entitled to a
              replacement or refund for a major failure and compensation for any
              other reasonably foreseeable loss or damage.
            </p>
            <p className="mt-4">
              If you experience an issue with a product, please contact the
              Seller directly in the first instance. If the matter is
              unresolved, you may escalate to Gizmody support. Gizmody will
              assist through investigation and remedy issuance consistent with
              the Australian Consumer Law.
            </p>
          </Section>

          <Divider />

          {/* Liability */}
          <Section title="10. Liability">
            <p>
              The Site is provided &ldquo;as is&rdquo; without warranties of any
              kind. Without limiting your rights under the Australian Consumer
              Law, Gizmody does not warrant that the Site will be uninterrupted,
              error-free, virus-free, or constantly available.
            </p>
            <p className="mt-4">
              Gizmody will not be liable for any claim or losses that result
              from circumstances beyond our reasonable control or from events
              that do not constitute a breach of this Agreement.
            </p>
            <p className="mt-4">
              Gizmody will not be liable to you for indirect or consequential
              loss unless such loss results from our own negligence or
              misconduct. Where your own conduct has contributed to any loss,
              our liability will be reduced proportionally.
            </p>
            <p className="mt-4">
              For Seller products, the relevant Seller is responsible for
              providing remedies consistent with the Australian Consumer Law.
            </p>
          </Section>

          <Divider />

          {/* Privacy */}
          <Section title="11. Privacy">
            <p>
              Where personal information is provided to Gizmody, our Privacy
              Policy will govern how Gizmody uses or discloses that information.
              By using the Site, you consent to the collection and use of your
              personal information as described in our Privacy Policy.
            </p>
          </Section>

          <Divider />

          {/* Intellectual Property */}
          <Section title="12. Intellectual Property">
            <p>
              You must not reproduce, adapt, modify, display, distribute or
              reverse engineer any Gizmody intellectual property without prior
              written authorisation.
            </p>
            <p className="mt-4">
              By providing any content to Gizmody (including testimonials,
              reviews, or images), you grant Gizmody an irrevocable,
              royalty-free, global licence to use, copy, display or distribute
              that content in connection with the Site and our business.
            </p>
          </Section>

          <Divider />

          {/* Miscellaneous */}
          <Section title="13. Miscellaneous">
            <p>
              This Agreement constitutes the entire agreement between you and
              Gizmody with respect to your use of the Site. A failure to
              exercise any right or remedy under this Agreement does not
              constitute a waiver of that right or remedy in respect of any
              subsequent breach.
            </p>
            <p className="mt-4">
              If any provision of this Agreement is found to be invalid or
              unenforceable, the remaining provisions will continue in full
              force and effect.
            </p>
            <p className="mt-4">
              This Agreement is governed by the laws of Victoria, Australia, and
              you submit to the exclusive jurisdiction of the courts of
              Victoria.
            </p>
            <p className="mt-4">
              In the event of a change in control, merger with or sale of
              Gizmody or its business to a third party, Gizmody may disclose
              personal information and assign the benefits of this Agreement
              without notice to you.
            </p>
          </Section>

          <Divider />

          {/* Shop With Confidence */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-900 mb-6">
              Shop With Confidence
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-accent-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">🚚</div>
                <h3 className="font-bold text-brand-900 mb-2">Free Shipping</h3>
                <p className="text-sm text-brand-600">
                  Enjoy free standard shipping on all orders within Australia,
                  no minimum purchase required.
                </p>
              </div>
              <div className="bg-accent-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">↩️</div>
                <h3 className="font-bold text-brand-900 mb-2">
                  30-Day Returns
                </h3>
                <p className="text-sm text-brand-600">
                  Return any item within 30 days for a full refund or exchange.
                </p>
              </div>
              <div className="bg-accent-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">🛡️</div>
                <h3 className="font-bold text-brand-900 mb-2">
                  1 Year Warranty
                </h3>
                <p className="text-sm text-brand-600">
                  All our products come with a comprehensive 1-year warranty for
                  your peace of mind.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-brand-200 pt-8">
            <p className="text-brand-500 text-sm">
              Questions about these Terms &amp; Conditions?{' '}
              <Link
                to="/pages/contact"
                className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
              >
                Contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-brand-900 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="border-brand-100" />;
}
