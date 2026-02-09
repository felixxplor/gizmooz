import {Link} from 'react-router';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Trash2, Plus, Minus} from 'lucide-react';

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
  const lineItemUrl = `/products/${product.handle}`;
  const {close} = useAside();

  return (
    <li className="flex gap-4 py-6 border-b border-brand-200 last:border-b-0">
      <Link
        to={lineItemUrl}
        onClick={layout === 'aside' ? close : undefined}
        className="flex-shrink-0"
      >
        {image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-brand-50">
            <Image
              data={image}
              className="w-full h-full object-cover"
              width={96}
              height={96}
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
          <h3 className="font-semibold text-brand-900 hover:text-accent-600 transition-colors line-clamp-2">
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

        <div className="mt-3 flex items-center justify-between">
          <Money
            data={line.cost.totalAmount}
            className="text-lg font-bold text-brand-900"
          />

          <div className="flex items-center gap-3">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} />
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2 border-2 border-brand-300 rounded-lg">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          className="w-10 h-10 flex items-center justify-center hover:bg-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>

      <span className="min-w-[2rem] text-center font-semibold">{quantity}</span>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          className="w-10 h-10 flex items-center justify-center hover:bg-brand-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>
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

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
