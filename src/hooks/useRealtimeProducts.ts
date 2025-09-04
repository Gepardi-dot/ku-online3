import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  condition: string;
  imageUrl: string;
  createdAt: string;
  imageHint?: string;
  seller: {
    name: string;
    avatarUrl: string;
  };
}

export const useRealtimeProducts = (): Product[] => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Example Product',
        price: 25000,
        location: 'Baghdad',
        condition: 'New',
        imageUrl: '/placeholder-product.jpg',
        createdAt: new Date().toISOString(),
        imageHint: 'Example product image',
        seller: {
          name: 'John Doe',
          avatarUrl: '/placeholder-avatar.jpg'
        }
      },
      {
        id: '2',
        name: 'Another Product',
        price: 15000,
        location: 'Basra',
        condition: 'Used',
        imageUrl: '/placeholder-product-2.jpg',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        imageHint: 'Another product image',
        seller: {
          name: 'Jane Smith',
          avatarUrl: '/placeholder-avatar-2.jpg'
        }
      },
      {
        id: '3',
        name: 'Third Product Example',
        price: 35000,
        location: 'Erbil',
        condition: 'Like New',
        imageUrl: '/placeholder-product-3.jpg',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        imageHint: 'Third product image',
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
