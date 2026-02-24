import {Link, type FetcherWithComponents} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {Loader, Star} from 'lucide-react';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface ProductCardProps {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}

function getReviewStats(product: any): {average: number; count: number} {
  const nodes = product?.metafield?.references?.nodes ?? [];
  const ratings = nodes
    .map((node: any) => {
      const field = node.fields?.find((f: any) => f.key === 'rating');
      return field ? parseInt(field.value, 10) : null;
    })
    .filter((r: number | null): r is number => r !== null && !isNaN(r));
  const count = ratings.length;
  const average = count
    ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / count) * 10) / 10
    : 0;
  return {average, count};
}

export function ProductCard({product, loading}: ProductCardProps) {
  const {open} = useAside();
  const firstVariant = (product as any).variants?.nodes?.[0];
  const compareAtPrice = firstVariant?.compareAtPrice || (product as any).compareAtPriceRange?.minVariantPrice;
  const price = product.priceRange.minVariantPrice;
  const {average: reviewAverage, count: reviewCount} = getReviewStats(product);

  const hasSale =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const saveAmount = hasSale
    ? (parseFloat(compareAtPrice.amount) - parseFloat(price.amount)).toFixed(0)
    : null;

  const savePercent = hasSale
    ? Math.round(
        ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
          100,
      )
    : null;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="block"
      >
        {/* Image + Badge */}
        <div className="aspect-square relative overflow-hidden bg-brand-50">
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              loading={loading}
            />
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {hasSale && saveAmount && (
              <span className="bg-accent-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Save ${saveAmount}
              </span>
            )}
            <span className="bg-brand-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Free Shipping
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-3.5 h-3.5 ${n <= Math.round(reviewAverage) ? 'fill-amber-400 text-amber-400' : 'text-brand-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-brand-500">({reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Money
              data={price}
              className="text-lg font-bold text-brand-900"
            />
            {hasSale && (
              <>
                <span className="text-sm text-brand-400 line-through">
                  <Money data={compareAtPrice} />
                </span>
                {savePercent && (
                  <span className="text-xs font-bold text-accent-600">
                    -{savePercent}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      {firstVariant && (
        <div className="px-4 pb-4">
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{lines: [{merchandiseId: firstVariant.id, quantity: 1}]}}
          >
            {(fetcher: FetcherWithComponents<any>) => {
              const isAdding = fetcher.state !== 'idle';
              return (
                <button
                  type="submit"
                  disabled={!firstVariant.availableForSale || isAdding}
                  onClick={() => open('cart')}
                  className="w-full btn-primary py-3.5 text-sm font-bold tracking-wide rounded-full cursor-pointer inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {!firstVariant.availableForSale ? (
                    'SOLD OUT'
                  ) : isAdding ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin shrink-0" />
                      <span>ADDING...</span>
                    </>
                  ) : (
                    'ADD TO CART'
                  )}
                </button>
              );
            }}
          </CartForm>
        </div>
      )}
    </div>
  );
}
