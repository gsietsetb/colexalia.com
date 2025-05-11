import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchProducts } from '../../api/priceApi';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Escuchar clics fuera del componente para cerrar los resultados
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Buscar cuando cambia la consulta debounced
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchProducts(debouncedQuery, {});
        // Limitar a 5 resultados para autocompletar
        setResults(data.slice(0, 5));
        setShowResults(true);
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  const handleSelectResult = (id: string) => {
    navigate(`/product/${id}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar juegos, consolas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input w-full pl-10 pr-4 py-2 rounded-full"
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true);
              }
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {isLoading && (
            <div className="absolute right-3 top-2.5 h-5 w-5">
              <div className="w-5 h-5 border-t-2 border-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Resultados de autocompletar */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-auto">
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelectResult(result.id)}
              >
                {result.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt={result.name}
                    className="h-10 w-10 object-contain mr-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-500">{result.platform}</div>
                </div>
              </li>
            ))}
            <li
              className="px-4 py-2 text-primary-600 hover:bg-gray-100 cursor-pointer text-center font-medium"
              onClick={handleSearch}
            >
              Ver todos los resultados
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 