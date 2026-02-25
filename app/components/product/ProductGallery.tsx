import {useState, useCallback} from 'react';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface ProductGalleryProps {
  images: Array<{
    id?: string | null;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }>;
  productTitle: string;
}

export function ProductGallery({images, productTitle}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    },
    [prevImage, nextImage],
  );

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-brand-100 rounded-xl flex items-center justify-center">
        <p className="text-brand-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      {/* Thumbnails — horizontal strip below on mobile, vertical strip left on desktop */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 order-last lg:order-first lg:w-16 lg:shrink-0 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {images.map((image, index) => (
            <button
              key={image.id ?? image.url}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`w-16 aspect-square shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-brand-900'
                  : 'border-transparent hover:border-brand-300'
              }`}
            >
              <Image
                data={image}
                className="w-full h-full object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="relative flex-1 aspect-square bg-brand-50 rounded-xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <Image
          data={images[currentIndex]}
          className="w-full h-full object-cover"
          sizes="(min-width: 1024px) 45vw, 100vw"
          fetchPriority={currentIndex === 0 ? 'high' : undefined}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-0.5 rounded-full text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
