import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';

const products: Product[] = [
  {
    id: '1',
    name: 'Handwoven Kurdish Rug',
    price: 150000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/rug/400/300',
    imageHint: 'kurdish rug',
    seller: {
      name: 'Nishtiman Crafts',
      avatarUrl: 'https://picsum.photos/seed/seller1/40/40',
      rating: 4.8,
    },
    category: 'Home & Garden',
    description: 'Beautiful handwoven rug with traditional Kurdish patterns. Made from 100% pure wool. A perfect addition to any home.',
    condition: 'New',
  },
  {
    id: '2',
    name: 'Modern Smartphone',
    price: 750000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/phone/400/300',
    imageHint: 'smartphone device',
    seller: {
      name: 'Erbil Electronics',
      avatarUrl: 'https://picsum.photos/seed/seller2/40/40',
      rating: 4.9,
    },
    category: 'Electronics',
    description: 'Latest model smartphone with a stunning display, powerful processor, and all-day battery life. Unlocked and ready to use.',
    condition: 'New',
  },
  {
    id: '3',
    name: 'Designer Abaya',
    price: 220000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/abaya/400/300',
    imageHint: 'fashion abaya',
    seller: {
      name: 'Chic Boutique',
      avatarUrl: 'https://picsum.photos/seed/seller3/40/40',
      rating: 4.7,
    },
    category: 'Fashion',
    description: 'Elegant and modest designer abaya made from high-quality crepe fabric. Features intricate embroidery.',
    condition: 'New',
  },
  {
    id: '4',
    name: 'Organic Skincare Set',
    price: 65000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/skincare/400/300',
    imageHint: 'skincare products',
    seller: {
      name: 'Nature\'s Touch',
      avatarUrl: 'https://picsum.photos/seed/seller4/40/40',
      rating: 4.9,
    },
    category: 'Health & Beauty',
    description: 'A complete set of organic skincare products, including a cleanser, toner, and moisturizer. Perfect for all skin types.',
    condition: 'New',
  },
  {
    id: '5',
    name: 'Professional Football',
    price: 45000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/football/400/300',
    imageHint: 'soccer ball',
    seller: {
      name: 'Sports Direct IQ',
      avatarUrl: 'https://picsum.photos/seed/seller5/40/40',
      rating: 4.6,
    },
    category: 'Sports & Outdoors',
    description: 'FIFA-approved professional football. Durable and suitable for all weather conditions.',
    condition: 'New',
  },
  {
    id: '6',
    name: 'Antique Copper Pot',
    price: 95000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/pot/400/300',
    imageHint: 'copper pot',
    seller: {
      name: 'Kurdistan Treasures',
      avatarUrl: 'https://picsum.photos/seed/seller6/40/40',
      rating: 4.8,
    },
    category: 'Home & Garden',
    description: 'A beautiful antique copper pot, perfect as a decorative piece or for traditional cooking.',
    condition: 'Used - Good',
  },
   {
    id: '7',
    name: 'Wireless Headphones',
    price: 120000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/headphones/400/300',
    imageHint: 'wireless headphones',
    seller: {
      name: 'Erbil Electronics',
      avatarUrl: 'https://picsum.photos/seed/seller2/40/40',
      rating: 4.9,
    },
    category: 'Electronics',
    description: 'High-fidelity wireless headphones with noise-cancellation technology. Up to 30 hours of playtime.',
    condition: 'New',
  },
  {
    id: '8',
    name: 'Children\'s Story Book (Kurdish)',
    price: 15000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/book/400/300',
    imageHint: 'children book',
    seller: {
      name: 'Zanyari Bookstore',
      avatarUrl: 'https://picsum.photos/seed/seller7/40/40',
      rating: 4.9,
    },
    category: 'Books & Media',
    description: 'A colorful and engaging story book for children in the Kurdish Sorani dialect.',
    condition: 'New',
  },
];


export default function MarketplacePage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-4">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to KurdMall
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover, buy, and sell goods in the Kurdistan region.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for anything... (e.g. 'Kurdish rug')"
              className="pl-10 text-base"
            />
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
