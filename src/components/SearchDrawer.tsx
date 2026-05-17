import { useState, useEffect, useRef, useCallback } from 'react';

interface StoreResult {
  domain: string;
  name: string;
  logoPic: string;
}

export function SearchDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StoreResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const onClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/site-stores?kwds=${encodeURIComponent(searchQuery)}&limit=10`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data || []);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        ref={drawerRef}
        className="bg-white shadow-xl max-w-lg mx-auto mt-16 rounded-lg overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300'}`}>
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search stores..."
              className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
              aria-label="Search stores"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Searching...</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {results.map((store) => (
                <li key={store.domain}>
                  <a
                    href={`/discount/${store.domain}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {store.logoPic ? (
                        <img
                          src={`${(window as any).__IMG_URL__ || ''}${store.logoPic}`}
                          alt={store.name}
                          className="w-8 h-8 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-500">
                          {store.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{store.name}</p>
                      <p className="text-sm text-gray-500 truncate">{store.domain}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No stores found for "{query}"</p>
            </div>
          )}

          {!isLoading && !query && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Type to search for stores...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchDrawer;
