import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useRef, useState, useEffect} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface Category {
  id: string;
  title: string;
  handle: string;
  image?: {url: string; altText?: string; width: number; height: number} | null;
}

interface CategoryImageGridProps {
  collections?: Array<{
    id: string;
    title: string;
    handle: string;
    image?: {url: string; altText?: string; width: number; height: number} | null;
  }>;
}

const FALLBACK_IMAGES: Record<string, string> = {
  'best-sellers':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop&q=80',
  'new-arrivals':
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=750&fit=crop&q=80',
  'home-decor':
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=750&fit=crop&q=80',
  lighting:
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=750&fit=crop&q=80',
};

const TITLE_MAP: Record<string, string> = {
  'home-page': 'New Arrivals',
  frontpage: 'New Arrivals',
};

const EXTRA_CATEGORIES = [
  {id: 'extra-home-decor', title: 'Home Decor', handle: 'home-decor'},
  {id: 'extra-lighting', title: 'Lighting', handle: 'lighting'},
];

function getFallbackImage(handle: string, index: number): string {
  if (FALLBACK_IMAGES[handle]) return FALLBACK_IMAGES[handle];
  const keys = Object.keys(FALLBACK_IMAGES);
  return FALLBACK_IMAGES[keys[index % keys.length]];
}

function CategoryCard({
  collection,
  index,
}: {
  collection: Category;
  index: number;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative aspect-4/5 overflow-hidden rounded-xl"
    >
      {'image' in collection && collection.image ? (
        <Image
          data={collection.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
      ) : (
        <img
          src={getFallbackImage(collection.handle, index)}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold text-center drop-shadow-lg">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

function CategoryCarousel({categories}: {categories: Category[]}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by one card width (25% of container on desktop)
    const cardWidth = el.clientWidth / 4;
    el.scrollBy({left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth'});
  };

  return (
    <div className="relative">
      {/* Prev arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-brand-200 flex items-center justify-center hover:bg-brand-50 transition-all ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-5 h-5 text-brand-900" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {categories.map((collection, index) => (
          <div
            key={collection.id}
            className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
          >
            <CategoryCard collection={collection} index={index} />
          </div>
        ))}
      </div>

      {/* Next arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-brand-200 flex items-center justify-center hover:bg-brand-50 transition-all ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-5 h-5 text-brand-900" />
      </button>
    </div>
  );
}

export function CategoryImageGrid({collections}: CategoryImageGridProps) {
  if (!collections || collections.length === 0) return null;

  const mappedCollections = collections.slice(0, 4).map((col) => {
    const mappedTitle = TITLE_MAP[col.handle] || col.title;
    const mappedHandle =
      col.handle === 'home-page' || col.handle === 'frontpage'
        ? 'new-arrivals'
        : col.handle;
    return {...col, title: mappedTitle, handle: mappedHandle};
  });

  const allCategories = [...mappedCollections, ...EXTRA_CATEGORIES];
  const isCarousel = allCategories.length > 4;

  return (
    <section className="section-container py-12 md:py-16">
      {isCarousel ? (
        <CategoryCarousel categories={allCategories} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allCategories.map((collection, index) => (
            <CategoryCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
