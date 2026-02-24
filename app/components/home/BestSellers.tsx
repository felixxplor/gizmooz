import {Suspense, useRef} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight, Star} from 'lucide-react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

interface BestSellersProps {
  products: Promise<RecommendedProductsQuery | null>;
}

export function BestSellers({products}: BestSellersProps) {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="section-container">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-900 mb-6">
          Best Sellers
        </h2>

        <Suspense fallback={<ProductCarouselSkeleton />}>
          <Await resolve={products}>
            {(response) =>
              response?.products.nodes ? (
                <ProductCarousel products={response.products.nodes} />
              ) : null
            }
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function ProductCarousel({products}: {products: any[]}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 280;
    const amount = direction === 'left' ? -cardWidth - 24 : cardWidth + 24;
    scrollRef.current.scrollBy({left: amount, behavior: 'smooth'});
  };

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-brand-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-brand-50"
      >
        <ChevronLeft className="w-5 h-5 text-brand-900" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-brand-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-brand-50"
      >
        <ChevronRight className="w-5 h-5 text-brand-900" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {products.map((product) => (
          <BestSellerCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
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

function BestSellerCard({product}: {product: any}) {
  const {open} = useAside();
  const firstVariant = product.variants?.nodes?.[0];
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const saveAmount = isOnSale
    ? Math.round(parseFloat(compareAtPrice.amount) - parseFloat(price.amount))
    : 0;
  const {average: reviewAverage, count: reviewCount} = getReviewStats(product);

  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px] group">
      {/* Image */}
      <Link to={`/products/${product.handle}`} prefetch="intent">
        <div className="relative aspect-square bg-brand-50 rounded-lg overflow-hidden mb-3">
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="280px"
            />
          )}
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-accent-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              Save ${saveAmount}
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${product.handle}`}
            prefetch="intent"
            className="flex-1 min-w-0"
          >
            <h3 className="text-sm font-semibold text-brand-900 group-hover:text-accent-600 transition-colors line-clamp-2 leading-tight">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            <Money
              data={price}
              className="text-sm font-bold text-brand-900"
            />
            {isOnSale && (
              <Money
                data={compareAtPrice}
                className="text-xs text-brand-400 line-through"
              />
            )}
          </div>
        </div>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
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

        {/* Add to Cart */}
        {firstVariant ? (
          <AddToCartButton
            lines={[
              {
                merchandiseId: firstVariant.id,
                quantity: 1,
                selectedVariant: firstVariant,
              },
            ]}
            onClick={() => open('cart')}
            className="w-full py-2.5 bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-800 transition-colors text-center"
          >
            Add to Cart
          </AddToCartButton>
        ) : (
          <Link
            to={`/products/${product.handle}`}
            className="block w-full py-2.5 bg-brand-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-800 transition-colors text-center"
          >
            View Product
          </Link>
        )}
      </div>
    </div>
  );
}

function ProductCarouselSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[280px] animate-pulse">
          <div className="aspect-square bg-brand-200 rounded-lg mb-3" />
          <div className="h-4 bg-brand-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-brand-200 rounded w-1/2 mb-3" />
          <div className="h-10 bg-brand-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
