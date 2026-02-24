import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {CollectionHeader} from '~/components/collection/CollectionHeader';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Gizmody | Our Collections'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader
        collection={{title: 'Our Collections', description: 'Browse all our curated collections'}}
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
              <span className="text-brand-900 font-medium" aria-current="page">
                Collections
              </span>
            </li>
          </ol>
        </nav>

        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {({node: collection, index}) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group"
    >
      <div className="bg-white rounded-lg overflow-hidden border border-brand-200 hover:shadow-lg transition-shadow">
        {collection?.image ? (
          <div className="aspect-[4/3] relative overflow-hidden bg-brand-50">
            <Image
              alt={collection.image.altText || collection.title}
              data={collection.image}
              loading={index < 3 ? 'eager' : undefined}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-brand-100 flex items-center justify-center">
            <span className="text-brand-400 text-lg">No Image</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-brand-900 text-lg group-hover:text-accent-600 transition-colors">
            {collection.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
