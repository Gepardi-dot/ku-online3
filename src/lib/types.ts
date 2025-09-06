
export interface Seller {
  name: string;
  avatarUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string;
  imageHint: string | null;
  seller: Seller;
  category: string;
  condition: string;
  createdAt: string; // ISO 8601 string format
  updatedAt: string;
  location: string;
  tags?: string[] | null;
  sellerId: string;
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  bio?: string | null
  location?: string | null
  phone?: string | null
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  currency: string
  category: string
  condition: string
  location: string
  imageUrl: string
  imageHint?: string
  tags?: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface SearchFilters {
  search: string
  category: string
  location: string
  condition: string
  priceMin: number | undefined
  priceMax: number | undefined
}

export interface UploadResult {
  url: string
  path: string
}
