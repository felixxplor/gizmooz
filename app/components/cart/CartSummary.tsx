import {CartForm, Money} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {ArrowRight, Tag, BadgePercent, Lock, RotateCcw, Truck} from 'lucide-react';

type CartMainProps = {
  cart: CartApiQueryFragment;
  layout: 'page' | 'aside';
};

export function CartSummary({cart, layout}: CartMainProps) {
  type LineWithDiscounts = {
    discountAllocations?: Array<{discountedAmount?: {amount?: string | null} | null}>;
  };
  const totalSaved = (cart.lines?.nodes || []).reduce((sum, line) => {
    const discounts = (line as LineWithDiscounts).discountAllocations || [];
    return (
      sum +
      discounts.reduce(
        (dSum, a) => dSum + parseFloat(a.discountedAmount?.amount || '0'),
        0,
      )
    );
  }, 0);

  return (
    <div className="space-y-4">
      {/* Free Shipping Banner */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-center gap-2">
        <Truck className="w-4 h-4 text-accent-600 shrink-0" />
        <p className="text-sm font-semibold text-accent-700">
          Free shipping on your order!
        </p>
      </div>

      {/* Discount Code */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* Savings Banner */}
      {totalSaved > 0 && (
        <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 rounded-lg px-4 py-3">
          <BadgePercent className="w-5 h-5 text-accent-600 shrink-0" />
          <p className="text-sm font-semibold text-accent-700">
            You&apos;re saving ${totalSaved.toFixed(2)} on this order!
          </p>
        </div>
      )}

      {/* Order Summary */}
      <div className="border border-brand-200 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-brand-900">Order Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-500">Subtotal</span>
            {cart.cost?.subtotalAmount && (
              <Money data={cart.cost.subtotalAmount} className="font-semibold" />
            )}
          </div>

          {totalSaved > 0 && (
            <div className="flex justify-between">
              <span className="text-accent-600">Discounts</span>
              <span className="font-semibold text-accent-600">
                -${totalSaved.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-brand-500">Shipping</span>
            <span className="font-semibold text-accent-600">FREE</span>
          </div>

          {cart.cost?.totalTaxAmount && (
            <div className="flex justify-between">
              <span className="text-brand-500">Taxes</span>
              <Money data={cart.cost.totalTaxAmount} className="font-semibold" />
            </div>
          )}
        </div>

        <div className="border-t border-brand-200 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-brand-900">Total</span>
          {cart.cost?.totalAmount && (
            <Money
              data={cart.cost.totalAmount}
              className="text-xl font-bold text-brand-900"
            />
          )}
        </div>
      </div>

      {/* Checkout Button */}
      <a
        href={cart.checkoutUrl}
        className="flex items-center justify-center gap-2 w-full bg-accent-600 hover:bg-accent-700 text-white font-bold text-lg py-4 rounded-full transition-colors shadow-lg shadow-accent-200"
      >
        <Lock className="w-4 h-4 text-white" />
        <span className="text-white">Secure Checkout</span>
        <ArrowRight className="w-5 h-5 text-white" />
      </a>
      <div className="text-center">
        <a href="/cart" className="text-sm text-brand-500 hover:text-brand-700" style={{textDecoration: 'underline'}}>
          Go to cart
        </a>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          {icon: Lock, label: 'SSL Secure'},
          {icon: RotateCcw, label: '30-Day Returns'},
          {icon: Truck, label: 'Fast Delivery'},
        ].map(({icon: Icon, label}) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-brand-600" />
            </div>
            <span className="text-xs text-brand-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-2">
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{discountCodes: codes}}
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            aria-label="Discount code"
            className="flex-1 min-w-0 px-3 py-2.5 border-2 border-brand-200 rounded-lg focus:border-brand-900 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="btn-secondary py-2.5 px-3 text-sm rounded-lg whitespace-nowrap shrink-0"
          >
            Apply
          </button>
        </div>
      </CartForm>

      {codes.map((code) => (
        <div
          key={code}
          className="flex items-center justify-between px-4 py-3 bg-accent-50 border border-accent-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent-600" />
            <span className="font-semibold text-accent-700">{code}</span>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{discountCodes: codes.filter((c) => c !== code)}}
          >
            <button
              type="submit"
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              Remove
            </button>
          </CartForm>
        </div>
      ))}
    </div>
  );
}
