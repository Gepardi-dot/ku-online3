
import type { Timestamp } from 'firebase/firestore';

export interface Seller {
  name: string;
  avatarUrl: string;
  rating: number;
}

export interface Product {
  id: string;
  name:string;
  price: number;
  currency: 'IQD';
  imageUrl: string;
  imageHint: string;
  seller: Seller;
  sellerId: string;
  category: string;
  description: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  createdAt: Timestamp;
  location: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    href: string;
    isRead: boolean;
    createdAt: Timestamp;
}
