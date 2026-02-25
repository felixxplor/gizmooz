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
import type {Route} from './+types/($locale).collections.$handle';
import {useState} from 'react';

export const meta: Route.MetaFunction = ({data}) => {
  const collection = data?.collection;
  const title = collection?.title ?? '';
  const description = collection?.description ?? '';
  const url = `/collections/${collection?.handle ?? ''}`;

  return [
    {title: `Gizmody | ${title} Collection`},
    ...(description ? [{name: 'description', content: description}] : []),
    {rel: 'canonical', href: url},
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: `${title} Collection`},
    ...(description
      ? [{property: 'og:description', content: description}]
      : []),
    {property: 'og:url', content: url},
  ];
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

  const [{collection}, {collections}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey,
        reverse,
        filters,
        ...paginationVariables,
      },
    }),
    storefront.query(FILTER_COLLECTIONS_QUERY),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    collections: collections.nodes,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, collections} = useLoaderData<typeof loader>();
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
    void navigate(`?${params.toString()}`, {replace: true, preventScrollReset: true});
  };

  return (
    <div className="bg-white">
      <CollectionHeader collection={collection} />

      <div className="section-container py-8">
        <CollectionBreadcrumbs collectionTitle={collection.title} />

        <CollectionToolbar
          productCount={collection.products.nodes.length}
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
          {/* Desktop Sidebar Filters */}
          <aside
            className={`hidden lg:block flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
              showDesktopFilters ? 'w-64 mr-8 opacity-100' : 'w-0 mr-0 opacity-0'
            }`}
          >
            <div className="w-64">
              <FilterSidebar collections={collections} />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            collections={collections}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
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
