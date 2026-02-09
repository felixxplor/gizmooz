import {Link} from 'react-router';

interface BreadcrumbsProps {
  collectionTitle: string;
}

export function CollectionBreadcrumbs({collectionTitle}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-brand-500">
        <li>
          <Link to="/" className="hover:text-brand-900 transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            to="/collections"
            className="hover:text-brand-900 transition-colors"
          >
            Collections
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span className="text-brand-900 font-medium" aria-current="page">
            {collectionTitle}
          </span>
        </li>
      </ol>
    </nav>
  );
}
