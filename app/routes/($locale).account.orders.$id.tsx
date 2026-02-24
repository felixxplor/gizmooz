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
  CreditCard,
  Truck,
  MapPin,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
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
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';
  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-brand-900 rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order {order.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-brand-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.processedAt!).toDateString()}</span>
              </div>
              {order.confirmationNumber && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmation: {order.confirmationNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-brand-300 text-sm mb-1">Total Amount</p>
            <Money data={order.totalPrice!} className="text-3xl font-bold" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-200">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-accent-600" />
                <h2 className="text-xl font-bold text-brand-900">Order Items</h2>
              </div>
            </div>

            <div className="divide-y divide-brand-200">
              {lineItems.map((lineItem, index) => (
                <OrderLineRow key={index} lineItem={lineItem} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-brand-50 space-y-3">
              {((discountValue && discountValue.amount) ||
                discountPercentage) && (
                <div className="flex justify-between text-green-600">
                  <span className="font-semibold">Discount</span>
                  <span className="font-bold">
                    {discountPercentage
                      ? `-${discountPercentage}% OFF`
                      : discountValue && <Money data={discountValue!} />}
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

              <div className="flex justify-between text-xl font-bold text-brand-900 pt-3 border-t border-brand-300">
                <span>Total</span>
                <Money data={order.totalPrice!} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-accent-600" />
              <h3 className="text-lg font-bold text-brand-900">
                Shipping Address
              </h3>
            </div>

            {order?.shippingAddress ? (
              <address className="not-italic text-brand-600 space-y-1">
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
              <p className="text-brand-500">No shipping address provided</p>
            )}
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-accent-600" />
              <h3 className="text-lg font-bold text-brand-900">Order Status</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brand-600">Fulfillment</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {fulfillmentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Track Order */}
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-lg transition-all"
          >
            Track Order
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <div className="p-6 flex gap-4">
      {/* Product Image */}
      {lineItem?.image && (
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-brand-50 flex-shrink-0">
          <Image
            data={lineItem.image}
            className="w-full h-full object-cover"
            width={96}
            height={96}
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-brand-900 mb-1">{lineItem.title}</h4>
        {lineItem.variantTitle && (
          <p className="text-sm text-brand-600 mb-2">{lineItem.variantTitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="text-brand-600">
            <Money data={lineItem.price!} /> × {lineItem.quantity}
          </div>
          <div className="font-bold text-brand-900">
            <Money data={lineItem.totalDiscount!} />
          </div>
        </div>
      </div>
    </div>
  );
}
