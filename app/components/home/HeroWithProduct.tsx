import {Link} from 'react-router';
import heroImage from '~/assets/new.jpg';

const HERO_IMAGE = heroImage;

export function HeroWithProduct() {
  return (
    <section className="relative h-[50vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden bg-brand-900">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Gizmody — modern lifestyle products"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content — bottom left */}
      <div className="relative h-full flex items-end">
        <div className="section-container w-full pb-10 sm:pb-14">
          <div className="max-w-xl text-white flex flex-col items-start gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Elevate Your Everyday
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-md">
              Gizmody brings you thoughtfully curated gadgets, home decor, and lifestyle essentials designed for modern living.
            </p>
            <div className="pt-2">
              <Link
                to="/collections/all"
                className="inline-block bg-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-brand-100 transition-colors"
                style={{color: '#18181b'}}
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
