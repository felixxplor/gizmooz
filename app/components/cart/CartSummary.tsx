import {CartForm, Money} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {ArrowRight, Tag} from 'lucide-react';

type CartMainProps = {
  cart: CartApiQueryFragment;
  layout: 'page' | 'aside';
};

export function CartSummary({cart, layout}: CartMainProps) {
  return (
    <div
      className={`space-y-4 ${layout === 'aside' ? 'sticky bottom-0 bg-white pt-4 border-t border-brand-200' : 'mt-8'}`}
    >
      {/* Discount Code */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* Summary */}
      <div className="bg-brand-50 rounded-lg p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-brand-500">Subtotal</span>
          <Money data={cart.cost.subtotalAmount} className="font-semibold" />
        </div>

        {cart.cost.totalTaxAmount && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">Taxes</span>
            <Money data={cart.cost.totalTaxAmount} className="font-semibold" />
          </div>
        )}

        <div className="border-t border-brand-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-brand-900">Total</span>
          <Money
            data={cart.cost.totalAmount}
            className="text-2xl font-bold text-brand-900"
          />
        </div>
      </div>

      {/* Checkout Button */}
      <a
        href={cart.checkoutUrl}
        className="w-full btn-primary py-4 text-lg"
      >
        Proceed to Checkout
        <ArrowRight className="w-5 h-5" />
      </a>

      {/* Mobile Sticky Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 p-4 flex items-center justify-between sm:hidden z-40">
        <div>
          <span className="text-sm text-brand-500">Total</span>
          <Money
            data={cart.cost.totalAmount}
            className="text-lg font-bold text-brand-900"
          />
        </div>
        <a
          href={cart.checkoutUrl}
          className="btn-primary py-3 px-6"
        >
          Checkout
          <ArrowRight className="w-4 h-4" />
        </a>
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
      {/* Discount Code Form - visible by default */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{
          discountCodes: codes,
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            aria-label="Discount code"
            className="flex-1 px-4 py-3 border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="btn-primary py-3 px-6 text-sm"
          >
            Apply
          </button>
        </div>
      </CartForm>

      {/* Applied Discounts */}
      {codes.map((code) => (
        <div
          key={code}
          className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-800">{code}</span>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
              discountCodes: codes.filter((c) => c !== code),
            }}
          >
            <button
              type="submit"
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Remove
            </button>
          </CartForm>
        </div>
      ))}
    </div>
  );
}
