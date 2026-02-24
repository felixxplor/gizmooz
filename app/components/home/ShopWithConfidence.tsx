import {Truck, RotateCcw, ShieldCheck} from 'lucide-react';

const policies = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'Enjoy free standard shipping on all orders within Australia, no minimum purchase required.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    desc: 'Not completely satisfied? Return any item within 30 days for a full refund or exchange.',
  },
  {
    icon: ShieldCheck,
    title: '1 Year Warranty',
    desc: 'All our products come with a comprehensive 1-year warranty for your peace of mind.',
  },
];

export function ShopWithConfidence() {
  return (
    <section className="py-10 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="border-t border-brand-100 pt-8 sm:pt-14 mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-2 sm:mb-3 text-center">
            Shop With Confidence
          </h2>
          <p className="text-brand-500 text-sm sm:text-base text-center">
            At Gizmody, we stand behind our products and services with policies
            that put you first.
          </p>
        </div>

        {/* Mobile: compact horizontal rows. Desktop: 3-col centered cards */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-8">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center"
            >
              <div className="flex-none w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent-50 flex items-center justify-center sm:mb-4">
                <policy.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-900 text-sm sm:text-base sm:mb-2">
                  {policy.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-500 leading-relaxed">
                  {policy.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b border-brand-100 mt-8 sm:mt-14" />
      </div>
    </section>
  );
}
