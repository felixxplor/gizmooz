import {Await, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {Route} from '../+types/root';
import {HeroWithProduct} from '~/components/home/HeroWithProduct';
import {BestSellers} from '~/components/home/BestSellers';
import {CategoryImageGrid} from '~/components/home/CategoryImageGrid';
import {MissionSection} from '~/components/home/MissionSection';
import {PressMentions} from '~/components/home/PressMentions';
import {InstagramGallery} from '~/components/home/InstagramGallery';
import {LatestBlogs} from '~/components/home/LatestBlogs';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Gizmooz | Premium Smart Technology'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, {products}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
    context.storefront.query(FEATURED_PRODUCT_QUERY),
  ]);

  return {
    featuredProduct: products.nodes[0] || null,
    collections: collections.nodes,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const blogArticles = context.storefront
    .query(BLOG_ARTICLES_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    blogArticles,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-white">
      <HeroWithProduct product={data.featuredProduct} />
      <BestSellers products={data.recommendedProducts} />
      <CategoryImageGrid collections={data.collections} />
      <MissionSection />
      <PressMentions />
      <InstagramGallery />
      <Suspense>
        <Await resolve={data.blogArticles}>
          {(result) => (
            <LatestBlogs articles={result?.blog?.articles?.nodes} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const FEATURED_PRODUCT_QUERY = `#graphql
  query FeaturedProduct($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 1, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

const COLLECTIONS_QUERY = `#graphql
  query HomepageCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const BLOG_ARTICLES_QUERY = `#graphql
  query BlogArticles($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    blog(handle: "news") {
      articles(first: 4, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          title
          handle
          publishedAt
          blog {
            handle
          }
          image {
            url
            altText
            width
            height
          }
          authorV2 {
            name
          }
        }
      }
    }
  }
` as const;
