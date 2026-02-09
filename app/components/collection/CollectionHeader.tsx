import {Link} from 'react-router';

interface CollectionHeaderProps {
  collection: {
    title: string;
    description?: string;
  };
}

export function CollectionHeader({collection}: CollectionHeaderProps) {
  return (
    <section className="relative h-[200px] sm:h-[280px] overflow-hidden bg-brand-900">
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
