import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../../api/priceApi';
import SearchBar from '../../components/Search/SearchBar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        // Obtenemos algunos juegos populares para mostrar
        const data = await searchProducts('mario', { platform: 'Nintendo Switch' });
        setFeaturedGames(data.slice(0, 4));
      } catch (error) {
        console.error('Error al obtener juegos destacados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16 px-4 rounded-lg shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Seguimiento de precios de videojuegos en Europa
          </h1>
          <p className="text-xl mb-8">
            Crea tu colección, sigue los precios y consigue las mejores ofertas para tus juegos favoritos.
          </p>
          
          <div className="max-w-xl mx-auto mb-8">
            <SearchBar />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
              Registrarse gratis
            </Link>
            <Link to="/search" className="btn btn-secondary px-8 py-3 text-lg">
              Explorar productos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué usar EuroGameTracker?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 text-primary-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M15.485 4.355c-1.988-1.978-4.73-2.93-7.456-2.674L6.5 9.616" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Precios en tiempo real</h3>
            <p className="text-gray-600">
              Accede a precios actualizados para miles de juegos, consolas y accesorios en el mercado europeo.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 text-primary-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Crea tu colección</h3>
            <p className="text-gray-600">
              Organiza y valora tu colección de juegos. Visualiza el valor de mercado actual de toda tu biblioteca.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 text-primary-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Wishlist inteligente</h3>
            <p className="text-gray-600">
              Añade juegos a tu wishlist y recibe alertas cuando los precios bajen al nivel que tú decidas.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-12 bg-gray-50 rounded-lg">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Juegos destacados</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGames.map(game => (
                <Link key={game.id} to={`/product/${game.id}`} className="card hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={game.imageUrl} 
                      alt={game.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-game.png';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{game.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{game.platform}</p>
                    <div className="flex justify-between">
                      <span className="text-sm">
                        <span className="font-medium">Loose:</span> {game.priceLoose ? `${game.priceLoose}€` : 'N/A'}
                      </span>
                      <span className="text-sm">
                        <span className="font-medium">CIB:</span> {game.priceCIB ? `${game.priceCIB}€` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/search" className="btn btn-primary">
              Ver más productos
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para seguir tus juegos?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad y empieza a seguir los precios de tus videojuegos favoritos.
        </p>
        <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg">
          Crear cuenta gratis
        </Link>
      </section>
    </div>
  );
};

export default Home; 