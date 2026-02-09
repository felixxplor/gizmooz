import {Shield, Truck, RotateCcw} from 'lucide-react';
import {Money} from '@shopify/hydrogen';

interface ProductInfoProps {
  title: string;
  vendor: string;
  price: any;
  compareAtPrice?: any;
}

export function ProductInfo({
  title,
  vendor,
  price,
  compareAtPrice,
}: ProductInfoProps) {
  return (
    <div className="space-y-4">
      {/* Vendor */}
      <div className="text-sm text-brand-500 font-medium uppercase tracking-wide">
        {vendor}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-900">{title}</h1>

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
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-brand-200">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-brand-900">2-Year Warranty</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-brand-900">Free Shipping</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-accent-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-brand-900">60-Day Returns</p>
        </div>
      </div>
    </div>
  );
}
