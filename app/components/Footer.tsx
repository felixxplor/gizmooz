import {Suspense, useEffect, useRef} from 'react';
import {Await, NavLink, useFetcher} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Facebook, Twitter, Youtube, Instagram} from 'lucide-react';
import logo from '~/assets/logo.svg';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-white">
            {/* Newsletter Section */}
            <div className="bg-linear-to-r from-accent-100 via-purple-50 to-indigo-100 py-8 sm:py-16">
              <div className="section-container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
                  <div className="text-center md:text-left max-w-xl">
                    <h2 className="text-xl sm:text-3xl font-bold text-brand-900 mb-1 sm:mb-3">
                      Sign Up For Our Newsletter
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-500">
                      Be the first to know about exclusive deals, limited time
                      offers, and new arrivals.
                    </p>
                  </div>
                  <div className="w-full md:w-auto">
                    <NewsletterForm />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Footer */}
            <div className="bg-brand-50 py-8 sm:py-12">
              <div className="section-container">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-8">
                  {/* Brand Column */}
                  <div className="lg:col-span-2">
                    <NavLink
                      to="/"
                      prefetch="intent"
                      className="inline-block mb-3"
                    >
                      <img
                        src={logo}
                        alt="Gizmody"
                        width={144}
                        height={48}
                        className="h-9 sm:h-12 w-auto"
                      />
                    </NavLink>

                    <div className="flex gap-2 mb-3">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="w-10 h-10 rounded-full bg-brand-200 hover:bg-brand-900 hover:text-white text-brand-600 flex items-center justify-center transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="w-10 h-10 rounded-full bg-brand-200 hover:bg-brand-900 hover:text-white text-brand-600 flex items-center justify-center transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-full bg-brand-200 hover:bg-brand-900 hover:text-white text-brand-600 flex items-center justify-center transition-colors"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full bg-brand-200 hover:bg-brand-900 hover:text-white text-brand-600 flex items-center justify-center transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    </div>

                    <div className="space-y-2 text-sm">
                      <a
                        href="mailto:info@gizmody.com"
                        className="block text-brand-500 hover:text-brand-900 transition-colors"
                      >
                        info@gizmody.com
                      </a>
                      <a
                        href="mailto:support@gizmody.com"
                        className="block text-brand-500 hover:text-brand-900 transition-colors"
                      >
                        support@gizmody.com
                      </a>
                    </div>
                  </div>

                  {/* Link Columns — 2-col grid on mobile, individual cells on lg */}
                  <div className="grid grid-cols-2 gap-6 lg:contents">

                  {/* Shop Column */}
                  <div>
                    <h4 className="font-bold text-brand-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
                      Shop
                    </h4>
                    <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                      <li>
                        <NavLink
                          to="/collections/smart-home"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Smart Home
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/collections/wearables"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Wearables
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/collections/audio"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Audio
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to="/collections/accessories"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Accessories
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/collections/sale"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Sale
                        </NavLink>
                      </li>
                    </ul>
                  </div>

                  {/* Company Column */}
                  <div>
                    <h4 className="font-bold text-brand-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
                      Company
                    </h4>
                    <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                      <li>
                        <NavLink
                          to="/pages/about"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          About Us
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/blogs/news"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Press
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/story"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Share Your Story
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/terms"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Terms &amp; Conditions
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/privacy"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Privacy Policy
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/returns"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Return Policy
                        </NavLink>
                      </li>
                    </ul>
                  </div>

                  {/* Support Column */}
                  <div>
                    <h4 className="font-bold text-brand-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
                      Support
                    </h4>
                    <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                      <li>
                        <NavLink
                          to="/pages/faq"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          FAQ
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/help"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Help Center
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/tracking"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Track Orders
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/contact"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Contact Us
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/returns"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Returns
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/pages/warranty"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Warranty
                        </NavLink>
                      </li>
                    </ul>
                  </div>

                  {/* Resources Column */}
                  <div>
                    <h4 className="font-bold text-brand-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
                      Resources
                    </h4>
                    <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                      <li>
                        <NavLink
                          to="/pages/tech-guide"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Tech Guide
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to="/pages/videos"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Videos
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/sitemap"
                          prefetch="intent"
                          className="text-brand-500 hover:text-brand-900 transition-colors"
                        >
                          Sitemap
                        </NavLink>
                      </li>
                    </ul>
                  </div>

                  </div>{/* end link columns wrapper */}

                  {/* Secure Payments Column */}
                  <div className="col-span-1 lg:col-span-1">
                    <h4 className="font-bold text-brand-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide">
                      Secure Payments
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Visa */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          viewBox="0 0 38 24"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          width="38"
                          height="24"
                          aria-labelledby="pi-visa"
                        >
                          <title id="pi-visa">Visa</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                            fill="#142688"
                          ></path>
                        </svg>
                      </div>
                      {/* Mastercard */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          viewBox="0 0 38 24"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          width="38"
                          height="24"
                          aria-labelledby="pi-master"
                        >
                          <title id="pi-master">Mastercard</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
                          <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
                          <path
                            fill="#FF5F00"
                            d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                          ></path>
                        </svg>
                      </div>
                      {/* Amex */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-labelledby="pi-american_express"
                          viewBox="0 0 38 24"
                          width="38"
                          height="24"
                        >
                          <title id="pi-american_express">
                            American Express
                          </title>
                          <path
                            fill="#000"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"
                            opacity=".07"
                          ></path>
                          <path
                            fill="#006FCF"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"
                          ></path>
                          <path
                            fill="#FFF"
                            d="M22.012 19.936v-8.421L37 11.528v2.326l-1.732 1.852L37 17.573v2.375h-2.766l-1.47-1.622-1.46 1.628-9.292-.02Z"
                          ></path>
                          <path
                            fill="#006FCF"
                            d="M23.013 19.012v-6.57h5.572v1.513h-3.768v1.028h3.678v1.488h-3.678v1.01h3.768v1.531h-5.572Z"
                          ></path>
                          <path
                            fill="#006FCF"
                            d="m28.557 19.012 3.083-3.289-3.083-3.282h2.386l1.884 2.083 1.89-2.082H37v.051l-3.017 3.23L37 18.92v.093h-2.307l-1.917-2.103-1.898 2.104h-2.321Z"
                          ></path>
                          <path
                            fill="#FFF"
                            d="M22.71 4.04h3.614l1.269 2.881V4.04h4.46l.77 2.159.771-2.159H37v8.421H19l3.71-8.421Z"
                          ></path>
                          <path
                            fill="#006FCF"
                            d="m23.395 4.955-2.916 6.566h2l.55-1.315h2.98l.55 1.315h2.05l-2.904-6.566h-2.31Zm.25 3.777.875-2.09.873 2.09h-1.748Z"
                          ></path>
                          <path
                            fill="#006FCF"
                            d="M28.581 11.52V4.953l2.811.01L32.84 9l1.456-4.046H37v6.565l-1.74.016v-4.51l-1.644 4.494h-1.59L30.35 7.01v4.51h-1.768Z"
                          ></path>
                        </svg>
                      </div>
                      {/* PayPal */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 35 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Paypal"
                        >
                          <title>Paypal</title>
                          <rect
                            x="0.5"
                            y="0.506"
                            width="34"
                            height="23"
                            rx="1.5"
                            fill="#fff"
                            stroke="#D9D9D9"
                          ></rect>
                          <path
                            d="M9.9 15.248H8.344a.216.216 0 0 0-.213.182l-.63 3.989a.13.13 0 0 0 .129.15h.743a.216.216 0 0 0 .213-.183l.17-1.076a.216.216 0 0 1 .213-.182h.493c1.024 0 1.616-.496 1.77-1.479.07-.43.003-.768-.198-1.004-.221-.26-.613-.397-1.134-.397Zm.18 1.457c-.086.558-.512.558-.924.558H8.92l.164-1.043a.13.13 0 0 1 .129-.11h.107c.281 0 .546 0 .683.16.082.096.107.238.075.434Zm4.47-.018h-.745a.13.13 0 0 0-.128.11l-.033.207-.052-.075c-.161-.234-.52-.312-.88-.312-.823 0-1.526.623-1.663 1.498-.071.436.03.853.277 1.144.227.267.552.379.939.379.663 0 1.03-.427 1.03-.427l-.032.208a.13.13 0 0 0 .127.15h.671a.216.216 0 0 0 .214-.183l.403-2.55a.13.13 0 0 0-.128-.15Zm-1.038 1.45a.83.83 0 0 1-.84.71c-.217 0-.39-.069-.5-.2-.111-.13-.153-.316-.118-.523a.834.834 0 0 1 .835-.717c.211 0 .383.07.497.203.113.134.158.32.126.527Zm4.257-1.45h.749a.13.13 0 0 1 .106.203l-2.49 3.594a.216.216 0 0 1-.178.093h-.747a.13.13 0 0 1-.106-.205l.775-1.094-.824-2.42a.13.13 0 0 1 .123-.172h.735c.096 0 .18.063.208.155l.438 1.461 1.032-1.52a.217.217 0 0 1 .179-.096Z"
                            fill="#253B80"
                          ></path>
                          <path
                            d="m25.885 19.419.639-4.062a.13.13 0 0 1 .127-.11h.72c.079 0 .14.071.127.15l-.63 3.989a.216.216 0 0 1-.213.182h-.642a.13.13 0 0 1-.128-.15Zm-4.89-4.172H19.44a.216.216 0 0 0-.213.183l-.63 3.989a.13.13 0 0 0 .128.15h.799a.151.151 0 0 0 .149-.128l.178-1.131a.216.216 0 0 1 .214-.183h.492c1.025 0 1.616-.496 1.77-1.478.07-.43.003-.768-.198-1.005-.22-.26-.613-.397-1.133-.397Zm.18 1.457c-.085.558-.511.558-.924.558h-.234l.165-1.042a.13.13 0 0 1 .127-.11h.108c.28 0 .546 0 .683.16.082.096.106.238.075.434Zm4.47-.018h-.744a.13.13 0 0 0-.128.11l-.033.208-.052-.075c-.161-.234-.52-.313-.88-.313-.823 0-1.526.624-1.663 1.498-.07.437.03.854.277 1.145.228.267.552.379.939.379.663 0 1.03-.427 1.03-.427l-.032.207a.13.13 0 0 0 .128.15h.67a.216.216 0 0 0 .214-.182l.403-2.55a.13.13 0 0 0-.129-.15Zm-1.038 1.45a.83.83 0 0 1-.84.712c-.216 0-.39-.07-.5-.201-.11-.13-.152-.317-.117-.524a.834.834 0 0 1 .834-.717c.212 0 .384.07.497.203.114.134.16.321.126.527Z"
                            fill="#179BD7"
                          ></path>
                          <path
                            d="m15.657 13.82.19-1.215-.425-.01h-2.034L14.8 3.633a.118.118 0 0 1 .115-.098h3.43c1.139 0 1.925.237 2.335.704.192.22.315.449.374.701.062.265.063.581.003.967l-.005.028v.248l.193.109c.162.085.29.184.39.296.164.188.27.426.315.71.046.29.031.636-.045 1.027-.088.45-.23.843-.421 1.164-.176.296-.401.542-.668.732-.254.18-.556.317-.898.405-.332.086-.71.13-1.124.13h-.267a.81.81 0 0 0-.521.192.808.808 0 0 0-.273.486l-.02.109-.338 2.141-.015.079c-.004.025-.01.037-.021.045a.057.057 0 0 1-.035.013h-1.648Z"
                            fill="#253B80"
                          ></path>
                          <path
                            d="M21.428 5.963c-.01.066-.022.133-.035.202-.453 2.322-2 3.124-3.977 3.124H16.41a.489.489 0 0 0-.483.414l-.515 3.268-.146.926a.257.257 0 0 0 .254.298h1.785a.43.43 0 0 0 .424-.362l.018-.091.336-2.133.021-.117a.429.429 0 0 1 .424-.362h.267c1.73 0 3.083-.702 3.48-2.734.164-.849.079-1.558-.359-2.056a1.705 1.705 0 0 0-.488-.377Z"
                            fill="#179BD7"
                          ></path>
                          <path
                            d="M20.954 5.775a3.571 3.571 0 0 0-.44-.098 5.59 5.59 0 0 0-.887-.065H16.94a.427.427 0 0 0-.424.363l-.572 3.622-.016.106a.489.489 0 0 1 .483-.414h1.006c1.977 0 3.524-.802 3.977-3.125.013-.068.024-.135.035-.2a2.408 2.408 0 0 0-.474-.19Z"
                            fill="#222D65"
                          ></path>
                          <path
                            d="M16.516 5.975a.428.428 0 0 1 .423-.362h2.689c.318 0 .616.02.887.064a4.065 4.065 0 0 1 .44.098l.102.031c.133.045.257.097.371.157.135-.858 0-1.442-.465-1.971-.511-.583-1.435-.832-2.616-.832h-3.43a.49.49 0 0 0-.485.414l-1.428 9.056c-.028.18.11.34.29.34h2.118l.532-3.373.572-3.622Z"
                            fill="#253B80"
                          ></path>
                        </svg>
                      </div>
                      {/* Afterpay */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 35 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Afterpay"
                        >
                          <title>Afterpay</title>
                          <rect
                            x="0.5"
                            y="0.506"
                            width="34"
                            height="23"
                            rx="1.5"
                            fill="#B2FCE4"
                            stroke="#D9D9D9"
                          ></rect>
                          <path
                            d="m32.201 10.223-.92-.534-.92-.56a.924.924 0 0 0-1.266.347.942.942 0 0 0-.124.467v.114a.203.203 0 0 0 .087.166l.434.245a.173.173 0 0 0 .243-.07.169.169 0 0 0 0-.088v-.28a.184.184 0 0 1 .174-.192h.104l.868.499.869.49a.192.192 0 0 1 .06.262l-.06.061-.869.49-.868.5a.18.18 0 0 1-.252-.062.212.212 0 0 1 0-.105v-.14a.942.942 0 0 0-.462-.81.922.922 0 0 0-.927-.004l-.938.543-.92.534a.945.945 0 0 0-.348 1.277c.08.148.2.27.347.35l.92.534.939.534a.924.924 0 0 0 1.265-.347.942.942 0 0 0 .124-.467v-.114a.202.202 0 0 0-.087-.166l-.434-.254a.174.174 0 0 0-.243.07.204.204 0 0 0 0 .096v.28a.185.185 0 0 1-.174.193.235.235 0 0 1-.104 0l-.868-.499-.869-.49a.192.192 0 0 1-.095-.245l.06-.061.869-.49.868-.499a.182.182 0 0 1 .252.061.212.212 0 0 1 0 .105v.14a.942.942 0 0 0 .462.81.923.923 0 0 0 .928.004l.938-.542.92-.534a.925.925 0 0 0 .425-.946.934.934 0 0 0-.13-.34.874.874 0 0 0-.278-.333ZM26.143 10.38l-2.162 4.498h-.868l.807-1.68-1.268-2.817h.92l.817 1.881.869-1.881h.885ZM4.528 11.973a.88.88 0 0 0-.565-.776.862.862 0 0 0-.93.216.878.878 0 0 0 .627 1.479c.23 0 .451-.092.614-.256a.878.878 0 0 0 .254-.62v-.043Zm0 1.601v-.42a1.295 1.295 0 0 1-1.007.473 1.546 1.546 0 0 1-1.09-.484 1.568 1.568 0 0 1-.43-1.117v-.053a1.603 1.603 0 0 1 .42-1.144 1.581 1.581 0 0 1 1.1-.51 1.268 1.268 0 0 1 .99.464v-.402h.773v3.193h-.756ZM9.105 12.848c-.278 0-.347-.105-.347-.367v-1.383h.495v-.69h-.495v-.806h-.8v.779H6.918v-.324c0-.262.104-.367.382-.367h.174v-.622h-.374c-.66 0-.973.22-.973.875v.43h-.442v.725h.442v2.503h.79v-2.503H7.96v1.567c0 .656.243.936.868.936h.434v-.753h-.156ZM11.969 11.684a.763.763 0 0 0-.268-.483.751.751 0 0 0-.523-.173.769.769 0 0 0-.524.174.78.78 0 0 0-.275.482h1.59Zm-1.581.5c.013.206.106.399.258.538a.787.787 0 0 0 .558.205.863.863 0 0 0 .747-.411h.816c-.1.337-.311.63-.598.832-.287.201-.633.3-.982.279a1.556 1.556 0 0 1-1.134-.383 1.58 1.58 0 0 1-.533-1.078v-.193c0-.439.172-.86.48-1.17a1.635 1.635 0 0 1 2.321 0c.308.31.481.731.481 1.17a.788.788 0 0 1 0 .201l-2.414.01ZM17.908 11.973a.878.878 0 0 0-.266-.608.865.865 0 0 0-1.22.015.878.878 0 0 0 .607 1.49.865.865 0 0 0 .613-.245.878.878 0 0 0 .266-.608v-.044Zm-2.51 2.905v-4.497h.773v.41a1.297 1.297 0 0 1 1.008-.472 1.544 1.544 0 0 1 1.091.478 1.567 1.567 0 0 1 .437 1.115v.061a1.602 1.602 0 0 1-.42 1.144 1.58 1.58 0 0 1-1.1.51 1.243 1.243 0 0 1-.964-.429v1.68h-.825ZM21.52 11.973a.88.88 0 0 0-.555-.772.862.862 0 0 0-.926.198.877.877 0 0 0 .57 1.493h.043c.23 0 .451-.092.614-.256a.879.879 0 0 0 .255-.62v-.043Zm0 1.601v-.42a1.27 1.27 0 0 1-.998.473 1.548 1.548 0 0 1-1.42-.991 1.579 1.579 0 0 1-.109-.602v-.06a1.604 1.604 0 0 1 .42-1.145 1.581 1.581 0 0 1 1.1-.51 1.252 1.252 0 0 1 .981.464v-.402h.782v3.193h-.756ZM13.992 10.696a.793.793 0 0 1 .687-.376.76.76 0 0 1 .338.07v.822a.993.993 0 0 0-.564-.149.556.556 0 0 0-.434.622v1.89h-.808V10.38h.781v.315Z"
                            fill="#000"
                          ></path>
                        </svg>
                      </div>
                      {/* Zip */}
                      <div className="bg-white border border-brand-200 rounded-lg p-2 flex items-center justify-center h-10">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 35 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Zip Pay"
                        >
                          <title>Zip Pay</title>
                          <rect
                            x="0.5"
                            y="0.506"
                            width="34"
                            height="23"
                            rx="1.5"
                            fill="#1A0826"
                            stroke="#D9D9D9"
                          ></rect>
                          <path
                            d="m13.758 9.888.803 6.578h7.851l-.803-6.578h-7.851Z"
                            fill="#AA8FFF"
                          ></path>
                          <path
                            d="M15.995 7.377c.5.474.57 1.22.153 1.666-.416.445-1.16.422-1.66-.052s-.57-1.22-.153-1.665c.416-.446 1.159-.423 1.66.051Z"
                            fill="#FFFFFA"
                          ></path>
                          <path
                            d="M30.638 12.256c-.18-1.48-1.335-2.373-2.902-2.368h-5.22l.803 6.578h2.35l-.161-1.316h2.486c1.955 0 2.85-1.227 2.644-2.894Zm-2.9 1.05-2.457.003-.194-1.578 2.471.003c.58.008.878.335.927.787.03.29-.1.786-.746.786Z"
                            fill="#FFFFFA"
                          ></path>
                          <path
                            d="m5.578 14.627.225 1.839h7.843l-.258-2.104H9.733l-.034-.262 3.37-2.369-.225-1.843H5l.256 2.106h3.663l.034.262-3.375 2.371Z"
                            fill="#FFFFFA"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-white border-t border-brand-200 py-6">
              <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-500">
                  <p className="text-center">
                    Copyright © {new Date().getFullYear()} Gizmody. All Rights
                    Reserved
                  </p>
                  <div className="flex items-center gap-4">
                    <NavLink
                      to="/pages/terms"
                      prefetch="intent"
                      className="hover:text-brand-900 transition-colors"
                    >
                      Terms &amp; Conditions
                    </NavLink>
                    <NavLink
                      to="/pages/privacy"
                      prefetch="intent"
                      className="hover:text-brand-900 transition-colors"
                    >
                      Privacy Policy
                    </NavLink>
                    <NavLink
                      to="/pages/returns"
                      prefetch="intent"
                      className="hover:text-brand-900 transition-colors"
                    >
                      Return Policy
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <>
      {(menu || FALLBACK_FOOTER_MENU).items.map((item, index) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const isExternal = !url.startsWith('/');

        return (
          <span key={item.id} className="flex items-center gap-4">
            {isExternal ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:text-brand-900 transition-colors"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                to={url}
                prefetch="intent"
                end
                className="text-brand-500 hover:text-brand-900 transition-colors"
              >
                {item.title}
              </NavLink>
            )}
            {index < (menu || FALLBACK_FOOTER_MENU).items.length - 1 && (
              <span className="text-brand-300">|</span>
            )}
          </span>
        );
      })}
    </>
  );
}

function NewsletterForm() {
  const fetcher = useFetcher<{success?: boolean; message?: string; error?: string}>();
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = fetcher.state !== 'idle';
  const result = fetcher.data;

  useEffect(() => {
    if (result?.success && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [result]);

  return (
    <div className="w-full md:w-auto">
      <fetcher.Form
        method="post"
        action="/newsletter"
        className="flex items-center bg-white rounded-full p-1.5 pl-4 sm:pl-6"
      >
        <input
          ref={inputRef}
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          aria-label="Email address"
          className="flex-1 py-1.5 sm:py-2 text-sm text-brand-900 placeholder-brand-400 outline-none bg-transparent ring-0 shadow-none min-w-0 sm:min-w-52 !border-0 !rounded-none !m-0 !p-0"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-full transition-colors whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </fetcher.Form>
      {result?.success && (
        <p className="mt-2 text-xs text-success text-center">{result.message}</p>
      )}
      {result?.error && (
        <p className="mt-2 text-xs text-error text-center">{result.error}</p>
      )}
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Terms of Use',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'ADA Compliance',
      type: 'SHOP_POLICY',
      url: '/policies/accessibility',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: null,
      tags: [],
      title: 'Cookies Preferences',
      type: 'HTTP',
      url: '/pages/cookies',
      items: [],
    },
  ],
};
