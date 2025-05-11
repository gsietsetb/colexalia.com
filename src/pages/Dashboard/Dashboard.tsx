import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCollection } from '../../contexts/CollectionContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { wishlistItems } = useWishlist();
  const { collectionItems, getCollectionValue } = useCollection();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const collectionValue = getCollectionValue();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Bienvenida */}
      <div className="card mb-6 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">Bienvenido, {currentUser?.email}</h2>
          <p>Administra tus juegos, colecciones y seguimiento de precios desde aquí.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resumen de Wishlist */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Tu Wishlist</h2>
          </div>
          <div className="p-6">
            {wishlistItems.length > 0 ? (
              <div>
                <p className="mb-2">Tienes <span className="font-bold">{wishlistItems.length}</span> juegos en tu wishlist.</p>
                <ul className="space-y-2 mb-4">
                  {wishlistItems.slice(0, 3).map(item => (
                    <li key={item.id} className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.platform}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/wishlist" className="btn btn-primary block text-center w-full">
                  Ver wishlist completa
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No tienes juegos en tu wishlist.</p>
                <Link to="/search" className="btn btn-primary inline-block">
                  Explorar juegos
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Resumen de Colección */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Tu Colección</h2>
          </div>
          <div className="p-6">
            {collectionItems.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 rounded p-4 text-center">
                    <p className="text-sm text-gray-600">Valor invertido</p>
                    <p className="text-xl font-bold">{collectionValue.totalPurchase.toFixed(2)}€</p>
                  </div>
                  <div className="bg-gray-100 rounded p-4 text-center">
                    <p className="text-sm text-gray-600">Valor actual</p>
                    <p className="text-xl font-bold">{collectionValue.totalCurrent.toFixed(2)}€</p>
                  </div>
                </div>
                <p className="mb-4">
                  Tu colección ha {collectionValue.difference >= 0 ? 'ganado' : 'perdido'} 
                  <span className={`font-bold ${collectionValue.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {' '}{Math.abs(collectionValue.difference).toFixed(2)}€
                  </span> de valor
                </p>
                <Link to="/collection" className="btn btn-primary block text-center w-full">
                  Ver colección
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No tienes juegos en tu colección.</p>
                <Link to="/search" className="btn btn-primary inline-block">
                  Añadir juegos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Últimas búsquedas (simuladas) */}
      <div className="card">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Tus últimas búsquedas</h2>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <Link to="/search?q=zelda" className="block p-2 hover:bg-gray-50 rounded">
              <span className="text-primary-600">zelda</span>
              <span className="text-gray-400 text-sm ml-2">hace 2 días</span>
            </Link>
            <Link to="/search?q=mario+kart" className="block p-2 hover:bg-gray-50 rounded">
              <span className="text-primary-600">mario kart</span>
              <span className="text-gray-400 text-sm ml-2">hace 3 días</span>
            </Link>
            <Link to="/search?q=pokemon" className="block p-2 hover:bg-gray-50 rounded">
              <span className="text-primary-600">pokemon</span>
              <span className="text-gray-400 text-sm ml-2">hace 1 semana</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 