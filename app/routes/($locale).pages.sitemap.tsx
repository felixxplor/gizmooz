import {Link} from 'react-router';
import type {Route} from './+types/pages.sitemap';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {
  Home,
  ShoppingBag,
  Layers,
  FileText,
  HelpCircle,
  User,
  BookOpen,
} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sitemap | Gizmody'}];
};

type SitemapLink = {label: string; to: string};
type SitemapSection = {
  title: string;
  icon: React.ReactNode;
  links: SitemapLink[];
};

const sections: SitemapSection[] = [
  {
    title: 'Main',
    icon: <Home className="w-5 h-5" />,
    links: [
      {label: 'Home', to: '/'},
      {label: 'All Products', to: '/collections/all'},
      {label: 'Search', to: '/search'},
      {label: 'Cart', to: '/cart'},
    ],
  },
  {
    title: 'Collections',
    icon: <Layers className="w-5 h-5" />,
    links: [
      {label: 'All Collections', to: '/collections'},
      {label: 'Smart Home', to: '/collections/smart-home'},
      {label: 'Wearables', to: '/collections/wearables'},
      {label: 'Audio', to: '/collections/audio'},
      {label: 'Accessories', to: '/collections/accessories'},
      {label: 'Sale', to: '/collections/sale'},
    ],
  },
  {
    title: 'Account',
    icon: <User className="w-5 h-5" />,
    links: [
      {label: 'Login', to: '/account/login'},
      {label: 'My Account', to: '/account'},
      {label: 'Orders', to: '/account/orders'},
      {label: 'Profile', to: '/account/profile'},
      {label: 'Addresses', to: '/account/addresses'},
    ],
  },
  {
    title: 'Blog',
    icon: <BookOpen className="w-5 h-5" />,
    links: [
      {label: 'All Articles', to: '/blogs/news'},
    ],
  },
  {
    title: 'Support',
    icon: <HelpCircle className="w-5 h-5" />,
    links: [
      {label: 'FAQ', to: '/pages/faq'},
      {label: 'Contact Us', to: '/pages/contact'},
      {label: 'Track Order', to: '/pages/tracking'},
      {label: 'Return Policy', to: '/pages/returns'},
    ],
  },
  {
    title: 'Company & Legal',
    icon: <FileText className="w-5 h-5" />,
    links: [
      {label: 'Terms & Conditions', to: '/pages/terms'},
      {label: 'Privacy Policy', to: '/pages/privacy'},
      {label: 'Return Policy', to: '/pages/returns'},
    ],
  },
  {
    title: 'Shopping',
    icon: <ShoppingBag className="w-5 h-5" />,
    links: [
      {label: 'All Products', to: '/collections/all'},
      {label: 'New Arrivals', to: '/collections/new-arrivals'},
      {label: 'Best Sellers', to: '/collections/best-sellers'},
      {label: 'Sale', to: '/collections/sale'},
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{
          title: 'Sitemap',
          description: 'A complete overview of all pages on Gizmody.',
        }}
      />

      <div className="section-container py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-brand-500">
            <li>
              <Link to="/" className="hover:text-brand-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-brand-900 font-medium" aria-current="page">
                Sitemap
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="border border-brand-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center text-accent-600">
                  {section.icon}
                </div>
                <h2 className="font-bold text-brand-900">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-brand-500 hover:text-accent-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-accent-400">→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
