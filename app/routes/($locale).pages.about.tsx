import {Link} from 'react-router';
import type {Route} from './+types/pages.about';

export const meta: Route.MetaFunction = () => {
  return [{title: 'About Us | Gizmody'}];
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="section-container" style={{paddingTop: '6rem', paddingBottom: '6rem'}}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div style={{marginBottom: '3rem'}}>
            <span className="text-accent-600 text-sm font-semibold tracking-widest uppercase">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-900 leading-tight" style={{marginTop: '1rem'}}>
              We Find the Gadgets You Didn't Know You Needed
            </h1>
            <div className="bg-accent-600 rounded-full" style={{width: '4rem', height: '4px', marginTop: '2rem'}} />
          </div>

          {/* Body */}
          <div className="text-brand-600 text-lg leading-relaxed" style={{marginBottom: '4rem'}}>
            <p style={{marginBottom: '1.5rem'}}>
              Gizmody started with a frustration we kept running into — brilliant products existed all over the world, but Australians either couldn't get them, or had to wade through endless low-quality knockoffs to find the real deal.
            </p>
            <p style={{marginBottom: '1.5rem'}}>
              So we built the store we always wanted to shop from. One that curates only the best, tests before listing, and stands behind every product with genuine support and fair policies.
            </p>
            <p style={{marginBottom: '1.5rem'}}>
              We're proudly Australian-owned, and every product we carry earns its place by being genuinely useful, well-made, and worth your money — not because it looks impressive in a photo.
            </p>
            <p>
              Today, Gizmody ships thousands of orders across Australia each month. Whether it's a personal care device that saves you a salon visit or an ambient light that transforms your space, our goal is always the same: smarter living, made simple.
            </p>
          </div>

          {/* Stats */}
          <div className="border-t border-brand-200 grid grid-cols-3 gap-6 text-center" style={{paddingTop: '3rem', marginBottom: '3rem'}}>
            {[
              {stat: '5,000+', label: 'Happy Customers'},
              {stat: '30 Days', label: 'Free Returns'},
              {stat: '1 Year', label: 'Warranty'},
            ].map(({stat, label}) => (
              <div key={label}>
                <p className="text-3xl font-bold text-brand-900">{stat}</p>
                <p className="text-sm text-brand-400" style={{marginTop: '0.5rem'}}>{label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/collections/all" className="btn-primary px-8 py-4">
            Shop All Products
          </Link>

        </div>
      </section>
    </div>
  );
}
