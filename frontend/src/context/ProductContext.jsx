import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      return await api.getProduct(id);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      return null;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      getProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}