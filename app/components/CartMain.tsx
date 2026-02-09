import {useOptimisticCart} from '@shopify/hydrogen';
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
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div
      className={
        layout === 'aside'
          ? 'h-full flex flex-col'
          : 'section-container py-8'
      }
    >
      <CartEmpty hidden={linesCount} layout={layout} />

      {linesCount && (
        <div className={layout === 'aside' ? 'flex-1 overflow-y-auto' : ''}>
          <ul className={layout === 'aside' ? 'px-6' : ''}>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      )}

      {cartHasItems && cart && (
        <div className={layout === 'aside' ? 'px-6 pb-6' : ''}>
          <CartSummary cart={cart as CartApiQueryFragment} layout={layout} />
        </div>
      )}
    </div>
  );
}
