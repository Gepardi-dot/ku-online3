export interface Seller {
  name: string;
  avatarUrl: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: 'IQD';
  imageUrl: string;
  imageHint: string;
  seller: Seller;
  category: string;
  description: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  createdAt: string; // New field for upload timestamp
  location: string;
}
