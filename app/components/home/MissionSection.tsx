import {Link} from 'react-router';
import {CheckCircle, Award, Shield, Zap} from 'lucide-react';

export function MissionSection() {
  return (
    <section className="py-16 sm:py-20 bg-brand-50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-6">
              Smarter Living Starts Here
            </h2>
            <p className="text-lg text-brand-600 mb-8 leading-relaxed">
              At Gizmooz, we believe technology should simplify your life. Our
              curated collection of premium smart devices is designed for
              seamless integration, intuitive control, and lasting quality.
              From smart home essentials to cutting-edge wearables, we bring
              you the future of everyday living.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-6 h-6 text-accent-600" />
                </div>
                <span className="font-semibold text-brand-900">Innovation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-accent-600" />
                </div>
                <span className="font-semibold text-brand-900">Performance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-accent-600" />
                </div>
                <span className="font-semibold text-brand-900">Durability</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Award className="w-6 h-6 text-accent-600" />
                </div>
                <span className="font-semibold text-brand-900">Quality</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/collections/all">
                <button className="btn-primary px-8 py-3">
                  Shop Now
                </button>
              </Link>
              <Link to="/pages/about">
                <button className="btn-secondary px-8 py-3">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-brand-200 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
                alt="Smart technology workspace"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
