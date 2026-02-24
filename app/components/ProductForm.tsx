import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {useMemo} from 'react';
import {Minus, Plus} from 'lucide-react';
import {Money} from '@shopify/hydrogen';

export function ProductForm({
  productOptions,
  selectedVariant,
  quantity,
  setQuantity,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name}>
            <h5 className="text-sm font-bold text-brand-900 mb-3">
              {option.name}
            </h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '2px solid var(--color-brand-900)'
                          : '2px solid transparent',
                        opacity: available ? 1 : 0.3,
                        textDecoration: !available ? 'line-through' : 'none',
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '2px solid var(--color-brand-900)'
                          : '2px solid transparent',
                        opacity: available ? 1 : 0.3,
                        textDecoration: !available && exists ? 'line-through' : 'none',
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity Selector */}
      <div>
        <h5 className="text-sm font-bold text-brand-900 mb-3">Quantity</h5>
        <div className="inline-flex items-center border-2 border-brand-300 rounded-lg">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-brand-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[3rem] text-center font-semibold text-brand-900">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-brand-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buy More, Save More */}
      {selectedVariant?.price && (
        <BuyMoreSaveMore
          price={parseFloat(selectedVariant.price.amount)}
          currencyCode={selectedVariant.price.currencyCode}
          quantity={quantity}
          onSelectTier={(qty) => setQuantity(qty)}
        />
      )}

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
      </AddToCartButton>
    </div>
  );
}

const TIERS = [
  {qty: 1, discount: 0, label: null},
  {qty: 2, discount: 0.1, label: 'MOST POPULAR'},
  {qty: 3, discount: 0.15, label: null},
];

function BuyMoreSaveMore({
  price,
  currencyCode,
  quantity,
  onSelectTier,
}: {
  price: number;
  currencyCode: string;
  quantity: number;
  onSelectTier: (qty: number) => void;
}) {
  return (
    <div>
      <h5 className="text-sm font-bold text-brand-900 mb-3">
        Buy More, Save More!
      </h5>
      <div className="space-y-3">
        {TIERS.map((tier) => {
          const isSelected = quantity === tier.qty;
          const perItem = price * (1 - tier.discount);
          const totalPrice = perItem * tier.qty;
          const totalSaved = price * tier.qty - totalPrice;

          return (
            <button
              key={tier.qty}
              type="button"
              onClick={() => onSelectTier(tier.qty)}
              className={`w-full text-left rounded-lg border-2 p-4 transition-colors cursor-pointer ${
                isSelected
                  ? 'border-brand-900 bg-brand-50'
                  : 'border-brand-200 hover:border-brand-400'
              }`}
            >
              {tier.label && (
                <span className="text-xs font-bold uppercase tracking-wider text-accent-600 mb-1 block">
                  {tier.label}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-brand-900' : 'border-brand-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-brand-900" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-brand-900">
                    BUY {tier.qty} {tier.discount > 0 ? `WITH ${tier.discount * 100}% OFF` : `FOR $${price.toFixed(2)}`}
                  </span>
                </div>

                {tier.discount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-400 line-through">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-brand-900">
                        ${perItem.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-brand-500">
                      Total: ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {tier.discount > 0 && totalSaved > 0 && (
                <div className="mt-2">
                  <span className="inline-block text-xs font-bold text-white bg-accent-600 px-3 py-1 rounded-full">
                    save: ${totalSaved.toFixed(2)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
