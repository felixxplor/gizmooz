import type {Route} from './+types/collections.all';
import {useLoaderData, Link, useSearchParams, useNavigate} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/collection/ProductCard';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {FilterSidebar} from '~/components/collection/FilterSidebar';
import {MobileFilterDrawer} from '~/components/collection/MobileFilterDrawer';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useState} from 'react';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Gizmody | All Products'}];
};

function getSortValuesFromParam(sort: string | null) {
  switch (sort) {
    case 'price-low-high':
      return {sortKey: 'PRICE', reverse: false};
    case 'price-high-low':
      return {sortKey: 'PRICE', reverse: true};
    case 'best-selling':
      return {sortKey: 'BEST_SELLING', reverse: false};
    case 'newest':
      return {sortKey: 'CREATED_AT', reverse: true};
    case 'featured':
    default:
      return {sortKey: 'RELEVANCE', reverse: false};
  }
}

function buildProductQuery(searchParams: URLSearchParams): string | undefined {
  const parts: string[] = [];

  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin && priceMax) {
    parts.push(`variants.price:>=${priceMin} variants.price:<=${priceMax}`);
  } else if (priceMin) {
    parts.push(`variants.price:>=${priceMin}`);
  } else if (priceMax) {
    parts.push(`variants.price:<=${priceMax}`);
  }

  return parts.length > 0 ? parts.join(' ') : undefined;
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const {sortKey, reverse} = getSortValuesFromParam(url.searchParams.get('sort'));
  const query = buildProductQuery(url.searchParams);

  const [{products}, {collections}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {sortKey, reverse, query, ...paginationVariables},
    }),
    storefront.query(FILTER_COLLECTIONS_QUERY),
  ]);
  return {products, collections: collections.nodes};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function AllProducts() {
  const {products, collections} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const sortBy = searchParams.get('sort') || 'featured';

  const activeFilterCount = [
    searchParams.get('price_min'),
    searchParams.get('price_max'),
  ].filter(Boolean).length;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    navigate(`?${params.toString()}`, {replace: true, preventScrollReset: true});
  };

  return (
    <div className="bg-white">
      <CollectionHeader
        collection={{title: 'All Products', description: 'Browse our entire catalog'}}
      />

      <div className="section-container py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-brand-500">
            <li>
              <Link to="/" className="hover:text-brand-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/collections" className="hover:text-brand-900 transition-colors">
                Collections
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-brand-900 font-medium" aria-current="page">
                All Products
              </span>
            </li>
          </ol>
        </nav>

        <CollectionToolbar
          productCount={products.nodes.length}
          showFilters={showDesktopFilters}
          onToggleFilters={() => {
            if (window.innerWidth >= 1024) {
              setShowDesktopFilters(!showDesktopFilters);
            } else {
              setShowMobileFilters(!showMobileFilters);
            }
          }}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          gridCols={gridCols}
          onGridChange={setGridCols}
          activeFilterCount={activeFilterCount}
        />

        <div className="flex gap-0">
          <aside
            className={`hidden lg:block flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
              showDesktopFilters ? 'w-64 mr-8 opacity-100' : 'w-0 mr-0 opacity-0'
            }`}
          >
            <div className="w-64">
              <FilterSidebar collections={collections} />
            </div>
          </aside>

          <MobileFilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            collections={collections}
          />

          <div className="flex-1 min-w-0">
            <PaginatedResourceSection<ProductItemFragment>
              connection={products}
              resourcesClassName={`grid grid-cols-2 ${
                gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
              } gap-6`}
            >
              {({node: product, index}) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          ...MoneyProductItem
        }
        compareAtPrice {
          ...MoneyProductItem
        }
      }
    }
    metafield(namespace: "custom", key: "reviews") {
      references(first: 50) {
        nodes {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse,
      query: $query
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

const FILTER_COLLECTIONS_QUERY = `#graphql
  query FilterCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 20, sortKey: TITLE) {
      nodes {
        handle
        title
      }
    }
  }
` as const;
