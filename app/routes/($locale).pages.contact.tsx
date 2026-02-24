import {Link, Form} from 'react-router';
import type {Route} from './+types/pages.contact';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {Mail, Clock, MessageCircle} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Gizmody | Contact Us'}];
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Contact Us',
          description: "We'd love to hear from you",
        }}
      />

      <div className="section-container py-8">
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
                Contact
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-brand-900 mb-6">
              Send Us a Message
            </h2>
            <Form method="post" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-brand-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-brand-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-brand-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-brand-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none transition-colors resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="btn-primary px-8 py-3 text-sm font-medium">
                Send Message
              </button>
            </Form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-brand-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-semibold text-brand-900">
                  Email Us
                </h3>
              </div>
              <div className="space-y-2 text-brand-700">
                <p>
                  <span className="text-sm text-brand-500">General:</span>
                  <br />
                  hello@gizmody.com
                </p>
                <p>
                  <span className="text-sm text-brand-500">Support:</span>
                  <br />
                  support@gizmody.com
                </p>
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-semibold text-brand-900">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-1 text-brand-700 text-sm">
                <p>Monday - Friday: 9am - 5pm AEST</p>
                <p>Saturday: 10am - 2pm AEST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-semibold text-brand-900">
                  Follow Us
                </h3>
              </div>
              <p className="text-brand-700 text-sm mb-4">
                Stay connected for the latest updates and offers.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 hover:bg-accent-600 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 hover:bg-accent-600 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 hover:bg-accent-600 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
