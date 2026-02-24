import {Link} from 'react-router';
import {CheckCircle, Award, Shield, Zap} from 'lucide-react';

const features = [
  {icon: CheckCircle, label: 'Innovation', desc: 'Always ahead of the curve'},
  {icon: Zap, label: 'Performance', desc: 'Built for speed & reliability'},
  {icon: Shield, label: 'Durability', desc: 'Made to last, guaranteed'},
  {icon: Award, label: 'Quality', desc: 'Premium in every detail'},
];

export function MissionSection() {
  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-brand-50 overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text content */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 mb-2">
              Why Gizmody
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-5xl font-bold text-brand-900 mb-3 leading-[1.1]">
              Smarter Living<br />Starts Here
            </h2>

            <p className="text-brand-500 text-sm sm:text-lg leading-relaxed mb-6 max-w-lg">
              We believe technology should simplify your life. Our curated
              collection of premium smart devices is designed for seamless
              integration, intuitive control, and lasting quality.
            </p>

            {/* Feature list — 2-col grid on mobile */}
            <div className="grid grid-cols-2 gap-2 mb-6 sm:gap-4 sm:mb-10">
              {features.map(({icon: Icon, label, desc}) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 shadow-sm border border-brand-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900 text-xs leading-tight">
                      {label}
                    </p>
                    <p className="text-[11px] text-brand-400 mt-0.5 leading-tight">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Link
                to="/collections/all"
                className="btn-accent py-3 px-6 text-sm font-semibold rounded-xl text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/pages/about"
                className="btn-secondary py-3 px-6 text-sm font-semibold rounded-xl text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image collage — desktop only */}
          <div className="relative hidden lg:block">
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-40" />

            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=900&fit=crop&q=80"
                alt="Modern lifestyle products"
                className="w-full aspect-4/5 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-6 bottom-16 z-20 bg-white rounded-2xl shadow-xl p-5 min-w-[180px]">
              <div className="text-3xl font-bold text-brand-900">10k+</div>
              <div className="text-sm text-brand-500 mt-1">Happy customers</div>
              <div className="flex -space-x-2 mt-3">
                {[1, 5, 8, 12].map((img) => (
                  <img
                    key={img}
                    src={`https://i.pravatar.cc/64?img=${img}`}
                    alt="Customer"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <div className="w-8 h-8 rounded-full bg-accent-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-accent-600">
                  +
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-12 z-20 bg-white rounded-2xl shadow-xl px-5 py-4">
              <div className="text-amber-400 text-lg tracking-wider">★★★★★</div>
              <div className="text-xs text-brand-500 mt-1.5">4.9 avg rating</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
