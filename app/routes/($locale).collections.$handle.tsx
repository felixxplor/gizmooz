import {redirect, useLoaderData, useSearchParams, useNavigate} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {CollectionHeader} from '~/components/collection/CollectionHeader';
import {CollectionBreadcrumbs} from '~/components/collection/CollectionBreadcrumbs';
import {CollectionToolbar} from '~/components/collection/CollectionToolbar';
import {FilterSidebar} from '~/components/collection/FilterSidebar';
import {MobileFilterDrawer} from '~/components/collection/MobileFilterDrawer';
import {ProductCard} from '~/components/collection/ProductCard';
import type {Route} from '../+types/root';
import {useState} from 'react';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Gizmooz | ${data?.collection.title ?? ''} Collection`}];
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
      return {sortKey: 'CREATED', reverse: true};
    case 'featured':
    default:
      return {sortKey: 'COLLECTION_DEFAULT', reverse: false};
  }
}

function buildProductFilters(searchParams: URLSearchParams) {
  const filters: any[] = [];

  const available = searchParams.get('available');
  if (available === 'true') {
    filters.push({available: true});
  }

  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin || priceMax) {
    const priceFilter: any = {};
    if (priceMin) priceFilter.min = parseFloat(priceMin);
    if (priceMax) priceFilter.max = parseFloat(priceMax);
    filters.push({price: priceFilter});
  }

  return filters.length > 0 ? filters : undefined;
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const url = new URL(request.url);
  const {sortKey, reverse} = getSortValuesFromParam(url.searchParams.get('sort'));
  const filters = buildProductFilters(url.searchParams);

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey,
        reverse,
        filters,
        ...paginationVariables,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const sortBy = searchParams.get('sort') || 'featured';

  const activeFilterCount = [
    searchParams.get('available'),
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
    navigate(`?${params.toString()}`, {replace: true});
  };

  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader collection={collection} />

      <div className="section-container py-8">
        <CollectionBreadcrumbs collectionTitle={collection.title} />

        <CollectionToolbar
          productCount={collection.products.nodes.length}
          showFilters={showDesktopFilters}
          onToggleFilters={() => {
            setShowDesktopFilters(!showDesktopFilters);
            setShowMobileFilters(!showMobileFilters);
          }}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          gridCols={gridCols}
          onGridChange={setGridCols}
          activeFilterCount={activeFilterCount}
        />

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          {showDesktopFilters && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>
          )}

          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <PaginatedResourceSection<ProductItemFragment>
              connection={collection.products}
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

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse,
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
