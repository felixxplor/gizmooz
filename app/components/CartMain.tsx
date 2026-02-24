import {useOptimisticCart} from '@shopify/hydrogen';
import {useFetchers} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from '~/components/cart/CartSummary';
import {CartEmpty} from '~/components/cart/CartEmpty';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const fetchers = useFetchers();

  // Detect an in-flight LinesAdd so we can show a skeleton when the cart is
  // still empty (useOptimisticCart needs selectedVariant to render the line).
  const isAddingToCart = fetchers.some((f) => {
    if (f.state === 'idle') return false;
    const raw = f.formData?.get('cartFormInput');
    if (!raw) return false;
    try {
      return (JSON.parse(String(raw)) as {action?: string})?.action === 'LinesAdd';
    } catch {
      return false;
    }
  });

  // useOptimisticCart applies instant local updates (quantity changes, removals,
  // additions) while the real cart action is in flight.  Once the root loader
  // revalidates and <Await> delivers the fresh cart, originalCart updates and
  // the optimistic layer is no longer needed.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  // Check the server cart's real line count (not the optimistic one) so we can
  // detect "empty cart → first item being added". Shopify returns a cart object
  // even when empty, so we can't rely on !originalCart alone.
  const originalLinesCount = Boolean(originalCart?.lines?.nodes?.length || 0);
  const showLoading = isAddingToCart && !originalLinesCount;

  if (layout === 'aside') {
    return (
      <div className="h-full flex flex-col">
        {showLoading ? (
          <CartLoadingSkeleton />
        ) : (
          <CartEmpty hidden={linesCount} layout={layout} />
        )}
        {!showLoading && linesCount && (
          <div className="flex-1 overflow-y-auto px-4 pt-2">
            <ul>
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>
        )}
        {!showLoading && cartHasItems && cart && (
          <div className="px-4 pb-4">
            <CartSummary cart={cart as CartApiQueryFragment} layout={layout} />
          </div>
        )}
      </div>
    );
  }

  // Page layout — two-column with sticky summary
  return (
    <div className="section-container py-10">
      {showLoading ? (
        <CartLoadingSkeleton />
      ) : (
        <CartEmpty hidden={linesCount} layout={layout} />
      )}

      {linesCount && (
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 lg:items-start">
          {/* Left: line items */}
          <div>
            <h2 className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-4">
              {cart?.totalQuantity} item{cart?.totalQuantity !== 1 ? 's' : ''} in your cart
            </h2>
            <ul className="divide-y divide-brand-100">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>

          {/* Right: sticky summary */}
          {cartHasItems && cart && (
            <div className="mt-8 lg:mt-0 lg:sticky lg:top-8">
              <CartSummary cart={cart as CartApiQueryFragment} layout={layout} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="flex-1 px-6 pt-4 space-y-6 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-4 py-6 border-b border-brand-200">
          <div className="w-24 h-24 rounded-lg bg-brand-200 shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-4 bg-brand-200 rounded w-3/4" />
            <div className="h-3 bg-brand-100 rounded w-1/2" />
            <div className="h-5 bg-brand-200 rounded w-1/4 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
