import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { searchProducts } from '../../api/priceApi';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchProduct {
  id: string;
  name: string;
  platform: string;
  imageUrl: string;
  priceLoose?: number;
  priceCIB?: number;
  priceNew?: number;
  releaseDate?: string;
  genre?: string;
}

interface SearchFilters {
  platform?: string;
  priceMin?: number;
  priceMax?: number;
  genre?: string;
  condition?: 'loose' | 'cib' | 'new';
}

const Search = () => {
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const resultsPerPage = 12;

  // Plataformas disponibles para filtrar
  const platforms = [
    'Nintendo Switch', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X',
    'Xbox One', 'Nintendo 3DS', 'Nintendo DS', 'PlayStation 3', 'Xbox 360',
    'Game Boy Advance', 'GameCube', 'Nintendo 64', 'Super Nintendo', 'NES',
    'Wii', 'Wii U', 'PlayStation 2', 'PlayStation', 'Game Boy', 'Game Boy Color',
    'Sega Genesis', 'Sega Dreamcast', 'Sega Saturn'
  ];

  // Géneros disponibles para filtrar
  const genres = [
    'RPG', 'Action', 'Adventure', 'Strategy', 'Simulation', 'Sports', 'Racing',
    'Fighting', 'Shooter', 'Puzzle', 'Platformer', 'Horror', 'JRPG'
  ];

  // Ejecutar búsqueda cuando cambian los parámetros
  useEffect(() => {
    if (!searchQuery) return;
    
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const data = await searchProducts(searchQuery, filters);
        
        // Paginar los resultados (esto sería reemplazado por una API que soporte paginación)
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedResults = data.slice(startIndex, endIndex);
        
        setSearchResults(paginatedResults);
        setTotalPages(Math.ceil(data.length / resultsPerPage));
      } catch (error) {
        console.error('Error al buscar productos:', error);
        setError('Error al buscar productos. Por favor, intenta de nuevo.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, filters, currentPage]);

  // Actualizar los filtros y resetear a la primera página
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Actualizar la URL con la consulta
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filtros (escritorio) */}
      <div className="hidden lg:block col-span-1">
        <div className="card p-4 sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Plataforma
            </label>
            <select
              className="input w-full"
              value={filters.platform || ''}
              onChange={(e) => handleFilterChange({ ...filters, platform: e.target.value || undefined })}
            >
              <option value="">Todas las plataformas</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Género
            </label>
            <select
              className="input w-full"
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange({ ...filters, genre: e.target.value || undefined })}
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Condición
            </label>
            <select
              className="input w-full"
              value={filters.condition || ''}
              onChange={(e) => handleFilterChange({ 
                ...filters, 
                condition: (e.target.value as 'loose' | 'cib' | 'new' | '') || undefined 
              })}
            >
              <option value="">Cualquier condición</option>
              <option value="loose">Loose (Solo juego)</option>
              <option value="cib">CIB (Completo en caja)</option>
              <option value="new">Nuevo/Sellado</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Rango de precio (€)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="input w-full"
                min={0}
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  priceMin: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
              <input
                type="number"
                placeholder="Max"
                className="input w-full"
                min={0}
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  priceMax: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
          
          <button
            className="btn btn-secondary w-full"
            onClick={() => {
              setFilters({});
              setCurrentPage(1);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="col-span-1 lg:col-span-3">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Buscar juegos, consolas..."
                className="input w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
            </div>
            <button
              className="ml-4 lg:hidden btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Filtros móviles */}
        {showFilters && (
          <div className="lg:hidden mb-6 card p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button 
                className="text-gray-500" 
                onClick={() => setShowFilters(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Plataforma
              </label>
              <select
                className="input w-full"
                value={filters.platform || ''}
                onChange={(e) => handleFilterChange({ ...filters, platform: e.target.value || undefined })}
              >
                <option value="">Todas las plataformas</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Género
              </label>
              <select
                className="input w-full"
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange({ ...filters, genre: e.target.value || undefined })}
              >
                <option value="">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Condición
              </label>
              <select
                className="input w-full"
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  condition: (e.target.value as 'loose' | 'cib' | 'new' | '') || undefined 
                })}
              >
                <option value="">Cualquier condición</option>
                <option value="loose">Loose (Solo juego)</option>
                <option value="cib">CIB (Completo en caja)</option>
                <option value="new">Nuevo/Sellado</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Rango de precio (€)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input w-full"
                  min={0}
                  value={filters.priceMin || ''}
                  onChange={(e) => handleFilterChange({ 
                    ...filters, 
                    priceMin: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input w-full"
                  min={0}
                  value={filters.priceMax || ''}
                  onChange={(e) => handleFilterChange({ 
                    ...filters, 
                    priceMax: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({});
                  setCurrentPage(1);
                }}
              >
                Limpiar filtros
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowFilters(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
        
        {/* Resultados */}
        <div>
          {searchQuery && (
            <h1 className="text-2xl font-bold mb-4">
              Resultados para "{searchQuery}"
            </h1>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-game.png';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.platform}</p>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="font-medium">Loose</div>
                          <div>{product.priceLoose ? `${product.priceLoose}€` : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="font-medium">CIB</div>
                          <div>{product.priceCIB ? `${product.priceCIB}€` : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="font-medium">New</div>
                          <div>{product.priceNew ? `${product.priceNew}€` : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    
                    <div className="text-gray-700">
                      Página {currentPage} de {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">
                No se encontraron resultados para "{searchQuery}"
              </p>
              <p className="text-gray-500">
                Intenta con otros términos o menos filtros
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                Escribe algo para buscar
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search; 