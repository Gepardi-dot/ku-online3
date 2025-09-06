import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import type { Product } from '../lib/types';

export interface UseRealtimeProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export const useRealtimeProducts = (): UseRealtimeProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // Fetch initial products from Supabase
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('createdAt', { ascending: false });
          
        if (error) {
          console.error('Error fetching products:', error);
          setError('Failed to load products');
          return;
        }
        
        setProducts(data || []);
      } catch (err) {
        console.error('Error in fetchProducts:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up realtime subscription
    const channel = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setProducts((current) => [payload.new as Product, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((current) =>
              current.map((product) =>
                product.id === payload.new.id ? (payload.new as Product) : product
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((current) =>
              current.filter((product) => product.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchProducts();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, isLoading, error };
};

export default useRealtimeProducts;
