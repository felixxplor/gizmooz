import {useSearchParams, useNavigate} from 'react-router';

export function FilterSidebar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const priceMax = searchParams.get('price_max')
    ? parseInt(searchParams.get('price_max')!)
    : 1000;
  const available = searchParams.get('available') === 'true';

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate(`?${params.toString()}`, {replace: true});
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('price_min');
    params.delete('price_max');
    params.delete('available');
    navigate(`?${params.toString()}`, {replace: true});
  };

  const hasFilters =
    searchParams.has('price_min') ||
    searchParams.has('price_max') ||
    searchParams.has('available');

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-brand-900">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={priceMax}
            onChange={(e) =>
              updateFilter('price_max', e.target.value === '1000' ? null : e.target.value)
            }
            className="w-full accent-brand-900"
            aria-label="Maximum price"
          />
          <div className="flex justify-between text-sm text-brand-500">
            <span>$0</span>
            <span>${priceMax}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-brand-900">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) =>
                updateFilter('available', e.target.checked ? 'true' : null)
              }
              className="w-5 h-5 rounded border-2 border-brand-300 text-brand-900 focus:ring-brand-900"
            />
            <span className="text-brand-600 group-hover:text-brand-900 transition-colors">
              In Stock Only
            </span>
          </label>
        </div>
      </div>

      {/* Reset Filters */}
      {hasFilters && (
        <button onClick={clearFilters} className="w-full btn-secondary py-3">
          Reset Filters
        </button>
      )}
    </div>
  );
}
