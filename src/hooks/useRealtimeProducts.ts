import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';

export const useRealtimeProducts = (): Product[] => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Example Product',
        price: 25000,
        currency: 'IQD',
        location: 'Baghdad',
        condition: 'New',
        imageUrl: '/placeholder-product.jpg',
        imageHint: 'Example product image',
        createdAt: new Date().toISOString(),
        category: 'Electronics',
        seller: {
          name: 'John Doe',
          avatarUrl: '/placeholder-avatar.jpg'
        }
      },
      {
        id: '2',
        name: 'Another Product',
        price: 15000,
        currency: 'IQD',
        location: 'Basra',
        condition: 'Used - Good',
        imageUrl: '/placeholder-product-2.jpg',
        imageHint: 'Another product image',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        category: 'Fashion',
        seller: {
          name: 'Jane Smith',
          avatarUrl: '/placeholder-avatar-2.jpg'
        }
      },
      {
        id: '3',
        name: 'Third Product Example',
        price: 35000,
        currency: 'IQD',
        location: 'Erbil',
        condition: 'Used - Like New',
        imageUrl: '/placeholder-product-3.jpg',
        imageHint: 'Third product image',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        category: 'Home & Garden',
        seller: {
          name: 'Ahmed Ali',
          avatarUrl: '/placeholder-avatar-3.jpg'
        }
      }
    ];

    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(mockProducts);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return products;
};

export default useRealtimeProducts;
