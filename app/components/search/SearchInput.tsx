import {Search, X, Loader} from 'lucide-react';

interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search products, collections, articles...',
  isLoading,
  inputRef,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 text-base border-2 border-brand-300 rounded-lg focus:border-brand-900 focus:outline-none transition-all"
      />
      {isLoading ? (
        <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-600 animate-spin" />
      ) : value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-brand-400" />
        </button>
      ) : null}
    </div>
  );
}
