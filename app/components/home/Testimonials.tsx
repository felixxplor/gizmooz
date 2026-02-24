const reviews = [
  {
    name: 'Jonathan',
    avatar: 'https://i.pravatar.cc/64?img=11',
    rating: 5,
    text: 'The Gizmody smart clock feels solid in construction, and I\'ve received numerous compliments on its sleek design. After a year of daily use, the display ',
    highlight: 'remains crisp and responsive',
    textAfter: ', with all smart features working flawlessly.',
  },
  {
    name: 'Josh',
    avatar: 'https://i.pravatar.cc/64?img=33',
    rating: 5,
    text: 'I have had this smart light for about six months now, and I could not be happier with the quality. It has ',
    highlight: 'truly elevated the ambiance',
    textAfter: ' of my living room. Highly recommend!',
  },
];

const avatars = [
  'https://i.pravatar.cc/48?img=3',
  'https://i.pravatar.cc/48?img=7',
  'https://i.pravatar.cc/48?img=11',
  'https://i.pravatar.cc/48?img=15',
  'https://i.pravatar.cc/48?img=20',
];

function Stars({count}: {count: number}) {
  return (
    <div className="flex gap-0.5 text-green-600 text-lg">
      {Array.from({length: count}, (_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-10 sm:py-20 bg-brand-50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-4 sm:mb-6">
            What our{' '}
            <span className="underline decoration-wavy decoration-accent-400 underline-offset-4">
              customers
            </span>{' '}
            say
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Customer"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <Stars count={5} />
              <p className="text-xs text-brand-500">
                <span className="font-semibold text-brand-900">1,250+</span>{' '}
                positive reviews
              </p>
            </div>
          </div>
        </div>

        {/* Review cards — horizontal scroll on mobile, grid on md+ */}
        <div
          className="flex gap-4 overflow-x-auto md:grid md:grid-cols-2 md:gap-8 md:max-w-4xl md:mx-auto"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {reviews.map((review) => (
            <div
              key={review.name}
              className="flex-none w-[82vw] sm:w-[60vw] md:w-auto bg-white rounded-2xl p-5 shadow-sm border border-brand-100 flex flex-col gap-3"
            >
              <Stars count={review.rating} />
              <p className="text-brand-700 text-sm leading-relaxed">
                &ldquo;{review.text}
                <span className="bg-accent-100 text-brand-900 px-1 py-0.5 rounded font-medium">
                  {review.highlight}
                </span>
                {review.textAfter}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-brand-900">{review.name}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span> Verified Purchase
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
