import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ShoppingBag, Check, Loader} from 'lucide-react';

interface AddToCartButtonProps {
  available: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  analytics?: unknown;
}

export function AddToCartButton({
  available,
  lines,
  onClick,
  analytics,
}: AddToCartButtonProps) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isAdding = fetcher.state !== 'idle';

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <div className="space-y-3">
              <button
                type="submit"
                onClick={onClick}
                disabled={!available || isAdding}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  available && !isAdding
                    ? 'bg-brand-900 hover:bg-brand-800 text-white'
                    : 'bg-brand-200 text-brand-400 cursor-not-allowed'
                }`}
              >
                {isAdding ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Adding to Cart...
                  </>
                ) : available ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>

              {available && (
                <button
                  type="button"
                  className="w-full py-4 border-2 border-brand-900 rounded-lg font-bold text-lg hover:bg-brand-900 hover:text-white transition-all"
                >
                  Buy Now
                </button>
              )}
            </div>
          </>
        );
      }}
    </CartForm>
  );
}
