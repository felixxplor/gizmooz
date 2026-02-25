import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {ShoppingBag, ArrowRight} from 'lucide-react';

interface CartEmptyProps {
  hidden: boolean;
  layout: 'page' | 'aside';
}

export function CartEmpty({hidden, layout}: CartEmptyProps) {
  const {close} = useAside();

  if (hidden) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-brand-400" />
      </div>

      <h3 className="text-2xl font-bold text-brand-900 mb-2">
        Your cart is empty
      </h3>
      <p className="text-brand-500 mb-8 max-w-sm">
        Looks like you haven&apos;t added anything yet. Let&apos;s get you started!
      </p>

      <Link
        to="/collections/all"
        onClick={layout === 'aside' ? close : undefined}
        prefetch="viewport"
        className="btn-primary px-8 py-4"
      >
        Continue Shopping
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
