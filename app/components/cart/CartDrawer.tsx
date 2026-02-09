import {Aside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {ShoppingBag} from 'lucide-react';

interface CartDrawerProps {
  cart: any;
}

export function CartDrawer({cart}: CartDrawerProps) {
  return (
    <Aside type="cart" heading={<CartDrawerHeader cart={cart} />}>
      <CartMain cart={cart} layout="aside" />
    </Aside>
  );
}

function CartDrawerHeader({cart}: {cart: any}) {
  const itemCount = cart?.totalQuantity || 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 text-brand-900" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-brand-900">Shopping Cart</h3>
        <p className="text-sm text-brand-500">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>
    </div>
  );
}
