import {Link, useFetchers} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Trash2, Plus, Minus, Tag, Loader} from 'lucide-react';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];
type CartMainProps = {
  layout: 'page' | 'aside';
};

export function CartLineItem({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartMainProps['layout'];
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;

  if (!product?.handle || !line.cost?.totalAmount) return null;

  const lineItemUrl = `/products/${product.handle}`;
  const {close} = useAside();

  return (
    <li className="flex gap-3 py-4 border-b border-brand-200 last:border-b-0">
      <Link
        to={lineItemUrl}
        onClick={layout === 'aside' ? close : undefined}
        className="flex-shrink-0"
      >
        {image && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-brand-50">
            <Image
              data={image}
              className="w-full h-full object-cover"
              width={80}
              height={80}
            />
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={lineItemUrl}
          onClick={layout === 'aside' ? close : undefined}
          className="block"
        >
          <h3 className="font-semibold text-sm text-brand-900 hover:text-accent-600 transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1 space-y-0.5">
          {selectedOptions.map((option) => (
            <p key={option.name} className="text-sm text-brand-500">
              {option.name}: <span className="font-medium">{option.value}</span>
            </p>
          ))}
        </div>

        {/* Price & Discount */}
        {(() => {
          const discounts = (line as any).discountAllocations || [];
          const hasDiscount = discounts.length > 0;
          const originalPrice = line.merchandise.price
            ? parseFloat(line.merchandise.price.amount) * line.quantity
            : null;
          const finalPrice = parseFloat(line.cost.totalAmount.amount);
          const totalSaved = originalPrice ? originalPrice - finalPrice : 0;
          const savePercent =
            originalPrice && totalSaved > 0
              ? Math.round((totalSaved / originalPrice) * 100)
              : 0;

          return (
            <>
              {hasDiscount && (
                <div className="mt-2 space-y-1.5">
                  {discounts.map((allocation: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1.5 rounded-lg"
                    >
                      <Tag className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span className="text-xs font-semibold text-green-700">
                        {allocation.title || allocation.code || 'Discount'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2">
                {/* Price */}
                {hasDiscount && originalPrice ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Money
                      data={line.cost.totalAmount}
                      className="text-base font-bold text-green-600"
                    />
                    <span className="text-xs text-brand-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    {savePercent > 0 && (
                      <span className="text-xs font-bold text-white bg-green-600 px-1.5 py-0.5 rounded-full">
                        -{savePercent}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  <Money
                    data={line.cost.totalAmount}
                    className="text-base font-bold text-brand-900"
                  />
                )}
                {hasDiscount && totalSaved > 0 && (
                  <p className="text-xs text-green-600 font-semibold">
                    You save ${totalSaved.toFixed(2)}!
                  </p>
                )}

                {/* Qty + Remove — own row so they never overflow */}
                <div className="flex items-center justify-between mt-2">
                  <CartLineQuantity line={line} />
                  <CartLineRemoveButton lineIds={[id]} />
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;

  const fetchers = useFetchers();
  const isUpdating = fetchers.some(
    (f) =>
      f.state !== 'idle' &&
      f.formData?.get('cartFormInput')?.toString().includes(lineId),
  );

  return (
    <div
      className={`flex items-center border-2 rounded-lg transition-opacity ${
        isUpdating ? 'border-brand-200 opacity-60' : 'border-brand-300'
      }`}
    >
      {/* Decrease */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{lines: [{id: lineId, quantity: Math.max(0, quantity - 1)}]}}
      >
        {(fetcher) => (
          <button
            type="submit"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || fetcher.state !== 'idle'}
            className="w-8 h-8 flex items-center justify-center hover:bg-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
      </CartForm>

      <span className="min-w-[2rem] text-center font-semibold">
        {isUpdating ? (
          <Loader className="w-4 h-4 animate-spin mx-auto text-brand-400" />
        ) : (
          quantity
        )}
      </span>

      {/* Increase */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{lines: [{id: lineId, quantity: quantity + 1}]}}
      >
        {(fetcher) => (
          <button
            type="submit"
            aria-label="Increase quantity"
            disabled={fetcher.state !== 'idle'}
            className="w-8 h-8 flex items-center justify-center hover:bg-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </CartForm>
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        type="submit"
        className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </CartForm>
  );
}
