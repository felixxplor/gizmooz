import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {
  Package,
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Clock,
  Truck,
  CircleDot,
  Hash,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name} | Gizmody`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;
  const lineItems = order.lineItems.nodes;
  const discountApplications = order.discountApplications.nodes;
  const fulfillment = order.fulfillments.nodes[0] ?? null;
  const fulfillmentStatus = fulfillment?.status ?? null;
  const trackingInfo = fulfillment?.trackingInformation?.[0] ?? null;
  const estimatedDelivery = fulfillment?.estimatedDeliveryAt ?? null;

  const firstDiscount = discountApplications[0]?.value;
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<typeof firstDiscount, {__typename: 'MoneyV2'}>)
      : null;
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (firstDiscount as Extract<typeof firstDiscount, {__typename: 'PricingPercentageValue'}>).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
    trackingInfo,
    estimatedDelivery,
  };
}

// Map order status fields to a 1–4 step index
function getTrackingStep(
  fulfillmentStatus: string | null,
  financialStatus: string | null,
  hasTracking: boolean,
): number {
  const fs = (fulfillmentStatus ?? '').toUpperCase();
  const fin = (financialStatus ?? '').toUpperCase();

  if (fs === 'FULFILLED' || fs === 'SUCCESS') return 4;
  if (hasTracking || ['IN_PROGRESS', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'ATTEMPTED_DELIVERY', 'PARTIALLY_FULFILLED', 'OPEN'].includes(fs)) return 3;
  if (['PAID', 'PARTIALLY_PAID', 'AUTHORIZED'].includes(fin)) return 2;
  return 1;
}

const STEPS = [
  {label: 'Order Placed', icon: CircleDot},
  {label: 'Confirmed', icon: CheckCircle},
  {label: 'Shipped', icon: Truck},
  {label: 'Delivered', icon: Package},
];

function TrackingTimeline({
  step,
  estimatedDelivery,
}: {
  step: number;
  estimatedDelivery: string | null;
}) {
  return (
    <div className="bg-white rounded-xl border border-brand-200 p-6">
      <h2 className="text-base font-bold text-brand-900 mb-6">Tracking Status</h2>

      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-brand-200">
          <div
            className="h-full bg-brand-900 transition-all duration-500"
            style={{width: `${((step - 1) / (STEPS.length - 1)) * 100}%`}}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((s, i) => {
            const stepNum = i + 1;
            const done = stepNum <= step;
            const active = stepNum === step;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-2 w-16">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                    done
                      ? 'bg-brand-900 border-brand-900 text-white'
                      : 'bg-white border-brand-200 text-brand-300'
                  } ${active ? 'ring-4 ring-brand-200' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    done ? 'text-brand-900' : 'text-brand-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {estimatedDelivery && step < 4 && (
        <p className="mt-6 text-sm text-brand-600 text-center">
          Estimated delivery:{' '}
          <span className="font-semibold text-brand-900">
            {new Date(estimatedDelivery).toLocaleDateString('en-AU', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </p>
      )}
    </div>
  );
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
    trackingInfo,
    estimatedDelivery,
  } = useLoaderData<typeof loader>();

  const trackingStep = getTrackingStep(
    fulfillmentStatus,
    (order as any).financialStatus ?? null,
    !!trackingInfo?.number,
  );

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="bg-brand-900 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-brand-400 text-sm mb-1">Order</p>
            <h1 className="text-2xl font-bold">{order.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-brand-300 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.processedAt!).toLocaleDateString('en-AU', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
              </div>
              {order.confirmationNumber && (
                <div className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4" />
                  <span>{order.confirmationNumber}</span>
                </div>
              )}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-brand-400 text-sm mb-1">Total</p>
            <Money data={order.totalPrice!} className="text-2xl font-bold" />
          </div>
        </div>
      </div>

      {/* Tracking timeline */}
      <TrackingTimeline step={trackingStep} estimatedDelivery={estimatedDelivery} />

      {/* Tracking number + status page */}
      {(trackingInfo || order.statusPageUrl) && (
        <div className="bg-white rounded-xl border border-brand-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {trackingInfo?.number && (
            <div>
              <p className="text-xs text-brand-500 mb-1">Tracking number</p>
              {trackingInfo.url ? (
                <a
                  href={trackingInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-mono font-semibold text-accent-600 hover:underline flex items-center gap-1"
                >
                  {trackingInfo.number}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm font-mono font-semibold text-brand-900">
                  {trackingInfo.number}
                </p>
              )}
            </div>
          )}
          {order.statusPageUrl && (
            <a
              href={order.statusPageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Truck className="w-4 h-4" />
              Track on Shopify
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order items + summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-brand-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-100">
              <h2 className="font-bold text-brand-900">
                Items ({lineItems.length})
              </h2>
            </div>

            <div className="divide-y divide-brand-100">
              {lineItems.map((lineItem, index) => (
                <OrderLineRow key={index} lineItem={lineItem} />
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 bg-brand-50 space-y-2 text-sm">
              {((discountValue && discountValue.amount) || discountPercentage) && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-semibold">
                    {discountPercentage
                      ? `-${discountPercentage}% OFF`
                      : discountValue && <Money data={discountValue} />}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-brand-600">
                <span>Subtotal</span>
                <Money data={order.subtotal!} className="font-semibold" />
              </div>
              <div className="flex justify-between text-brand-600">
                <span>Tax</span>
                <Money data={order.totalTax!} className="font-semibold" />
              </div>
              <div className="flex justify-between font-bold text-brand-900 pt-2 border-t border-brand-200">
                <span>Total</span>
                <Money data={order.totalPrice!} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-brand-900 text-sm">Shipping Address</h3>
            </div>
            {order?.shippingAddress ? (
              <address className="not-italic text-sm text-brand-600 space-y-0.5">
                <p className="font-semibold text-brand-900">
                  {order.shippingAddress.name}
                </p>
                {order.shippingAddress.formatted && (
                  <p className="whitespace-pre-line">
                    {order.shippingAddress.formatted}
                  </p>
                )}
                {order.shippingAddress.formattedArea && (
                  <p>{order.shippingAddress.formattedArea}</p>
                )}
              </address>
            ) : (
              <p className="text-sm text-brand-400">No shipping address</p>
            )}
          </div>

          {/* Status summary */}
          <div className="bg-white rounded-xl border border-brand-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-brand-900 text-sm">Order Status</h3>
            </div>
            <div className="space-y-3 text-sm">
              {(order as any).financialStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-brand-600">Payment</span>
                  <FinancialBadge status={(order as any).financialStatus} />
                </div>
              )}
              {fulfillmentStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-brand-600">Fulfillment</span>
                  <FulfillmentBadge status={fulfillmentStatus} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialBadge({status}: {status: string}) {
  const s = status.toUpperCase();
  const styles =
    s === 'PAID'
      ? 'bg-green-100 text-green-800'
      : s === 'REFUNDED' || s === 'PARTIALLY_REFUNDED'
        ? 'bg-yellow-100 text-yellow-800'
        : s === 'PENDING'
          ? 'bg-orange-100 text-orange-800'
          : 'bg-brand-100 text-brand-700';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function FulfillmentBadge({status}: {status: string}) {
  const s = status.toUpperCase();
  const styles =
    s === 'FULFILLED' || s === 'SUCCESS'
      ? 'bg-green-100 text-green-800'
      : s === 'IN_PROGRESS' || s === 'IN_TRANSIT'
        ? 'bg-blue-100 text-blue-800'
        : s === 'UNFULFILLED'
          ? 'bg-orange-100 text-orange-800'
          : 'bg-brand-100 text-brand-700';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div className="p-4 flex gap-4">
      {lineItem?.image && (
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-brand-50 shrink-0">
          <Image
            data={lineItem.image}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-900 text-sm">{lineItem.title}</p>
        {lineItem.variantTitle && (
          <p className="text-xs text-brand-500 mt-0.5">{lineItem.variantTitle}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-sm text-brand-600">
          <Money data={lineItem.price!} />
          <span>×</span>
          <span>{lineItem.quantity}</span>
        </div>
      </div>
      <div className="text-sm font-bold text-brand-900 shrink-0">
        <Money data={lineItem.totalDiscount!} />
      </div>
    </div>
  );
}
