import {useState, useEffect, useMemo} from 'react';
import {Star, X, Search, ChevronLeft, ChevronRight} from 'lucide-react';
import type {ReviewsData, Review} from '~/lib/reviews';
import {ReviewForm} from './ReviewForm';

const REVIEWS_PER_PAGE = 3;

function StarRow({rating, size = 'sm'}: {rating: number; size?: 'sm' | 'lg'}) {
  const px = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${px} ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-brand-200'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({review}: {review: Review}) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE = 200;
  const isLong = review.body.length > TRUNCATE;
  const displayBody =
    !expanded && isLong ? review.body.slice(0, TRUNCATE) + '…' : review.body;

  const date = new Date(review.created_at).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <div className="py-6 border-b border-brand-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-brand-900">{review.reviewer.name}</span>
          {review.verified_buyer && (
            <span className="text-xs text-brand-500">Verified Buyer</span>
          )}
        </div>
        <span className="text-xs text-brand-400 shrink-0">{date}</span>
      </div>

      <StarRow rating={review.rating} />

      {review.title && (
        <p className="font-semibold text-brand-900 mt-2">{review.title}</p>
      )}

      {review.body && (
        <div className="mt-1">
          <p className="text-sm text-brand-600 leading-relaxed">{displayBody}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-sm text-blue-600 hover:underline mt-0.5"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export function ProductReviews({data, productId}: {data?: ReviewsData | null; productId?: string}) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showForm]);

  const allReviews = data?.reviews ?? [];

  const counts = useMemo(() => {
    const c: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    allReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      c[star] = (c[star] ?? 0) + 1;
    });
    return c;
  }, [allReviews]);

  const reviewPhotos = useMemo(
    () => allReviews.filter((r) => r.verified_buyer && r.photo).map((r) => r.photo!),
    [allReviews],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return allReviews;
    const q = search.toLowerCase();
    return allReviews.filter(
      (r) =>
        r.reviewer.name.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.body.toLowerCase().includes(q),
    );
  }, [allReviews, search]);

  const totalPages = Math.ceil(filtered.length / REVIEWS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <section id="reviews" className="py-16 border-t border-brand-200">
      <div className="section-container">
        <div className="grid lg:grid-cols-[260px_1fr] gap-12">
          {/* Left sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-900">Reviews</h2>

            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-full bg-brand-900 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Write A Review
            </button>

            {allReviews.length > 0 && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-xs text-brand-600 w-8 shrink-0">
                      {stars}{' '}
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-brand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${data?.breakdown.find((b) => b.stars === stars)?.pct ?? 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-blue-600 w-8 text-right shrink-0">
                      {counts[stars] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="Search reviews"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Right content */}
          <div>
            {/* Photo strip */}
            {reviewPhotos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
                {reviewPhotos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.url}
                    alt={photo.altText ?? 'Review photo'}
                    className="w-24 h-24 object-cover rounded-lg shrink-0 border border-brand-100"
                  />
                ))}
              </div>
            )}

            {/* Reviews list */}
            {paged.length > 0 ? (
              <>
                <div>
                  {paged.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          n === page
                            ? 'bg-brand-900 text-white'
                            : 'hover:bg-brand-100 text-brand-600'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded hover:bg-brand-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-brand-500 text-sm">
                {search
                  ? 'No reviews match your search.'
                  : 'No reviews yet — be the first to leave one!'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-200 rounded-t-2xl">
              <h3 className="text-lg font-bold text-brand-900">Write a Review</h3>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-brand-100 text-brand-500 hover:text-brand-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ReviewForm onSuccess={() => setShowForm(false)} productId={productId} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
