import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate, Link} from 'react-router';

interface FilterSidebarProps {
  collections?: Array<{handle: string; title: string}>;
}

export function FilterSidebar({collections}: FilterSidebarProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlPriceMin = searchParams.get('price_min')
    ? parseInt(searchParams.get('price_min')!)
    : 0;
  const urlPriceMax = searchParams.get('price_max')
    ? parseInt(searchParams.get('price_max')!)
    : 1000;

  const [localPriceMin, setLocalPriceMin] = useState(urlPriceMin);
  const [localPriceMax, setLocalPriceMax] = useState(urlPriceMax);

  useEffect(() => {
    setLocalPriceMin(urlPriceMin);
    setLocalPriceMax(urlPriceMax);
  }, [urlPriceMin, urlPriceMax]);

  const commitPrice = () => {
    const params = new URLSearchParams(searchParams);
    if (localPriceMin === 0) {
      params.delete('price_min');
    } else {
      params.set('price_min', String(localPriceMin));
    }
    if (localPriceMax === 1000) {
      params.delete('price_max');
    } else {
      params.set('price_max', String(localPriceMax));
    }
    navigate(`?${params.toString()}`, {replace: true, preventScrollReset: true});
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('price_min');
    params.delete('price_max');
    setLocalPriceMin(0);
    setLocalPriceMax(1000);
    navigate(`?${params.toString()}`, {replace: true, preventScrollReset: true});
  };

  const hasFilters =
    searchParams.has('price_min') ||
    searchParams.has('price_max');

  const handleMinChange = (val: number) => {
    setLocalPriceMin(Math.min(val, localPriceMax));
  };

  const handleMaxChange = (val: number) => {
    setLocalPriceMax(Math.max(val, localPriceMin));
  };

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-brand-900">Price Range</h3>
        <div className="space-y-5">
          <div>
            <label className="text-sm text-brand-500 mb-1 block">Min Price</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={localPriceMin}
              onChange={(e) => handleMinChange(parseInt(e.target.value))}
              onMouseUp={commitPrice}
              onTouchEnd={commitPrice}
              className="w-full accent-brand-900"
              aria-label="Minimum price"
            />
          </div>
          <div>
            <label className="text-sm text-brand-500 mb-1 block">Max Price</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={localPriceMax}
              onChange={(e) => handleMaxChange(parseInt(e.target.value))}
              onMouseUp={commitPrice}
              onTouchEnd={commitPrice}
              className="w-full accent-brand-900"
              aria-label="Maximum price"
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-brand-700">
            <span>${localPriceMin}</span>
            <span>—</span>
            <span>${localPriceMax}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {collections && collections.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-brand-900">Categories</h3>
          <ul className="space-y-1">
            {collections.map((col) => (
              <li key={col.handle}>
                <Link
                  to={`/collections/${col.handle}`}
                  className="block py-2 px-3 rounded-lg text-sm text-brand-600 hover:bg-brand-100 hover:text-brand-900 transition-colors"
                >
                  {col.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset Filters */}
      {hasFilters && (
        <button onClick={clearFilters} className="w-full btn-secondary py-3">
          Reset Filters
        </button>
      )}
    </div>
  );
}
