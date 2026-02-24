import {useLoaderData} from 'react-router';
import type {Route} from './+types/search';
import {
  getPaginationVariables,
  Analytics,
  Image,
  Money,
  Pagination,
} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchInput} from '~/components/search/SearchInput';
import {Link} from 'react-router';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import type {
  RegularSearchQuery,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import {
  ArrowLeft,
  FileText,
  FolderOpen,
  Package,
  Search,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const term = (data as any)?.term || '';
  return [{title: `${term ? `Search: ${term} | ` : ''}Gizmody`}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> =
    isPredictive
      ? predictiveSearch({request, context})
      : regularSearch({request, context});

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>();

  // Type guard
  const isPredictive = (data: any): data is PredictiveSearchReturn => {
    return data.type === 'predictive';
  };

  if (isPredictive(data)) return null;

  // Now TypeScript knows it's RegularSearchReturn
  const {term, result, error} = data;
  const totalResults = result?.total || 0;
  const hasResults = totalResults > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="bg-brand-900 py-12">
        <div className="section-container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Search
          </h1>

          {/* Search Form */}
          <SearchForm action="/search">
            {({inputRef}) => (
              <SearchInput
                value={term}
                inputRef={inputRef}
                placeholder="Search products, collections, articles..."
              />
            )}
          </SearchForm>
        </div>
      </div>

      {/* Search Results */}
      <div className="section-container py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {term && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-900">
              {hasResults ? (
                <>
                  {totalResults} {totalResults === 1 ? 'result' : 'results'}{' '}
                  for &ldquo;{term}&rdquo;
                </>
              ) : (
                <>No results for &ldquo;{term}&rdquo;</>
              )}
            </h2>
          </div>
        )}

        {!term || !hasResults ? (
          <EmptyState term={term} />
        ) : (
          <div className="space-y-12">
            {/* Products */}
            {result?.items?.products?.nodes?.length > 0 && (
              <SearchProductsSection
                products={result.items.products}
                term={term}
              />
            )}

            {/* Pages */}
            {result?.items?.pages?.nodes?.length > 0 && (
              <SearchPagesSection
                pages={result.items.pages.nodes}
                term={term}
              />
            )}

            {/* Articles */}
            {result?.items?.articles?.nodes?.length > 0 && (
              <SearchArticlesSection
                articles={result.items.articles.nodes}
                term={term}
              />
            )}
          </div>
        )}
      </div>

      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

function EmptyState({term}: {term: string}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-brand-400" />
      </div>

      {term ? (
        <>
          <h3 className="text-2xl font-bold text-brand-900 mb-2">
            No results found
          </h3>
          <p className="text-brand-500 mb-8 max-w-md">
            We couldn&apos;t find any results for &ldquo;{term}&rdquo;. Try
            searching with different keywords.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-brand-900 mb-2">
            Start searching
          </h3>
          <p className="text-brand-500 mb-8 max-w-md">
            Enter a search term above to find products, pages, and articles.
          </p>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <Link
          to="/collections/smart-home"
          className="p-4 border-2 border-brand-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-all text-center"
        >
          <Package className="w-8 h-8 text-accent-600 mb-2 mx-auto" />
          <p className="font-semibold text-brand-900">Smart Home</p>
        </Link>
        <Link
          to="/collections/wearables"
          className="p-4 border-2 border-brand-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-all text-center"
        >
          <Package className="w-8 h-8 text-accent-600 mb-2 mx-auto" />
          <p className="font-semibold text-brand-900">Wearables</p>
        </Link>
        <Link
          to="/collections/audio"
          className="p-4 border-2 border-brand-200 rounded-lg hover:border-accent-600 hover:bg-accent-50 transition-all text-center"
        >
          <Package className="w-8 h-8 text-accent-600 mb-2 mx-auto" />
          <p className="font-semibold text-brand-900">Audio</p>
        </Link>
      </div>
    </div>
  );
}

function SearchProductsSection({
  products,
  term,
}: {
  products: any;
  term: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center">
          <Package className="w-5 h-5 text-accent-600" />
        </div>
        <h3 className="text-2xl font-bold text-brand-900">Products</h3>
      </div>

      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nodes.map((product: any) => {
                const productUrl = urlWithTrackingParams({
                  baseUrl: `/products/${product.handle}`,
                  trackingParams: product.trackingParameters,
                  term,
                });

                const price = product?.selectedOrFirstAvailableVariant?.price;
                const image = product?.selectedOrFirstAvailableVariant?.image;

                return (
                  <Link
                    key={product.id}
                    to={productUrl}
                    prefetch="intent"
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden border border-brand-200 hover:shadow-lg transition-shadow">
                      {image && (
                        <div className="aspect-square relative overflow-hidden bg-brand-50">
                          <Image
                            data={image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <h4 className="font-semibold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                          {product.title}
                        </h4>

                        {price && (
                          <Money
                            data={price}
                            className="text-lg font-bold text-brand-900"
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <PreviousLink className="btn-secondary px-6 py-3">
                {isLoading ? 'Loading...' : 'Previous'}
              </PreviousLink>
              <NextLink className="btn-primary px-6 py-3">
                {isLoading ? 'Loading...' : 'Next'}
              </NextLink>
            </div>
          </>
        )}
      </Pagination>
    </section>
  );
}

function SearchPagesSection({pages, term}: {pages: any[]; term: string}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-brand-600" />
        </div>
        <h3 className="text-2xl font-bold text-brand-900">Pages</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page: any) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              to={pageUrl}
              prefetch="intent"
              className="flex items-center gap-4 p-4 border-2 border-brand-200 rounded-lg hover:border-brand-900 hover:bg-brand-50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-brand-900 truncate">
                  {page.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SearchArticlesSection({
  articles,
  term,
}: {
  articles: any[];
  term: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-brand-600" />
        </div>
        <h3 className="text-2xl font-bold text-brand-900">Articles</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article: any) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              to={articleUrl}
              prefetch="intent"
              className="flex items-center gap-4 p-4 border-2 border-brand-200 rounded-lg hover:border-brand-900 hover:bg-brand-50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-6 h-6 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-brand-900 truncate">
                  {article.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Queries and loader functions
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

async function regularSearch({
  request,
  context,
}: Route.LoaderArgs): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 12});
  const term = String(url.searchParams.get('q') || '');

  const {
    errors,
    ...items
  }: {errors?: Array<{message: string}>} & RegularSearchQuery =
    await storefront.query(SEARCH_QUERY, {
      variables: {...variables, term},
    });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

async function predictiveSearch({
  request,
  context,
}: Route.LoaderArgs): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  const {
    predictiveSearch: items,
    errors,
  }: PredictiveSearchQuery & {errors?: Array<{message: string}>} =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    });

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors
        .map(({message}: {message: string}) => message)
        .join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}
