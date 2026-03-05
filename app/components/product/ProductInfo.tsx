import {Shield, Truck, RotateCcw, Star} from 'lucide-react';
import {Money} from '@shopify/hydrogen';

interface ProductInfoProps {
  title: string;
  price: any;
  compareAtPrice?: any;
  reviewAverage?: number;
  reviewCount?: number;
}

export function ProductInfo({
  title,
  price,
  compareAtPrice,
  reviewAverage,
  reviewCount,
}: ProductInfoProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-900">{title}</h1>

      {/* Rating */}
      {reviewAverage !== undefined &&
        reviewCount !== undefined &&
        reviewCount > 0 && (
          <a
            href="#reviews"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById('reviews')
                ?.scrollIntoView({behavior: 'smooth'});
            }}
            className="flex items-center gap-2 w-fit hover:opacity-75 transition-opacity"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-4 h-4 ${n <= Math.round(reviewAverage) ? 'fill-amber-400 text-amber-400' : 'text-brand-200'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-brand-900">
              {reviewAverage}
            </span>
            <span className="text-sm text-brand-400">·</span>
            <span className="text-sm text-brand-400 underline">
              {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </span>
          </a>
        )}

      {/* Price */}
      <div className="flex items-center gap-3">
        <Money data={price} className="text-3xl font-bold text-brand-900" />
        {compareAtPrice && (
          <Money
            data={compareAtPrice}
            className="text-xl text-brand-400 line-through"
          />
        )}
        {compareAtPrice && (
          <span className="px-3 py-1 bg-red-100 text-error text-sm font-bold rounded-full">
            Save{' '}
            {Math.round(
              ((compareAtPrice.amount - price.amount) / compareAtPrice.amount) *
                100,
            )}
            %
          </span>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 py-3 border-y border-brand-200">
        {[
          {icon: Shield, label: '1-Year Warranty'},
          {icon: Truck, label: 'Free Shipping'},
          {icon: RotateCcw, label: '30-Day Returns'},
        ].map(({icon: Icon, label}) => (
          <div key={label} className="flex items-center justify-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-accent-50 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-accent-600" />
            </div>
            <p className="text-xs font-medium text-brand-900">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
