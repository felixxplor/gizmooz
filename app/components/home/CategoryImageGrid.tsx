import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

interface CategoryImageGridProps {
  collections?: Array<{
    id: string;
    title: string;
    handle: string;
    image?: {url: string; altText?: string; width: number; height: number} | null;
  }>;
}

export function CategoryImageGrid({collections}: CategoryImageGridProps) {
  if (!collections || collections.length === 0) return null;

  const displayCollections = collections.slice(0, 4);

  return (
    <section className="py-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {displayCollections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
            className="group relative aspect-square overflow-hidden"
          >
            {collection.image ? (
              <Image
                data={collection.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <div className="w-full h-full bg-brand-200" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl sm:text-3xl font-bold text-center px-4">
                {collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
