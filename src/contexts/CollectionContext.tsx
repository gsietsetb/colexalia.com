import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface CollectionItem {
  id: string;
  productId: string;
  name: string;
  platform: string;
  imageUrl: string;
  condition: 'loose' | 'cib' | 'new';
  purchasePrice: number;
  purchaseDate: Date;
  notes?: string;
  currentPriceLoose?: number;
  currentPriceCIB?: number;
  currentPriceNew?: number;
  lastUpdated: Date;
}

interface CollectionContextType {
  collectionItems: CollectionItem[];
  loading: boolean;
  addToCollection: (item: Omit<CollectionItem, 'id' | 'lastUpdated'>) => Promise<void>;
  removeFromCollection: (itemId: string) => Promise<void>;
  updateCollectionItem: (itemId: string, updates: Partial<CollectionItem>) => Promise<void>;
  updatePrices: (itemId: string, prices: { loose?: number; cib?: number; new?: number }) => Promise<void>;
  getCollectionValue: () => { totalPurchase: number; totalCurrent: number; difference: number };
}

const CollectionContext = createContext<CollectionContextType | null>(null);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection debe usarse dentro de un CollectionProvider');
  }
  return context;
}

interface CollectionProviderProps {
  children: ReactNode;
}

export function CollectionProvider({ children }: CollectionProviderProps) {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchCollection() {
      if (!currentUser) {
        setCollectionItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const collectionQuery = query(
          collection(db, 'collections'),
          where('userId', '==', currentUser.uid)
        );
        
        const snapshot = await getDocs(collectionQuery);
        const items: CollectionItem[] = [];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          items.push({
            id: doc.id,
            productId: data.productId,
            name: data.name,
            platform: data.platform,
            imageUrl: data.imageUrl,
            condition: data.condition,
            purchasePrice: data.purchasePrice,
            purchaseDate: data.purchaseDate.toDate(),
            notes: data.notes,
            currentPriceLoose: data.currentPriceLoose,
            currentPriceCIB: data.currentPriceCIB,
            currentPriceNew: data.currentPriceNew,
            lastUpdated: data.lastUpdated.toDate()
          });
        });
        
        setCollectionItems(items);
      } catch (error) {
        console.error('Error al obtener la colección:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [currentUser]);

  const addToCollection = async (item: Omit<CollectionItem, 'id' | 'lastUpdated'>) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para añadir a tu colección');
    }

    try {
      const newItem = {
        ...item,
        userId: currentUser.uid,
        lastUpdated: new Date()
      };

      const docRef = await addDoc(collection(db, 'collections'), newItem);
      
      setCollectionItems(prev => [
        ...prev, 
        { ...item, id: docRef.id, lastUpdated: new Date() }
      ]);
    } catch (error) {
      console.error('Error al añadir a la colección:', error);
      throw error;
    }
  };

  const removeFromCollection = async (itemId: string) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para eliminar de tu colección');
    }

    try {
      await deleteDoc(doc(db, 'collections', itemId));
      setCollectionItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error al eliminar de la colección:', error);
      throw error;
    }
  };

  const updateCollectionItem = async (itemId: string, updates: Partial<CollectionItem>) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para actualizar tu colección');
    }

    try {
      const updatedItem = {
        ...updates,
        lastUpdated: new Date()
      };

      await updateDoc(doc(db, 'collections', itemId), updatedItem);
      
      setCollectionItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, ...updates, lastUpdated: new Date() } 
            : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar el ítem de la colección:', error);
      throw error;
    }
  };

  const updatePrices = async (itemId: string, prices: { loose?: number; cib?: number; new?: number }) => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para actualizar precios');
    }

    try {
      const updates: any = {
        lastUpdated: new Date()
      };

      if (prices.loose !== undefined) {
        updates.currentPriceLoose = prices.loose;
      }
      if (prices.cib !== undefined) {
        updates.currentPriceCIB = prices.cib;
      }
      if (prices.new !== undefined) {
        updates.currentPriceNew = prices.new;
      }

      await updateDoc(doc(db, 'collections', itemId), updates);
      
      setCollectionItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, ...updates } 
            : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar los precios:', error);
      throw error;
    }
  };

  const getCollectionValue = () => {
    let totalPurchase = 0;
    let totalCurrent = 0;

    collectionItems.forEach(item => {
      totalPurchase += item.purchasePrice;
      
      // Obtenemos el precio actual según la condición del ítem
      let currentPrice = 0;
      if (item.condition === 'loose' && item.currentPriceLoose) {
        currentPrice = item.currentPriceLoose;
      } else if (item.condition === 'cib' && item.currentPriceCIB) {
        currentPrice = item.currentPriceCIB;
      } else if (item.condition === 'new' && item.currentPriceNew) {
        currentPrice = item.currentPriceNew;
      }
      
      totalCurrent += currentPrice;
    });

    return {
      totalPurchase,
      totalCurrent,
      difference: totalCurrent - totalPurchase
    };
  };

  const value = {
    collectionItems,
    loading,
    addToCollection,
    removeFromCollection,
    updateCollectionItem,
    updatePrices,
    getCollectionValue
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
} 