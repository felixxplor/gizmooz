import {useEffect, useRef} from 'react';
import {X} from 'lucide-react';
import {FilterSidebar} from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({isOpen, onClose}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-brand-900">Filters</h3>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <FilterSidebar />
      </div>
    </div>
  );
}
