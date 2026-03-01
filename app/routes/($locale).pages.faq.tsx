'use client';

import {useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/pages.faq';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {ChevronDown} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FAQ | Gizmody'}];
};

type FAQ = {question: string; answer: React.ReactNode};
type Category = {label: string; faqs: FAQ[]};

const categories: Category[] = [
  {
    label: 'Ordering',
    faqs: [
      {
        question: 'How do I place an order on your website?',
        answer: (
          <>
            <p>Placing an order is simple:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Browse our store and add items to your cart.</li>
              <li>Click the cart icon and review your items.</li>
              <li>Proceed to checkout and enter your shipping details.</li>
              <li>Select a payment method and complete your purchase.</li>
            </ol>
            <p className="mt-2">
              You&rsquo;ll receive an order confirmation email once payment is
              processed.
            </p>
          </>
        ),
      },
      {
        question: 'Can I modify or cancel my order after it\'s been placed?',
        answer: (
          <p>
            We process orders quickly, so modifications or cancellations are only
            possible before your order has been dispatched. Please contact us
            immediately at{' '}
            <a
              href="mailto:info@gizmody.com"
              className="text-accent-600 hover:underline"
            >
              info@gizmody.com
            </a>{' '}
            if you need to make a change. Once an order is ready for dispatch or
            has been shipped, it cannot be cancelled.
          </p>
        ),
      },
    ],
  },
  {
    label: 'Shipping & Delivery',
    faqs: [
      {
        question: 'How much does shipping cost?',
        answer: (
          <p>
            We offer <strong>free standard shipping on all orders</strong> within
            Australia — no minimum purchase required. You&rsquo;ll see the
            shipping cost (if any) confirmed at checkout before you pay.
          </p>
        ),
      },
      {
        question: 'How long will it take to receive my order?',
        answer: (
          <>
            <p>
              Delivery times vary depending on your location and the product.
              Estimated delivery times are shown on each product listing. As a
              general guide:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Metro areas: 3–5 business days</li>
              <li>Regional areas: 5–10 business days</li>
            </ul>
            <p className="mt-2">
              You will receive a tracking link via email once your order has been
              dispatched.
            </p>
          </>
        ),
      },
      {
        question: 'Do you ship internationally?',
        answer: (
          <p>
            At this time, we ship within Australia only. We are working on
            expanding our delivery options internationally in the future. Stay
            tuned!
          </p>
        ),
      },
      {
        question: 'How can I track my order?',
        answer: (
          <p>
            Once your order has been dispatched, you will receive a shipping
            confirmation email with a tracking number and a link to track your
            parcel. You can also visit our{' '}
            <Link to="/pages/tracking" className="text-accent-600 hover:underline">
              order tracking page
            </Link>{' '}
            and enter your order details.
          </p>
        ),
      },
    ],
  },
  {
    label: 'Returns & Refunds',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: (
          <p>
            We offer a <strong>30-day return window</strong> from the date you
            receive your item. Items must be unused and in their original
            packaging to be eligible. Customers are responsible for return
            shipping costs. Some items such as gift cards, personalised products,
            downloadable software, and hygiene-sensitive products cannot be
            returned. See our full{' '}
            <Link
              to="/pages/returns"
              className="text-accent-600 hover:underline"
            >
              Return Policy
            </Link>{' '}
            for details.
          </p>
        ),
      },
      {
        question: 'How do I start a return?',
        answer: (
          <>
            <p>To start a return:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                Contact us at{' '}
                <a
                  href="mailto:info@gizmody.com"
                  className="text-accent-600 hover:underline"
                >
                  info@gizmody.com
                </a>{' '}
                with your order number and reason for return.
              </li>
              <li>
                We&rsquo;ll send you return shipping instructions and may request
                photos of the item.
              </li>
              <li>
                Once we receive and inspect the return, we&rsquo;ll process your
                refund.
              </li>
            </ol>
          </>
        ),
      },
      {
        question: 'How long do refunds take to process?',
        answer: (
          <p>
            Once we receive and inspect your returned item, we will notify you of
            the outcome. If approved, your refund will be applied to your original
            payment method. Please allow <strong>5–10 business days</strong> for
            your bank or credit card provider to process and post the refund.
          </p>
        ),
      },
    ],
  },
  {
    label: 'Products',
    faqs: [
      {
        question: 'Are your products covered by warranty?',
        answer: (
          <p>
            Yes — all products sold on Gizmody come with a{' '}
            <strong>1-year comprehensive warranty</strong> as well as the
            statutory guarantees under Australian Consumer Law. If your product
            develops a fault within the warranty period, please contact us and
            we&rsquo;ll arrange a repair, replacement, or refund as appropriate.
          </p>
        ),
      },
      {
        question: 'How can I find product specifications?',
        answer: (
          <p>
            Full product specifications are listed on each product page. Scroll
            down past the main images to find the specifications section. If you
            can&rsquo;t find the information you need, feel free to{' '}
            <Link
              to="/pages/contact"
              className="text-accent-600 hover:underline"
            >
              contact us
            </Link>{' '}
            and we&rsquo;ll be happy to help.
          </p>
        ),
      },
      {
        question: 'Can I request a product that\'s out of stock?',
        answer: (
          <p>
            If an item is out of stock, you can use the &ldquo;Notify
            Me&rdquo; option on the product page (where available) to be alerted
            when it&rsquo;s back in stock. Alternatively,{' '}
            <Link
              to="/pages/contact"
              className="text-accent-600 hover:underline"
            >
              contact us
            </Link>{' '}
            and we&rsquo;ll do our best to assist you.
          </p>
        ),
      },
    ],
  },
  {
    label: 'Account & Payment',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: (
          <>
            <p>Creating an account is easy:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Click the account icon in the top navigation bar.</li>
              <li>Select &ldquo;Create Account&rdquo;.</li>
              <li>Enter your name, email address, and a password.</li>
              <li>Verify your email and you&rsquo;re all set.</li>
            </ol>
            <p className="mt-2">
              You can also check out as a guest if you prefer not to create an
              account.
            </p>
          </>
        ),
      },
      {
        question: 'What payment methods do you accept?',
        answer: (
          <>
            <p>We accept the following payment methods:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>PayPal</li>
              <li>Afterpay</li>
              <li>Zip Pay</li>
            </ul>
            <p className="mt-2">
              All transactions are secured and encrypted. Third-party payment
              providers are subject to their own terms and conditions.
            </p>
          </>
        ),
      },
      {
        question: 'Is my personal information secure?',
        answer: (
          <p>
            Yes. We take your privacy seriously and use industry-standard
            encryption to protect your personal and payment information. We will
            never sell your data to third parties. Please review our{' '}
            <Link
              to="/pages/privacy"
              className="text-accent-600 hover:underline"
            >
              Privacy Policy
            </Link>{' '}
            for full details on how we handle your information.
          </p>
        ),
      },
    ],
  },
];

const allFaqs: FAQ[] = categories.flatMap((c) => c.faqs);

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categoryLabels = ['All', ...categories.map((c) => c.label)];
  const displayed =
    activeCategory === 'All'
      ? allFaqs
      : categories.find((c) => c.label === activeCategory)?.faqs ?? [];

  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Frequently Asked Questions',
          description: 'Find answers to our most common questions below.',
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
                FAQ
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryLabels.map((label) => (
              <button
                key={label}
                onClick={() => {
                  setActiveCategory(label);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === label
                    ? 'bg-accent-600 text-white'
                    : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {displayed.map((faq, i) => (
              <div
                key={i}
                className="border border-brand-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-brand-50 transition-colors"
                >
                  <span className="font-semibold text-brand-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-accent-600 transition-transform duration-200 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-brand-600 leading-relaxed border-t border-brand-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-12 bg-accent-50 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-lg font-bold text-brand-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-brand-600 text-sm mb-4">
              Can&rsquo;t find what you&rsquo;re looking for? Our team is happy
              to help.
            </p>
            <Link
              to="/pages/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
