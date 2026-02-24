import {useState, useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {Star, Loader, CheckCircle, ImagePlus, X} from 'lucide-react';

export function ReviewForm({onSuccess, productId}: {onSuccess?: () => void; productId?: string}) {
  const fetcher = useFetcher<{success?: boolean; error?: string}>();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isSubmitting = fetcher.state !== 'idle';
  const submitted = fetcher.data?.success;
  const error = fetcher.data?.error;

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => onSuccess?.(), 1800);
      return () => clearTimeout(timer);
    }
  }, [submitted, onSuccess]);

  function handleFile(file: File | null) {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle className="w-12 h-12 text-success" />
        <h3 className="text-lg font-bold text-brand-900">Thanks for your review!</h3>
        <p className="text-sm text-brand-500">It will appear once approved.</p>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/api/reviews" encType="multipart/form-data" className="space-y-5">
      {productId && <input type="hidden" name="productId" value={productId} />}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold text-brand-900 mb-2">
          Rating <span className="text-error">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  n <= (hovered || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-brand-200 hover:text-amber-300'
                }`}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="author" className="block text-sm font-semibold text-brand-900 mb-1">
          Name <span className="text-error">*</span>
        </label>
        <input
          id="author"
          name="author"
          type="text"
          required
          placeholder="Your name"
          className="w-full px-4 py-3 border-2 border-brand-200 rounded-lg focus:border-brand-900 focus:outline-none text-sm"
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-brand-900 mb-1">
          Review <span className="text-error">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          placeholder="What did you think of the product?"
          className="w-full px-4 py-3 border-2 border-brand-200 rounded-lg focus:border-brand-900 focus:outline-none text-sm resize-none"
        />
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-semibold text-brand-900 mb-2">
          Photo <span className="text-brand-400 font-normal">(optional)</span>
        </label>
        {preview ? (
          <div className="relative w-24 h-24">
            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-brand-200" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-5 h-5 bg-brand-900 text-white rounded-full flex items-center justify-center hover:bg-brand-700"
              aria-label="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-200 rounded-lg text-sm text-brand-500 hover:border-brand-400 hover:text-brand-700 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            Add photo
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          name="photo"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="text-sm text-error font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full btn-primary py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          'Submit Review'
        )}
      </button>
    </fetcher.Form>
  );
}
