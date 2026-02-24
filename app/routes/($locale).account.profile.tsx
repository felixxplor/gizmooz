import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';
import {User, Mail, CheckCircle} from 'lucide-react';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile | Gizmody'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
          <User className="w-6 h-6 text-accent-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-brand-900">My Profile</h2>
          <p className="text-sm text-brand-600">
            Update your personal information
          </p>
        </div>
      </div>

      <Form method="PUT" className="space-y-6">
        {/* Success Message */}
        {action?.customer && !action?.error && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {action?.error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{action.error}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-brand-900 mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
              required
              className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-accent-600 focus:ring-4 focus:ring-accent-100 outline-none transition-all"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-brand-900 mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
              required
              className="w-full px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-accent-600 focus:ring-4 focus:ring-accent-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state !== 'idle'}
          className="w-full py-4 bg-brand-900 hover:bg-brand-800 disabled:bg-brand-300 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
        >
          {state !== 'idle' ? 'Updating...' : 'Update Profile'}
        </button>
      </Form>
    </div>
  );
}
