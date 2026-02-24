import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ShoppingBag, Loader} from 'lucide-react';

export function AddToCartButton({
  analytics,
  children,
  className,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
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
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? isAdding}
              className={`${className || 'w-full btn-primary py-4 text-lg'} inline-flex items-center justify-center gap-2 cursor-pointer rounded-full`}
            >
              {isAdding ? (
                <>
                  <Loader className="w-4 h-4 animate-spin shrink-0" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  {!className && <ShoppingBag className="w-5 h-5 shrink-0" />}
                  {children}
                </>
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
