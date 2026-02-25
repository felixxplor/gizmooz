import {useLoaderData, Form, Link} from 'react-router';
import type {Route} from './+types/pages.tracking';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  CircleDot,
  MapPin,
  ExternalLink,
  AlertCircle,
  Hash,
  Mail,
} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Track Your Order | Gizmody'}];
};

// ─── Admin API helpers ────────────────────────────────────────────────────────

async function getAdminToken(
  shopDomain: string,
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const res = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    },
  );
  if (!res.ok) throw new Error('Could not obtain admin token');
  const data: any = await res.json();
  return data.access_token;
}

async function adminGraphql(
  shopDomain: string,
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<any> {
  const res = await fetch(
    `https://${shopDomain}/admin/api/2026-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  return res.json();
}

// ─── GraphQL query ────────────────────────────────────────────────────────────

const TRACK_ORDER_QUERY = `
  query TrackOrder($query: String!) {
    orders(first: 1, query: $query) {
      nodes {
        id
        name
        email
        displayFulfillmentStatus
        displayFinancialStatus
        processedAt
        statusUrl
        fulfillments(first: 5) {
          status
          trackingCompany
          trackingNumbers
          trackingUrls
          estimatedDeliveryAt
        }
        lineItems(first: 20) {
          nodes {
            title
            quantity
            image { url altText width height }
            variant {
              title
              price { amount currencyCode }
            }
          }
        }
        shippingAddress {
          name
          address1
          address2
          city
          province
          country
          zip
        }
        currentTotalPriceSet {
          shopMoney { amount currencyCode }
        }
      }
    }
  }
`;

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const rawOrder = url.searchParams.get('order')?.trim() ?? '';
  const rawEmail = url.searchParams.get('email')?.trim().toLowerCase() ?? '';

  if (!rawOrder || !rawEmail) {
    return {order: null, error: null, searched: false};
  }

  // Sanitize to prevent injection
  const orderNum = rawOrder.replace(/[^a-zA-Z0-9#-]/g, '');
  const email = rawEmail.replace(/[^a-zA-Z0-9@._+\-]/g, '');
  const orderName = orderNum.startsWith('#') ? orderNum : `#${orderNum}`;

  try {
    const {env} = context;
    const accessToken = await getAdminToken(
      env.PUBLIC_STORE_DOMAIN,
      env.SHOPIFY_API_KEY,
      env.SHOPIFY_API_SECRET,
    );

    const result = await adminGraphql(
      env.PUBLIC_STORE_DOMAIN,
      accessToken,
      TRACK_ORDER_QUERY,
      {query: `name:${orderName} email:${email}`},
    );

    const order = result?.data?.orders?.nodes?.[0] ?? null;

    // Extra email check so you can't guess order numbers
    if (!order || order.email?.toLowerCase() !== email) {
      return {order: null, error: 'No order found. Please check your order number and email.', searched: true};
    }

    return {order, error: null, searched: true};
  } catch {
    return {order: null, error: 'Something went wrong. Please try again.', searched: true};
  }
}

// ─── Tracking step helpers ────────────────────────────────────────────────────

const STEPS = [
  {label: 'Order Placed', icon: CircleDot},
  {label: 'Confirmed', icon: CheckCircle},
  {label: 'Shipped', icon: Truck},
  {label: 'Delivered', icon: Package},
];

function getStep(
  fulfillmentStatus: string,
  financialStatus: string,
  hasTracking: boolean,
): number {
  const fs = fulfillmentStatus.toLowerCase();
  const fin = financialStatus.toLowerCase();

  if (fs.includes('fulfilled') && !fs.includes('un') && !fs.includes('partial')) return 4;
  if (hasTracking || fs.includes('partial') || fs === 'in_transit' || fs === 'out for delivery') return 3;
  if (fin === 'paid' || fin === 'partially paid' || fin === 'authorized') return 2;
  return 1;
}

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

// ─── Components ───────────────────────────────────────────────────────────────

function TrackingTimeline({step, estimatedDelivery}: {step: number; estimatedDelivery?: string | null}) {
  return (
    <div>
      <div className="relative">
        {/* Connector line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-brand-200">
          <div
            className="h-full bg-brand-900 transition-all duration-500"
            style={{width: `${((step - 1) / (STEPS.length - 1)) * 100}%`}}
          />
        </div>

        <div className="relative flex justify-between">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = n <= step;
            const active = n === step;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-2 w-16">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                    done
                      ? 'bg-brand-900 border-brand-900 text-white'
                      : 'bg-white border-brand-200 text-brand-300'
                  } ${active ? 'ring-4 ring-brand-100' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${done ? 'text-brand-900' : 'text-brand-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {estimatedDelivery && step < 4 && (
        <p className="mt-6 text-sm text-center text-brand-600">
          Estimated delivery:{' '}
          <span className="font-semibold text-brand-900">
            {new Date(estimatedDelivery).toLocaleDateString('en-AU', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </p>
      )}
    </div>
  );
}

function StatusBadge({label, color}: {label: string; color: 'green' | 'blue' | 'orange' | 'gray'}) {
  const styles = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-brand-100 text-brand-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[color]}`}>
      {label}
    </span>
  );
}

function financialColor(status: string): 'green' | 'blue' | 'orange' | 'gray' {
  const s = status.toLowerCase();
  if (s === 'paid') return 'green';
  if (s.includes('refund')) return 'orange';
  if (s === 'pending') return 'orange';
  return 'gray';
}

function fulfillmentColor(status: string): 'green' | 'blue' | 'orange' | 'gray' {
  const s = status.toLowerCase();
  if (s.includes('fulfilled') && !s.includes('un')) return 'green';
  if (s.includes('transit') || s.includes('partial') || s.includes('progress')) return 'blue';
  if (s.includes('unfulfilled')) return 'orange';
  return 'gray';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackingPage() {
  const {order, error, searched} = useLoaderData<typeof loader>();

  const fulfillment = order?.fulfillments?.[0] ?? null;
  const trackingNumber = fulfillment?.trackingNumbers?.[0] ?? null;
  const trackingUrl = fulfillment?.trackingUrls?.[0] ?? null;
  const estimatedDelivery = fulfillment?.estimatedDeliveryAt ?? null;

  const step = order
    ? getStep(
        order.displayFulfillmentStatus ?? '',
        order.displayFinancialStatus ?? '',
        !!trackingNumber,
      )
    : 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-50 border-b border-brand-200 py-10 sm:py-14">
        <div className="section-container">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent-100 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-900">
                Track Your Order
              </h1>
              <p className="text-sm text-brand-500 mt-1">
                Enter your order number and email to see real-time tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8 sm:py-12 max-w-2xl mx-auto">
        {/* Search form */}
        <div className="bg-white rounded-2xl border border-brand-200 p-6 sm:p-8 mb-6">
          <Form method="get" className="space-y-4">
            <div>
              <label htmlFor="order" className="block text-sm font-semibold text-brand-900 mb-1.5">
                Order Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  id="order"
                  name="order"
                  type="text"
                  placeholder="e.g. 1001 or #1001"
                  defaultValue={searched ? (order?.name?.replace('#', '') ?? '') : ''}
                  className="w-full pl-11 pr-4 py-3 border-2 border-brand-200 rounded-lg text-sm focus:border-brand-900 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-900 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="The email used at checkout"
                  className="w-full pl-11 pr-4 py-3 border-2 border-brand-200 rounded-lg text-sm focus:border-brand-900 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-900 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              Track Order
            </button>
          </Form>
        </div>

        {/* Error state */}
        {searched && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">{error}</p>
              <p className="text-red-600 text-xs mt-1">
                Double-check your order number (found in your confirmation email) and make sure you&apos;re using the same email address.
              </p>
            </div>
          </div>
        )}

        {/* Order found */}
        {order && (
          <div className="space-y-4">
            {/* Order header */}
            <div className="bg-brand-900 rounded-2xl p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-brand-400 text-xs mb-1">Order</p>
                  <p className="text-xl font-bold">{order.name}</p>
                  <p className="text-brand-400 text-sm mt-1">
                    {new Date(order.processedAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-brand-400 text-xs mb-1">Total</p>
                  <p className="text-xl font-bold">
                    {order.currentTotalPriceSet?.shopMoney
                      ? formatMoney(
                          order.currentTotalPriceSet.shopMoney.amount,
                          order.currentTotalPriceSet.shopMoney.currencyCode,
                        )
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {order.displayFinancialStatus && (
                  <StatusBadge
                    label={order.displayFinancialStatus}
                    color={financialColor(order.displayFinancialStatus)}
                  />
                )}
                {order.displayFulfillmentStatus && (
                  <StatusBadge
                    label={order.displayFulfillmentStatus}
                    color={fulfillmentColor(order.displayFulfillmentStatus)}
                  />
                )}
              </div>
            </div>

            {/* Tracking timeline */}
            <div className="bg-white rounded-2xl border border-brand-200 p-6">
              <h2 className="text-sm font-bold text-brand-900 mb-6">Tracking Status</h2>
              <TrackingTimeline step={step} estimatedDelivery={estimatedDelivery} />
            </div>

            {/* Tracking number + carrier link */}
            {(trackingNumber || order.statusUrl) && (
              <div className="bg-white rounded-2xl border border-brand-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {trackingNumber && (
                  <div>
                    <p className="text-xs text-brand-500 mb-1">
                      {fulfillment?.trackingCompany
                        ? `${fulfillment.trackingCompany} Tracking`
                        : 'Tracking Number'}
                    </p>
                    {trackingUrl ? (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-semibold text-accent-600 hover:underline flex items-center gap-1"
                      >
                        {trackingNumber}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="font-mono text-sm font-semibold text-brand-900">
                        {trackingNumber}
                      </p>
                    )}
                  </div>
                )}
                {order.statusUrl && (
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    Full Order Status
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Shipping address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <h3 className="text-sm font-bold text-brand-900">Shipping To</h3>
                </div>
                <address className="not-italic text-sm text-brand-600 space-y-0.5">
                  {order.shippingAddress.name && (
                    <p className="font-semibold text-brand-900">{order.shippingAddress.name}</p>
                  )}
                  {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}</p>}
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.province,
                      order.shippingAddress.zip,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                </address>
              </div>
            )}

            {/* Items */}
            {order.lineItems?.nodes?.length > 0 && (
              <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-100">
                  <h3 className="text-sm font-bold text-brand-900">
                    Items ({order.lineItems.nodes.length})
                  </h3>
                </div>
                <div className="divide-y divide-brand-100">
                  {order.lineItems.nodes.map((item: any, i: number) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                          <img
                            src={item.image.url}
                            alt={item.image.altText ?? item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brand-900 truncate">{item.title}</p>
                        {item.variant?.title && item.variant.title !== 'Default Title' && (
                          <p className="text-xs text-brand-500 mt-0.5">{item.variant.title}</p>
                        )}
                        <p className="text-xs text-brand-600 mt-1">Qty: {item.quantity}</p>
                      </div>
                      {item.variant?.price && (
                        <p className="text-sm font-semibold text-brand-900 shrink-0">
                          {formatMoney(item.variant.price.amount, item.variant.price.currencyCode)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Login prompt */}
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 text-center text-sm text-brand-600">
              Have an account?{' '}
              <Link to="/account/login" className="text-brand-900 font-semibold hover:underline">
                Sign in
              </Link>{' '}
              to see your full order history and manage returns.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
