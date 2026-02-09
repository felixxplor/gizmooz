import {useState, useCallback} from 'react';
import {Image} from '@shopify/hydrogen';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface ProductGalleryProps {
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    width: number;
    height: number;
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
      <div className="aspect-square bg-brand-100 rounded-lg flex items-center justify-center">
        <p className="text-brand-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      {/* Main Image */}
      <div className="relative aspect-square bg-brand-50 rounded-lg overflow-hidden">
        <Image
          data={images[currentIndex]}
          className="w-full h-full object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          fetchpriority={currentIndex === 0 ? 'high' : undefined}
        />

        {/* Navigation Arrows - always visible */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-brand-900 scale-95'
                  : 'border-brand-200 hover:border-brand-300'
              }`}
            >
              <Image
                data={image}
                className="w-full h-full object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
