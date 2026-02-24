import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CollectionHeader} from '~/components/collection/CollectionHeader';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Gizmody | ${data?.page.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <CollectionHeader collection={{title: page.title}} />

      <div className="section-container py-8">
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
                {page.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* CMS Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-brand-900 prose-headings:font-bold
            prose-p:text-brand-700 prose-p:leading-relaxed
            prose-a:text-accent-600 prose-a:underline hover:prose-a:text-accent-700
            prose-strong:text-brand-900
            prose-ul:text-brand-700 prose-ol:text-brand-700
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-accent-600 prose-blockquote:text-brand-600"
          dangerouslySetInnerHTML={{__html: page.body}}
        />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
