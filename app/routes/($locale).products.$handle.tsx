import {redirect, useLoaderData} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {parseMetaobjectReviews} from '~/lib/reviews';
import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductInfo} from '~/components/product/ProductInfo';
import {ProductTabs} from '~/components/product/ProductTabs';
import {ProductFeatureHighlights} from '~/components/product/ProductFeatureHighlights';
import {ProductReviews} from '~/components/product/ProductReviews';
import {RecommendedProducts} from '~/components/RecommendedProducts';
import {Link} from 'react-router';
import {ProductForm} from '~/components/ProductForm';
import {Store, RotateCcw, Plus, Minus} from 'lucide-react';
import {CartForm, Money, Image} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {type FetcherWithComponents} from 'react-router';
import afterpayLogo from '~/assets/Afterpay.svg';
import paypalLogo from '~/assets/PayPal.svg';
import zipLogo from '~/assets/Zip.svg';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Gizmody | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  const reviews = parseMetaobjectReviews(product);

  return {product, reviews};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Product() {
  const {product, recommendedProducts, reviews} =
    useLoaderData<typeof loader>();
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Only sync options to URL if the product has real options (not just "Default Title")
  const hasRealOptions = selectedVariant.selectedOptions.some(
    (opt) => !(opt.name === 'Title' && opt.value === 'Default Title'),
  );
  useSelectedOptionInUrlParam(
    hasRealOptions ? selectedVariant.selectedOptions : [],
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const images =
    product.images?.nodes || [selectedVariant?.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="section-container py-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-brand-500 mb-8"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-brand-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/collections/all"
                className="hover:text-brand-900 transition-colors"
              >
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-brand-900 font-medium" aria-current="page">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image Gallery — sticky so it stays in view while right column scrolls */}
          <div className="sticky top-32">
            <ProductGallery images={images} productTitle={product.title} />
          </div>

          {/* Right: Product Info */}
          <div>
            <ProductInfo
              title={product.title}
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
              reviewAverage={reviews?.average}
              reviewCount={reviews?.total}
            />

            <div className="mt-8 space-y-8">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
              />

              {/* Shipping & Returns */}
              <div className="space-y-4 border-t border-brand-200 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 text-brand-900" />
                  </div>
                  <p className="text-sm font-semibold text-brand-900">
                    Sold &amp; shipped by Gizmody
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-4 h-4 text-brand-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-900">
                      30 day change of mind returns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="grid grid-cols-3 gap-4 border-t border-brand-200 pt-6">
                <div className="space-y-2">
                  <img src={afterpayLogo} alt="Afterpay" className="h-6" />
                  <p className="text-xs text-brand-600">
                    4 payments of{' '}
                    <span className="font-semibold">
                      $
                      {selectedVariant?.price
                        ? (
                            parseFloat(selectedVariant.price.amount) / 4
                          ).toFixed(2)
                        : '0.00'}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <img src={paypalLogo} alt="PayPal Pay in 4" className="h-6" />
                  <p className="text-xs text-brand-600">
                    4 payments of{' '}
                    <span className="font-semibold">
                      $
                      {selectedVariant?.price
                        ? (
                            parseFloat(selectedVariant.price.amount) / 4
                          ).toFixed(2)
                        : '0.00'}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <img src={zipLogo} alt="Zip" className="h-6" />
                  <p className="text-xs text-brand-600">
                    From <span className="font-semibold">$10/week</span>
                  </p>
                </div>
              </div>

              <ProductFeatureHighlights />
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs
          description={product.description || ''}
          descriptionHtml={product.descriptionHtml}
        />
      </div>

      {/* Reviews */}
      <ProductReviews data={reviews} productId={product.id} />

      {/* Recommended Products */}
      <RecommendedProducts
        products={recommendedProducts}
        title="You May Also Like"
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />

      {/* Sticky Bottom Bar */}
      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </div>
  );
}

function StickyAddToCart({
  product,
  selectedVariant,
  quantity,
  setQuantity,
}: {
  product: any;
  selectedVariant: any;
  quantity: number;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
}) {
  const {open} = useAside();

  if (!selectedVariant) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-40">
      <div className="section-container py-3 flex items-center gap-4">
        {/* Product Image & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedVariant.image && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-50 shrink-0">
              <Image
                data={selectedVariant.image}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-brand-900 truncate">
              {product.title}
            </h4>
            {selectedVariant.title !== 'Default Title' && (
              <p className="text-xs text-brand-500 truncate">
                {selectedVariant.title}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="shrink-0">
          <Money
            data={selectedVariant.price}
            className="text-lg font-bold text-brand-900"
          />
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center border-2 border-brand-300 rounded-lg shrink-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-brand-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add to Cart */}
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: [{merchandiseId: selectedVariant.id, quantity}],
          }}
        >
          {(fetcher: FetcherWithComponents<any>) => {
            const isAdding = fetcher.state !== 'idle';
            return (
              <button
                type="submit"
                disabled={!selectedVariant.availableForSale || isAdding}
                onClick={() => open('cart')}
                className="shrink-0 btn-primary py-3 px-6 text-sm rounded-full cursor-pointer disabled:cursor-not-allowed"
              >
                {!selectedVariant.availableForSale
                  ? 'SOLD OUT'
                  : isAdding
                    ? 'ADDING...'
                    : 'ADD TO CART'}
                {selectedVariant.availableForSale && !isAdding && (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            );
          }}
        </CartForm>
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    metafield(namespace: "custom", key: "reviews") {
      references(first: 20) {
        nodes {
          ... on Metaobject {
            id
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
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
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
