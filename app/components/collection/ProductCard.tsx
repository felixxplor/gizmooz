import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';

interface ProductCardProps {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}

export function ProductCard({product, loading}: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group"
    >
      <div className="bg-white rounded-lg overflow-hidden border border-brand-200 hover:shadow-lg transition-shadow">
        {product.featuredImage && (
          <div className="aspect-square relative overflow-hidden bg-brand-50">
            <Image
              data={product.featuredImage}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              loading={loading}
            />
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <Money
              data={product.priceRange.minVariantPrice}
              className="text-lg font-bold text-brand-900"
            />
            {product.priceRange.minVariantPrice.amount !==
              product.priceRange.maxVariantPrice.amount && (
              <span className="text-sm text-brand-400 line-through">
                <Money data={product.priceRange.maxVariantPrice} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
