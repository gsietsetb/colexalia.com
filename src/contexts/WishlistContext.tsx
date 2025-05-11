import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  platform: string;
  imageUrl: string;
  priceLoose?: number;
  priceCIB?: number;
  priceNew?: number;
  dateAdded: Date;
  alertPercentage?: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  setAlertPercentage: (itemId: string, percentage: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de un WishlistProvider');
  }
  return context;
}

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchWishlist() {
      if (!currentUser) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const wishlistQuery = query(
          collection(db, 'wishlists'),
          where('userId', '==', currentUser.uid)
        );
        
        const snapshot = await getDocs(wishlistQuery);
        const items: WishlistItem[] = [];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            productId: data.productId,
            name: data.name,
            platform: data.platform,
            imageUrl: data.imageUrl,
            priceLoose: data.priceLoose,
            priceCIB: data.priceCIB,
            priceNew: data.priceNew,
            dateAdded: data.dateAdded.toDate(),
            alertPercentage: data.alertPercentage
          });
        });
        
        setWishlistItems(items);
      } catch (error) {
        console.error('Error al obtener la lista de deseos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [currentUser]);

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para añadir a la lista de deseos');
    }

    try {
      const newItem = {
        ...item,
        userId: currentUser.uid,
        dateAdded: new Date()
      };

      const docRef = await addDoc(collection(db, 'wishlists'), newItem);
      
      setWishlistItems(prev => [
        ...prev, 
        { ...item, id: docRef.id, dateAdded: new Date() }
      ]);
    } catch (error) {
      console.error('Error al añadir a la lista de deseos:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para eliminar de la lista de deseos');
    }

    try {
      await deleteDoc(doc(db, 'wishlists', itemId));
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const setAlertPercentage = async (itemId: string, percentage: number) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para configurar alertas');
    }

    try {
      await updateDoc(doc(db, 'wishlists', itemId), {
        alertPercentage: percentage
      });
      
      setWishlistItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, alertPercentage: percentage } 
            : item
        )
      );
    } catch (error) {
      console.error('Error al configurar la alerta:', error);
      throw error;
    }
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    setAlertPercentage
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
} 