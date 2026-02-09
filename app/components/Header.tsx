import {Suspense, useState, useEffect, useCallback} from 'react';
import {Await, NavLink, Form} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import logo from '~/assets/logo.png';

import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Truck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {useAsyncValue} from 'react-router';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Top Banner Carousel */}
      <AnnouncementBar />

      {/* Main Header */}
      <header className="bg-white border-b border-brand-200 sticky top-0 z-50">
        {isSearchOpen ? (
          /* Search Bar — replaces header content, padded to match nav row on desktop */
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 lg:pb-[44px]">
            <Form
              method="get"
              action="/search"
              className="flex items-center h-20 gap-4"
            >
              <Search className="w-5 h-5 text-brand-500 shrink-0" />
              <input
                name="q"
                type="search"
                placeholder="Search our store"
                autoFocus
                className="flex-1 text-base text-brand-900 placeholder:text-brand-400 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="shrink-0 p-2 hover:bg-brand-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-brand-700" />
              </button>
            </Form>
          </div>
        ) : (
          /* Normal Header */
          <>
            {/* Top Row: Search | Logo | Account + Cart */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-20">
                {/* Left: Search + Mobile Menu */}
                <div className="flex items-center gap-2">
                  <button
                    className="lg:hidden flex items-center justify-center w-10 h-10 hover:bg-brand-100 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-brand-900" />
                    ) : (
                      <Menu className="w-5 h-5 text-brand-900" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center justify-center w-10 h-10 hover:bg-brand-100 rounded-full transition-colors group"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-brand-700 group-hover:text-brand-900 transition-colors" />
                  </button>
                </div>

                {/* Center: Logo */}
                <NavLink
                  prefetch="intent"
                  to="/"
                  end
                  className="absolute left-1/2 -translate-x-1/2"
                >
                  <img
                    src={logo}
                    alt="Gizmooz"
                    className="h-14 w-auto object-contain"
                  />
                </NavLink>

                {/* Right: Account + Cart */}
                <div className="flex items-center gap-1">
                  <AccountToggle isLoggedIn={isLoggedIn} />
                  <CartToggle cart={cart} />
                </div>
              </div>
            </div>

            {/* Bottom Row: Desktop Navigation */}
            <nav
              className="hidden lg:block border-t border-brand-100"
              role="navigation"
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-8 py-3">
                  {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
                    if (!item.url) return null;

                    let url = item.url;
                    try {
                      if (
                        item.url.includes('myshopify.com') ||
                        item.url.includes(publicStoreDomain) ||
                        (header?.shop?.primaryDomain?.url &&
                          item.url.includes(header.shop.primaryDomain.url))
                      ) {
                        url = new URL(item.url).pathname;
                      }
                    } catch (e) {
                      url = item.url.startsWith('/') ? item.url : `/${item.url}`;
                    }

                    return (
                      <NavLink
                        key={item.id}
                        prefetch="intent"
                        to={url}
                        end
                        className={({isActive}) =>
                          `text-sm tracking-wide transition-colors relative group ${
                            isActive
                              ? 'text-brand-900 font-semibold'
                              : 'text-brand-600 hover:text-brand-900'
                          }`
                        }
                      >
                        {item.title}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-900 group-hover:w-full transition-all duration-300" />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </nav>
          </>
        )}

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-brand-200 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-1">
              {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
                if (!item.url) return null;

                let url = item.url;
                try {
                  if (
                    item.url.includes('myshopify.com') ||
                    item.url.includes(publicStoreDomain) ||
                    (header?.shop?.primaryDomain?.url &&
                      item.url.includes(header.shop.primaryDomain.url))
                  ) {
                    url = new URL(item.url).pathname;
                  }
                } catch (e) {
                  url = item.url.startsWith('/') ? item.url : `/${item.url}`;
                }

                return (
                  <NavLink
                    key={item.id}
                    prefetch="intent"
                    to={url}
                    end
                    onClick={() => setIsMenuOpen(false)}
                    className={({isActive}) =>
                      `block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                        isActive
                          ? 'text-brand-900 bg-brand-100'
                          : 'text-brand-600 hover:bg-brand-100 hover:text-brand-900'
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop when search is open */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsSearchOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close search"
          onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
        />
      )}
    </>
  );
}

export function HeaderMenu() {
  return null;
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative flex items-center justify-center w-10 h-10 hover:bg-brand-100 rounded-full transition-colors group"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label="Shopping cart"
    >
      <ShoppingBag className="w-5 h-5 text-brand-600 group-hover:text-brand-900 transition-colors" />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function AccountToggle({isLoggedIn}: Pick<HeaderProps, 'isLoggedIn'>) {
  return (
    <Suspense fallback={<AccountIcon isLoggedIn={false} />}>
      <Await resolve={isLoggedIn}>
        {(loggedIn) => <AccountIcon isLoggedIn={loggedIn} />}
      </Await>
    </Suspense>
  );
}

function AccountIcon({isLoggedIn}: {isLoggedIn: boolean}) {
  return (
    <NavLink
      to={isLoggedIn ? '/account/orders' : '/account/login'}
      className="flex items-center justify-center w-10 h-10 hover:bg-brand-100 rounded-full transition-colors group"
      aria-label={isLoggedIn ? 'My Account' : 'Login'}
    >
      <User className="w-5 h-5 text-brand-600 group-hover:text-brand-900 transition-colors" />
    </NavLink>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const ANNOUNCEMENTS = [
  {icon: Truck, text: 'Free Shipping For All Orders'},
  {icon: RotateCcw, text: '30-Day Returns \u00B7 Money-back Guarantee'},
];

function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const next = useCallback(() => {
    setDirection('left');
    setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection('right');
    setIndex((i) => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  const {icon: Icon, text} = ANNOUNCEMENTS[index];

  return (
    <div className="bg-brand-900 text-white py-2.5 px-4 text-xs sm:text-sm overflow-hidden">
      <div className="mx-auto flex items-center justify-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous announcement"
          className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div
          key={`${index}-${direction}`}
          className="flex items-center justify-center gap-2"
          style={{
            animation: `announcement-slide-${direction} 0.35s ease-out`,
            minWidth: '300px',
          }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{text}</span>
        </div>
        <button
          onClick={next}
          aria-label="Next announcement"
          className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Smart Home',
      type: 'HTTP',
      url: '/collections/smart-home',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Wearables',
      type: 'HTTP',
      url: '/collections/wearables',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Audio',
      type: 'HTTP',
      url: '/collections/audio',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: null,
      tags: [],
      title: 'Sale',
      type: 'HTTP',
      url: '/collections/sale',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599033',
      resourceId: null,
      tags: [],
      title: 'New Arrivals',
      type: 'HTTP',
      url: '/collections/new-arrivals',
      items: [],
    },
  ],
};
