import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {User, Package, MapPin, LogOut, ChevronRight} from 'lucide-react';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome back, ${customer.firstName}!`
      : `Welcome to your account`
    : 'Account Details';

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <div className="bg-accent-600 py-12">
        <div className="section-container">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {heading}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <AccountMenu />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet context={{customer}} />
          </main>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  const menuItems = [
    {
      to: '/account/orders',
      icon: Package,
      label: 'Orders',
      description: 'View order history',
    },
    {
      to: '/account/profile',
      icon: User,
      label: 'Profile',
      description: 'Edit personal info',
    },
    {
      to: '/account/addresses',
      icon: MapPin,
      label: 'Addresses',
      description: 'Manage addresses',
    },
  ];

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) =>
              `flex items-center justify-between p-4 rounded-lg transition-all ${
                isActive
                  ? 'bg-accent-600 text-white'
                  : 'bg-white text-brand-600 hover:bg-accent-50 hover:text-accent-700'
              }`
            }
          >
            {({isActive}) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p
                      className={`text-xs ${isActive ? 'text-accent-100' : 'text-brand-400'}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </NavLink>
        );
      })}

      {/* Logout */}
      <Form method="POST" action="/account/logout">
        <button
          type="submit"
          className="w-full flex items-center justify-between p-4 rounded-lg bg-white text-brand-600 hover:bg-red-50 hover:text-error transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <div>
              <p className="font-semibold">Sign Out</p>
              <p className="text-xs text-brand-400">Logout from account</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" />
        </button>
      </Form>
    </nav>
  );
}
