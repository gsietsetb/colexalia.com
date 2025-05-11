import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getPriceHistory, getEbayAffiliateUrl } from '../../api/priceApi';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCollection } from '../../contexts/CollectionContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HeartIcon, PlusCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ProductDetailData {
  id: string;
  name: string;
  platform: string;
  imageUrl: string;
  priceLoose?: number;
  priceCIB?: number;
  priceNew?: number;
  releaseDate?: string;
  genre?: string;
  upc?: string;
  asin?: string;
}

interface PricePoint {
  date: string;
  loose: number;
  cib: number;
  new: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState<'loose' | 'cib' | 'new'>('cib');

  const { currentUser } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCollection } = useCollection();

  const inWishlist = id ? isInWishlist(id) : false;
  const affiliateId = 'tu-id-afiliado'; // Reemplazar con ID real

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError('');
      
      try {
        // Obtener detalles del producto
        const productData = await getProduct(id);
        setProduct(productData);
        
        // Obtener historial de precios (simulados para el MVP)
        const priceData = await getPriceHistory(id);
        setPriceHistory(priceData);
      } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
        setError('No se pudo cargar la información del producto. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!product || !currentUser) return;
    
    try {
      if (inWishlist) {
        // Simplificado - en realidad necesitaríamos el ID del item en wishlist
        const wishlistItemId = 'id-del-item'; // Esto debe obtenerse correctamente
        await removeFromWishlist(wishlistItemId);
      } else {
        await addToWishlist({
          productId: product.id,
          name: product.name,
          platform: product.platform,
          imageUrl: product.imageUrl,
          priceLoose: product.priceLoose,
          priceCIB: product.priceCIB,
          priceNew: product.priceNew
        });
      }
    } catch (error) {
      console.error('Error al actualizar wishlist:', error);
    }
  };

  const handleAddToCollection = async () => {
    if (!product || !currentUser) return;
    
    try {
      const price = parseFloat(purchasePrice);
      if (isNaN(price) || price <= 0) {
        alert('Por favor, introduce un precio válido');
        return;
      }

      await addToCollection({
        productId: product.id,
        name: product.name,
        platform: product.platform,
        imageUrl: product.imageUrl,
        condition,
        purchasePrice: price,
        purchaseDate: new Date(purchaseDate),
        currentPriceLoose: product.priceLoose,
        currentPriceCIB: product.priceCIB,
        currentPriceNew: product.priceNew
      });

      setShowAddToCollection(false);
      setPurchasePrice('');
      setCondition('cib');
    } catch (error) {
      console.error('Error al añadir a la colección:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error || 'Producto no encontrado'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/search" className="text-primary-600 hover:text-primary-800">
          &larr; Volver a búsqueda
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Imagen y detalles básicos */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="aspect-square bg-gray-100 rounded mb-4 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-game.png';
                }}
              />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.platform}</p>
            
            {product.releaseDate && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Fecha de lanzamiento:</span> {product.releaseDate}
              </p>
            )}
            
            {product.genre && (
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Género:</span> {product.genre}
              </p>
            )}
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">Loose</p>
                <p className="font-bold">{product.priceLoose ? `${product.priceLoose}€` : 'N/A'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">CIB</p>
                <p className="font-bold">{product.priceCIB ? `${product.priceCIB}€` : 'N/A'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">New</p>
                <p className="font-bold">{product.priceNew ? `${product.priceNew}€` : 'N/A'}</p>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleAddToWishlist}
                className={`btn flex items-center justify-center ${inWishlist ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {inWishlist ? (
                  <>
                    <HeartIconSolid className="h-5 w-5 mr-2 text-red-600" />
                    Quitar de Wishlist
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 mr-2" />
                    Añadir a Wishlist
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setShowAddToCollection(true)}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Añadir a mi Colección
              </button>
              
              <a 
                href={getEbayAffiliateUrl(product.name, product.platform, affiliateId)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Comprar en eBay
              </a>
            </div>
          </div>
        </div>
        
        {/* Gráfica y datos históricos */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Histórico de precios</h2>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}€`, '']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="loose" 
                    stroke="#8884d8" 
                    name="Loose"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cib" 
                    stroke="#82ca9d" 
                    name="CIB" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="new" 
                    stroke="#ffc658" 
                    name="New" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Análisis de precios</h3>
              <p className="text-gray-600 mb-2">
                Los precios mostrados son un promedio basado en datos de ventas reales en el mercado europeo.
              </p>
              <p className="text-gray-600">
                Los precios pueden variar según la región, estado de conservación y completitud.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para añadir a colección */}
      {showAddToCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Añadir a mi colección</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Condición
              </label>
              <select
                className="input w-full"
                value={condition}
                onChange={(e) => setCondition(e.target.value as 'loose' | 'cib' | 'new')}
              >
                <option value="loose">Loose (Solo juego)</option>
                <option value="cib">CIB (Completo en caja)</option>
                <option value="new">Nuevo/Sellado</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Precio de compra (€)
              </label>
              <input
                type="number"
                className="input w-full"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Fecha de compra
              </label>
              <input
                type="date"
                className="input w-full"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddToCollection(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCollection}
                className="btn btn-primary"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 