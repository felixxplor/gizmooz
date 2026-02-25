import altImage from '~/assets/alt.jpg';

export function InstagramGallery() {
  const images = [
    {
      id: 1,
      src: altImage,
      handle: '@gizmody',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
      handle: '@techlife',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80',
      handle: '@smarthome',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80',
      handle: '@innovation',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      handle: '@gizmody',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="section-container">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-brand-900">
          GIZMODY in the Wild
        </h2>
        <p className="text-center text-brand-500 mb-12">
          Tag us @gizmody for a chance to be featured
        </p>

        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {images.map((image) => (
            <a
              key={image.id}
              href="https://instagram.com/gizmody"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-none w-[72vw] sm:w-64 lg:w-72 aspect-square rounded-xl overflow-hidden"
              aria-label={`Instagram post by ${image.handle}`}
            >
              <img
                src={image.src}
                alt={`Posted by ${image.handle}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {image.handle}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
