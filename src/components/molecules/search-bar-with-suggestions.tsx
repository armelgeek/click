import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchAPI } from '@/shared/api';
import { useNavigate } from 'react-router';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'store' | 'category';
  image?: string;
}

export function SearchBarWithSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { suggestions: results } = await SearchAPI.getSearchSuggestions({
          q: debouncedQuery,
          limit: 5,
        });
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        // Silently fail for suggestions - not critical
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = async () => {
    if (query.trim().length === 0) return;

    try {
      const results = await SearchAPI.globalSearch({
        q: query,
        page: 1,
        limit: 20,
      });

      // Navigate to search results page
      navigate('/search-results', { state: { results, query } });
      setShowSuggestions(false);
    } catch (error) {
      // Handle search error - could show toast notification
      // For now, stay on current page
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'store') {
      navigate(`/shop/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      navigate(`/category/${suggestion.id}`);
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Rechercher des produits ou magasin"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          variant="search"
          className="pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-vapo-purple-primary animate-spin" />
          )}
          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-vapo-purple-primary" />
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              {suggestion.image && (
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{suggestion.name}</div>
                <div className="text-xs text-gray-500 capitalize">{suggestion.type == 'product' ? 'Produit' : suggestion.type == 'store' ? 'Magasin' : 'Catégorie'}</div>
              </div>
              <Search className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
