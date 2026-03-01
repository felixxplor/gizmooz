import {Link} from 'react-router';
import type {Route} from './+types/pages.returns';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {Mail, Package, CheckCircle} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Return Policy | Gizmody'}];
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Return Policy',
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
                Return Policy
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto space-y-10 text-brand-700 text-sm sm:text-base leading-relaxed">

          {/* Intro */}
          <section>
            <p className="text-lg text-brand-900 font-medium">
              We stand behind our products and want you to be completely satisfied
              with your purchase.
            </p>
          </section>

          <Divider />

          {/* 30-Day Return Window */}
          <Section title="30-Day Return Window">
            <p>
              You have <span className="font-semibold text-brand-900">30 days</span>{' '}
              from the date you receive your item to initiate a return.
            </p>
          </Section>

          <Divider />

          {/* Change of Mind */}
          <Section title="Change of Mind Returns">
            <p>
              Items must be unused and in their original packaging to be eligible for
              a return.
            </p>
            <p className="mt-4">
              Customers are responsible for return shipping costs. A restocking fee
              may apply if items are returned in a condition unfit for resale.
            </p>
          </Section>

          <Divider />

          {/* How to Start */}
          <Section title="How to Start a Return">
            <div className="grid sm:grid-cols-3 gap-6 mt-2">
              <div className="flex flex-col items-center text-center bg-brand-50 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-brand-900 mb-1">1. Contact Us</h3>
                <p className="text-xs text-brand-500">
                  Reach out via email or phone to start your return process.
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-brand-50 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-brand-900 mb-1">
                  2. Receive Instructions
                </h3>
                <p className="text-xs text-brand-500">
                  We&rsquo;ll provide return shipping details and may request photos.
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-brand-50 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-brand-900 mb-1">3. Receive Refund</h3>
                <p className="text-xs text-brand-500">
                  After we inspect your return, we&rsquo;ll process your refund.
                </p>
              </div>
            </div>
            <p className="mt-6">
              To start a return, or if you have any questions, contact us at{' '}
              <a
                href="mailto:info@gizmody.com"
                className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
              >
                info@gizmody.com
              </a>
              .
            </p>
          </Section>

          <Divider />

          {/* Damages and Issues */}
          <Section title="Damages and Issues">
            <p>
              Please inspect your order upon delivery and contact us immediately if
              the item is defective, damaged, or if you receive the wrong item, so
              that we can evaluate the issue and make it right.
            </p>
            <p className="mt-4 font-semibold text-brand-900">
              When reporting an issue, please include:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your order number</li>
              <li>A description of the problem</li>
              <li>Photos showing the issue (if applicable)</li>
              <li>The date you received the order</li>
            </ul>
          </Section>

          <Divider />

          {/* Refund Process */}
          <Section title="Refund Process">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xs font-bold">1</span>
                <p>
                  We will notify you once we&rsquo;ve received and inspected your
                  return, and let you know if the refund was approved or not.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xs font-bold">2</span>
                <p>
                  If approved, you&rsquo;ll be automatically refunded on your original
                  payment method.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xs font-bold">3</span>
                <p>
                  Please remember it can take some time for your bank or credit card
                  company to process and post the refund.
                </p>
              </li>
            </ul>
          </Section>

          <Divider />

          {/* Exceptions */}
          <Section title="Exceptions — Non-Returnable Items">
            <p>Certain types of items cannot be returned, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Downloadable products and software</li>
              <li>Gift cards</li>
              <li>Personalised items</li>
              <li>Items marked as final sale</li>
              <li>
                Products with broken seals or packaging, for hygiene reasons
              </li>
            </ul>
          </Section>

          <Divider />

          {/* Still Have Questions */}
          <section className="bg-accent-50 rounded-xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-brand-900 mb-2">
              Still Have Questions?
            </h2>
            <p className="text-brand-600 mb-4">
              Our customer service team is ready to help you with any questions about
              our return policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:info@gizmody.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                info@gizmody.com
              </a>
              <Link
                to="/pages/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-brand-300 hover:border-accent-600 hover:text-accent-700 font-semibold rounded-lg transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>
          </section>

          <Divider />

          {/* Shop With Confidence */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-brand-900 mb-2">
              Shop With Confidence
            </h2>
            <p className="text-brand-600 mb-6">
              At Gizmody, we stand behind our products and services with policies
              that put you first.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-brand-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">🚚</div>
                <h3 className="font-bold text-brand-900 mb-2">Free Shipping</h3>
                <p className="text-sm text-brand-600">
                  Enjoy free standard shipping on all orders within Australia, no
                  minimum purchase required.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">↩️</div>
                <h3 className="font-bold text-brand-900 mb-2">30-Day Returns</h3>
                <p className="text-sm text-brand-600">
                  Not completely satisfied? Return any item within 30 days for a full
                  refund or exchange.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-3">🛡️</div>
                <h3 className="font-bold text-brand-900 mb-2">1 Year Warranty</h3>
                <p className="text-sm text-brand-600">
                  All our products come with a comprehensive 1-year warranty for your
                  peace of mind.
                </p>
              </div>
            </div>
          </section>

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
