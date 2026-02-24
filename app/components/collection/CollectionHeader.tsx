import {Link} from 'react-router';

const DEFAULT_HEADER_IMAGE =
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=600&fit=crop&q=80';

interface CollectionHeaderProps {
  collection: {
    title: string;
    description?: string;
    image?: {url: string} | null;
  };
}

export function CollectionHeader({collection}: CollectionHeaderProps) {
  const imageUrl = collection.image?.url || DEFAULT_HEADER_IMAGE;

  return (
    <section className="relative h-[200px] sm:h-[280px] overflow-hidden bg-brand-900">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-4xl px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-lg text-brand-300 max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
