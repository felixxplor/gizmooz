import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

interface RecommendedProductsProps {
  products: Promise<any>;
  title?: string;
}

export function RecommendedProducts({
  products,
  title = 'You May Also Like',
}: RecommendedProductsProps) {
  return (
    <section className="py-16 sm:py-20 bg-brand-50">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-brand-900">
          {title}
        </h2>

        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <Await resolve={products}>
            {(response) => {
              if (!response?.products?.nodes?.length) {
                return null;
              }

              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {response.products.nodes.map((product: any) => (
                    <RecommendedProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function RecommendedProductCard({product}: {product: any}) {
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
            />
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <Money
            data={product.priceRange.minVariantPrice}
            className="text-lg font-bold text-brand-900"
          />
        </div>
      </div>
    </Link>
  );
}

function RecommendedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-brand-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-brand-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-brand-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
