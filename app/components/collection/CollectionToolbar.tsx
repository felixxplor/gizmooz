import {useState, useRef, useEffect} from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Grid3x3,
  LayoutGrid,
} from 'lucide-react';

interface CollectionToolbarProps {
  productCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  gridCols: 3 | 4;
  onGridChange: (cols: 3 | 4) => void;
  activeFilterCount?: number;
}

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'best-selling', label: 'Best Selling'},
  {value: 'price-low-high', label: 'Price: Low to High'},
  {value: 'price-high-low', label: 'Price: High to Low'},
  {value: 'newest', label: 'Newest'},
];

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-brand-300 rounded-lg font-medium text-sm focus:border-brand-900 focus:outline-none cursor-pointer whitespace-nowrap"
      >
        {selected.label}
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-brand-200 rounded-lg shadow-lg z-20 min-w-full overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm whitespace-nowrap hover:bg-brand-50 transition-colors ${
                opt.value === value ? 'font-semibold text-brand-900' : 'text-brand-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CollectionToolbar({
  productCount,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  gridCols,
  onGridChange,
  activeFilterCount = 0,
}: CollectionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleFilters}
          className="btn-secondary py-2 px-4 relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-accent-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-brand-500 text-sm">{productCount} products</p>
      </div>

      <div className="flex items-center gap-4">
        <SortDropdown value={sortBy} onChange={onSortChange} />

        <div className="hidden sm:flex items-center gap-1 border-2 border-brand-300 rounded-lg p-1">
          <button
            onClick={() => onGridChange(3)}
            aria-label="3-column grid"
            className={`p-2 rounded transition-colors ${
              gridCols === 3
                ? 'bg-brand-900 text-white'
                : 'hover:bg-brand-100'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onGridChange(4)}
            aria-label="4-column grid"
            className={`p-2 rounded transition-colors ${
              gridCols === 4
                ? 'bg-brand-900 text-white'
                : 'hover:bg-brand-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
