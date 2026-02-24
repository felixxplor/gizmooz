import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {
  Package,
  Search,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  X,
  LogOut,
} from 'lucide-react';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders | Gizmody'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-900">
                Order History
              </h2>
              <p className="text-sm text-brand-600">
                View and track your orders
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Form method="POST" action="/account/logout">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 border-2 border-brand-300 rounded-lg hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </Form>
        </div>

        <OrderSearchForm currentFilters={filters} />
      </div>

      {/* Orders List */}
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-brand-400" />
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-2xl font-bold text-brand-900 mb-2">
            No orders found
          </h3>
          <p className="text-brand-600 mb-6">
            No orders match your search criteria.
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            Clear Filters
          </Link>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-brand-900 mb-2">
            No orders yet
          </h3>
          <p className="text-brand-600 mb-6">
            You haven&apos;t placed any orders. Start shopping to see your
            orders here.
          </p>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-lg transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order number"
            defaultValue={currentFilters.name || ''}
            className="w-full pl-12 pr-4 py-3 border-2 border-brand-300 rounded-lg focus:border-accent-600 focus:ring-4 focus:ring-accent-100 outline-none transition-all"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="w-full pl-12 pr-4 py-3 border-2 border-brand-300 rounded-lg focus:border-accent-600 focus:ring-4 focus:ring-accent-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSearching}
          className="flex-1 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 disabled:bg-brand-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search Orders'}
        </button>

        {hasFilters && (
          <button
            type="button"
            disabled={isSearching}
            onClick={() => {
              setSearchParams(new URLSearchParams());
              formRef.current?.reset();
            }}
            className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="text-xl font-bold text-accent-600 hover:text-accent-700 transition-colors"
          >
            Order #{order.number}
          </Link>
          {order.confirmationNumber && (
            <p className="text-sm text-brand-600 mt-1">
              Confirmation: {order.confirmationNumber}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Money
            data={order.totalPrice}
            className="text-2xl font-bold text-brand-900"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-brand-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {new Date(order.processedAt).toDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span className="text-sm px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
            {order.financialStatus}
          </span>
        </div>

        {fulfillmentStatus && (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span className="text-sm px-3 py-1 rounded-full font-semibold bg-green-100 text-green-800">
              {fulfillmentStatus}
            </span>
          </div>
        )}
      </div>

      <Link
        to={`/account/orders/${btoa(order.id)}`}
        className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold transition-colors"
      >
        View Order Details
        <span>→</span>
      </Link>
    </div>
  );
}
