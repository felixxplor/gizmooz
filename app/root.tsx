import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.ico';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {ArrowLeft, Home, Package, Search} from 'lucide-react';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/x-icon', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style dangerouslySetInnerHTML={{__html: 'body{opacity:0}'}} />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData<RootLoader>('root');

  let content: React.ReactNode;

  if (isRouteErrorResponse(error) && error.status === 404) {
    content = <NotFoundPage />;
  } else if (isRouteErrorResponse(error)) {
    content = (
      <GenericErrorPage
        status={error.status}
        statusText={error.statusText}
      />
    );
  } else {
    content = (
      <GenericErrorPage status={500} statusText="Internal Server Error" />
    );
  }

  // When root loader data is available, use PageLayout for consistent rendering
  if (data) {
    return (
      <PageLayout {...data}>
        {content}
      </PageLayout>
    );
  }

  // Fallback when root loader itself failed (no data available)
  return content;
}

function NotFoundPage() {
  return (
    <div className="flex-1 bg-brand-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center mx-auto">
        <div className="mb-4">
          <h1 className="text-[120px] sm:text-[160px] font-bold text-brand-300 leading-none select-none">
            404
          </h1>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-brand-900/70 mb-10 max-w-md mx-auto text-center">
          The page you&apos;re looking for doesn&apos;t exist. It might have
          been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link
            to="/"
            className="btn-primary px-8 py-4 rounded-full inline-flex items-center justify-center gap-2"
            style={{color: 'white'}}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/collections"
            className="btn-secondary px-8 py-4 rounded-full inline-flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Browse Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/collections"
            className="p-6 bg-white border border-brand-200 rounded-2xl hover:border-accent-400 hover:shadow-lg transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-brand-900 font-semibold mb-1">Collections</h3>
            <p className="text-sm text-brand-600">Browse our range</p>
          </Link>

          <Link
            to="/search"
            className="p-6 bg-white border border-brand-200 rounded-2xl hover:border-accent-400 hover:shadow-lg transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-brand-900 font-semibold mb-1">Search</h3>
            <p className="text-sm text-brand-600">Find what you need</p>
          </Link>

          <Link
            to="/pages/contact"
            className="p-6 bg-white border border-brand-200 rounded-2xl hover:border-accent-400 hover:shadow-lg transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-3">
              <ArrowLeft className="w-6 h-6 text-accent-600" />
            </div>
            <h3 className="text-brand-900 font-semibold mb-1">Contact Us</h3>
            <p className="text-sm text-brand-600">Get in touch</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GenericErrorPage({
  status,
  statusText,
}: {
  status: number;
  statusText: string;
}) {
  return (
    <div className="flex-1 bg-white flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[150px] font-bold text-brand-300 leading-none">
            {status}
          </h1>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-4">
          {statusText}
        </h2>
        <p className="text-lg text-brand-900/70 mb-8">
          We&apos;re sorry, but something unexpected happened.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary px-8 py-4 rounded-full inline-flex items-center justify-center gap-2"
            style={{color: 'white'}}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/pages/contact"
            className="btn-secondary px-8 py-4 rounded-full inline-flex items-center justify-center gap-2"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
