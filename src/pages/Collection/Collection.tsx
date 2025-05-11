import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../../contexts/CollectionContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const Collection = () => {
  const { collectionItems, removeFromCollection, getCollectionValue } = useCollection();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedCondition, setEditedCondition] = useState<'loose' | 'cib' | 'new'>('cib');

  useEffect(() => {
    // Simulamos carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromCollection = async (itemId: string) => {
    try {
      await removeFromCollection(itemId);
    } catch (error) {
      console.error('Error al eliminar de la colección:', error);
    }
  };

  const openEditModal = (item: any) => {
    setCurrentItem(item);
    setEditedPrice(item.purchasePrice.toString());
    setEditedCondition(item.condition);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentItem(null);
  };

  const handleEditSubmit = async () => {
    // Aquí iría la lógica para actualizar el item en la colección
    // Se podría implementar con updateCollectionItem en el contexto
    closeEditModal();
  };

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
      <h1 className="text-2xl font-bold mb-6">Mi Colección</h1>
      
      {collectionItems.length > 0 ? (
        <>
          <div className="card mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Resumen de tu colección</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-100 rounded p-4 text-center">
                  <p className="text-sm text-gray-600">Total de juegos</p>
                  <p className="text-xl font-bold">{collectionItems.length}</p>
                </div>
                <div className="bg-gray-100 rounded p-4 text-center">
                  <p className="text-sm text-gray-600">Valor invertido</p>
                  <p className="text-xl font-bold">{collectionValue.totalPurchase.toFixed(2)}€</p>
                </div>
                <div className="bg-gray-100 rounded p-4 text-center">
                  <p className="text-sm text-gray-600">Valor actual</p>
                  <p className="text-xl font-bold">{collectionValue.totalCurrent.toFixed(2)}€</p>
                </div>
                <div className="bg-gray-100 rounded p-4 text-center">
                  <p className="text-sm text-gray-600">Diferencia</p>
                  <p className={`text-xl font-bold ${collectionValue.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {collectionValue.difference >= 0 ? '+' : ''}{collectionValue.difference.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Tus juegos</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {collectionItems.map(item => (
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
                        <span className="text-sm">
                          <span className="text-gray-500">Condición:</span> {
                            item.condition === 'loose' ? 'Suelto' : 
                            item.condition === 'cib' ? 'Completo' : 'Nuevo'
                          }
                        </span>
                        <span className="text-sm">
                          <span className="text-gray-500">Comprado:</span> {item.purchasePrice}€
                        </span>
                        <span className="text-sm">
                          <span className="text-gray-500">Valor actual:</span> {
                            item.condition === 'loose' ? item.currentPriceLoose : 
                            item.condition === 'cib' ? item.currentPriceCIB : 
                            item.currentPriceNew
                          }€
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="btn btn-sm btn-secondary flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button 
                        onClick={() => handleRemoveFromCollection(item.id)}
                        className="btn btn-sm btn-danger flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Tu colección está vacía</h2>
          <p className="text-gray-600 mb-6">
            Añade juegos a tu colección para hacer seguimiento de tu inventario y valor
          </p>
          <Link to="/search" className="btn btn-primary inline-block">
            Explorar juegos
          </Link>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar juego</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Condición
              </label>
              <select
                className="input w-full"
                value={editedCondition}
                onChange={(e) => setEditedCondition(e.target.value as 'loose' | 'cib' | 'new')}
              >
                <option value="loose">Loose (Solo juego)</option>
                <option value="cib">CIB (Completo en caja)</option>
                <option value="new">Nuevo/Sellado</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Precio de compra (€)
              </label>
              <input
                type="number"
                className="input w-full"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSubmit}
                className="btn btn-primary"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;