import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
    } catch (error) {
      console.error('Error al eliminar de wishlist:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
      
      {wishlistItems.length > 0 ? (
        <div className="space-y-4">
          {wishlistItems.map(item => (
            <div key={item.id} className="card p-4 flex items-center">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-game.png';
                    }}
                  />
                )}
              </div>
              
              <div className="flex-1">
                <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary-600">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.platform}</p>
                
                <div className="flex space-x-4 mt-1">
                  {item.priceLoose && (
                    <span className="text-sm">
                      <span className="text-gray-500">Loose:</span> {item.priceLoose}€
                    </span>
                  )}
                  {item.priceCIB && (
                    <span className="text-sm">
                      <span className="text-gray-500">CIB:</span> {item.priceCIB}€
                    </span>
                  )}
                  {item.priceNew && (
                    <span className="text-sm">
                      <span className="text-gray-500">New:</span> {item.priceNew}€
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <a 
                  href={`https://www.ebay.es/sch/i.html?_nkw=${encodeURIComponent(item.name + ' ' + item.platform)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary mr-2"
                >
                  Comprar
                </a>
                <button 
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="btn btn-sm btn-danger flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <HeartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tu wishlist está vacía</h2>
          <p className="text-gray-600 mb-6">
            Añade juegos a tu wishlist para hacer seguimiento de los que te interesan
          </p>
          <Link to="/search" className="btn btn-primary inline-block">
            Explorar juegos
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 