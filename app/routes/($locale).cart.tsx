import {useLoaderData, data, type HeadersFunction, Await} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '~/components/CartMain';
import {RecommendedProducts} from '~/components/RecommendedProducts';
import {Link} from 'react-router';
import {ArrowLeft, ShoppingBag} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: `Gizmody | Shopping Cart`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      giftCardCodes.push(...inputs.giftCardCodes);
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {cartId},
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  // cart.get() is NOT awaited — returned as a deferred Promise, exactly like
  // the root loader.  React Router resolves it via <Await> in the component,
  // and when the loader revalidates after a cart mutation a brand-new Promise
  // is created so <Await> re-resolves with the fresh server cart.
  return {cart: cart.get(), recommendedProducts};
}

export default function Cart() {
  const {cart: cartPromise, recommendedProducts} =
    useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-50 border-b border-brand-200 py-10 sm:py-14">
        <div className="section-container">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-1.5 text-brand-500 hover:text-brand-900 transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Continue Shopping
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent-100 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-accent-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-900">
              Shopping Cart
            </h1>
          </div>
        </div>
      </div>

      <Suspense fallback={<CartMain layout="page" cart={null} />}>
        <Await resolve={cartPromise}>
          {(cart) => (
            <CartMain layout="page" cart={cart as CartApiQueryFragment} />
          )}
        </Await>
      </Suspense>

      <RecommendedProducts
        products={recommendedProducts}
        title="You May Also Like"
      />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment CartRecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  query CartRecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        ...CartRecommendedProduct
      }
    }
  }
` as const;
