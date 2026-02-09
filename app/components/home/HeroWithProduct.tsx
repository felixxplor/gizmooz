import {Link} from 'react-router';

interface HeroWithProductProps {
  product?: {
    title: string;
    handle: string;
    featuredImage?: {
      url: string;
      altText?: string;
      width: number;
      height: number;
    };
    priceRange?: {minVariantPrice: {amount: string; currencyCode: string}};
  } | null;
}

export function HeroWithProduct({product}: HeroWithProductProps) {
  return (
    <section className="relative h-[45vh] sm:h-[50vh] lg:h-[55vh] overflow-hidden bg-brand-900">
      {/* Background */}
      {product?.featuredImage ? (
        <div className="absolute inset-0">
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-brand-900" />
      )}

      {/* Content — bottom left */}
      <div className="relative h-full flex items-end">
        <div className="section-container w-full pb-10 sm:pb-14">
          <div className="max-w-lg text-white flex flex-col items-start gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {product?.title || 'Premium Smart Technology'}
            </h1>
            <p className="text-sm sm:text-base text-white/70">
              Discover innovative tech designed for modern living.
            </p>
            <div className="pt-2">
              <Link
                to={product ? `/products/${product.handle}` : '/collections/all'}
                className="inline-block bg-white text-brand-900 text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-brand-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
