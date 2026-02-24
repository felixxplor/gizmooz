import {Suspense} from 'react';
import {Await} from 'react-router';
import {ProductCard} from '~/components/collection/ProductCard';

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
                    <ProductCard
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
