import axios from 'axios';

const API_TOKEN = import.meta.env.VITE_PRICECHARTING_API_TOKEN;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pricecharting.com/api';

interface PriceChartingProduct {
  id: string;
  name: string;
  platform: string;
  image_url: string;
  loose_price?: number;
  cib_price?: number;
  new_price?: number;
  release_date?: string;
  upc?: string;
  asin?: string;
  genre?: string;
}

interface ProductSearchFilters {
  platform?: string;
  condition?: 'loose' | 'cib' | 'new';
  priceMin?: number;
  priceMax?: number;
  genre?: string;
}

interface PriceChartingResponse {
  status: string;
  products?: PriceChartingProduct[];
  product?: PriceChartingProduct;
  errors?: string[];
}

/**
 * Busca productos en PriceCharting
 */
export async function searchProducts(query: string, filters: ProductSearchFilters = {}) {
  try {
    const params: Record<string, string | number> = {
      t: API_TOKEN,
      q: query
    };

    // Añadir filtros si están definidos
    if (filters.platform) params.platform = filters.platform;
    if (filters.genre) params.genre = filters.genre;
    if (filters.priceMin) params.price_min = filters.priceMin;
    if (filters.priceMax) params.price_max = filters.priceMax;

    const response = await axios.get<PriceChartingResponse>(`${BASE_URL}/products`, { params });

    if (response.data.status === 'success' && response.data.products) {
      return response.data.products.map(product => ({
        id: product.id,
        name: product.name,
        platform: product.platform,
        imageUrl: product.image_url,
        priceLoose: product.loose_price,
        priceCIB: product.cib_price,
        priceNew: product.new_price,
        releaseDate: product.release_date,
        upc: product.upc,
        asin: product.asin,
        genre: product.genre
      }));
    } else {
      throw new Error(response.data.errors?.join(', ') || 'Error en la búsqueda de productos');
    }
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
}

/**
 * Obtiene el detalle de un producto por ID
 */
export async function getProduct(id: string) {
  try {
    const response = await axios.get<PriceChartingResponse>(`${BASE_URL}/product`, {
      params: {
        t: API_TOKEN,
        id
      }
    });

    if (response.data.status === 'success' && response.data.product) {
      const product = response.data.product;
      return {
        id: product.id,
        name: product.name,
        platform: product.platform,
        imageUrl: product.image_url,
        priceLoose: product.loose_price,
        priceCIB: product.cib_price,
        priceNew: product.new_price,
        releaseDate: product.release_date,
        upc: product.upc,
        asin: product.asin,
        genre: product.genre
      };
    } else {
      throw new Error(response.data.errors?.join(', ') || 'Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
}

/**
 * Obtiene varios productos por sus IDs
 */
export async function getProductsBatch(ids: string[]) {
  try {
    const promises = ids.map(id => getProduct(id));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error al obtener productos en lote:', error);
    throw error;
  }
}

/**
 * Obtiene el historial de precios de un producto
 * Nota: Esta función es simulada ya que no está claro si la API de PriceCharting proporciona
 * datos históricos. En un entorno real, deberías sustituir esto por la API real o implementar
 * tu propio seguimiento de precios.
 */
export async function getPriceHistory(id: string, months = 12) {
  // Simulamos datos para el gráfico
  const today = new Date();
  const data = [];

  for (let i = 0; i < months; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Generamos precios aleatorios (esto sería reemplazado por datos reales)
    const baseLoose = 20 + Math.random() * 30;
    const baseCIB = baseLoose * 1.5 + Math.random() * 10;
    const baseNew = baseCIB * 1.3 + Math.random() * 15;
    
    data.unshift({
      date: date.toISOString().split('T')[0],
      loose: Math.round(baseLoose * 100) / 100,
      cib: Math.round(baseCIB * 100) / 100,
      new: Math.round(baseNew * 100) / 100
    });
  }

  return data;
}

/**
 * Genera una URL de afiliado para eBay
 */
export function getEbayAffiliateUrl(productName: string, platformName: string, affiliateId: string) {
  const searchTerm = encodeURIComponent(`${productName} ${platformName}`);
  return `https://www.ebay.com/sch/i.html?_nkw=${searchTerm}&_sacat=0&campid=${affiliateId}`;
}

export default {
  searchProducts,
  getProduct,
  getProductsBatch,
  getPriceHistory,
  getEbayAffiliateUrl
}; 