import {BadgeCheck, Award, Shield, Truck, RotateCcw} from 'lucide-react';

const features = [
  {
    icon: BadgeCheck,
    title: 'Premium Quality',
    desc: "For over 5 years, Gizmody's mission has remained the same — to deliver premium smart technology.",
  },
  {
    icon: Award,
    title: 'Certified Excellence',
    desc: 'We are the trusted leaders in premium tech, dedicated to innovation and quality.',
  },
  {
    icon: Shield,
    title: '2-5 Year Warranty',
    desc: 'Every product is covered by an industry-leading 2-year or 5-year warranty.',
  },
  {
    icon: Truck,
    title: 'Fast & Secure Shipping',
    desc: 'Orders ship the same or next day, with package protection for peace of mind.',
  },
  {
    icon: RotateCcw,
    title: '60 Day Guarantee',
    desc: 'We offer a 60-day trial period to make sure you love your new gear.',
  },
];

export function FeatureBanner() {
  return (
    <section className="bg-brand-900 py-10 sm:py-12">
      <div className="section-container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-800 mb-3">
                <feature.icon className="w-5 h-5 text-brand-300" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs text-brand-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
