
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Zap, ShieldCheck, Globe, Tags, Smartphone, Shirt, Home, Gamepad2, HeartPulse, Bike, Book, MoreHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const allProducts: Product[] = [
  // Existing products...
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
    createdAt: '2 days ago',
    location: 'Erbil',
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
    condition: 'Used - Like New',
    createdAt: '5 days ago',
    location: 'Sulaymaniyah',
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
    createdAt: '1 week ago',
    location: 'Duhok',
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
    createdAt: '1 day ago',
    location: 'Erbil',
  },
   {
    id: '5',
    name: 'Antique Kurdish Dagger',
    price: 350000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/dagger/400/300',
    imageHint: 'kurdish dagger',
    seller: {
      name: 'Heritage Artifacts',
      avatarUrl: 'https://picsum.photos/seed/seller5/40/40',
      rating: 4.9,
    },
    category: 'Other',
    description: 'A rare and authentic Kurdish dagger from the 19th century. Features an ornate silver-inlaid handle and a finely crafted steel blade.',
    condition: 'Used - Good',
    createdAt: '3 days ago',
    location: 'Erbil',
  },
  {
    id: '6',
    name: 'Gaming Laptop',
    price: 1200000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/laptop/400/300',
    imageHint: 'gaming laptop',
    seller: {
      name: 'Erbil Electronics',
      avatarUrl: 'https://picsum.photos/seed/seller2/40/40',
      rating: 4.9,
    },
    category: 'Electronics',
    description: 'High-performance gaming laptop with RTX 3070, 16GB RAM, and 1TB SSD. Ready for all modern games.',
    condition: 'New',
    createdAt: '6 days ago',
    location: 'Sulaymaniyah',
  },
  {
    id: '7',
    name: 'Traditional Klash Shoes',
    price: 90000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/klash/400/300',
    imageHint: 'kurdish shoes',
    seller: {
      name: 'Nishtiman Crafts',
      avatarUrl: 'https://picsum.photos/seed/seller1/40/40',
      rating: 4.8,
    },
    category: 'Fashion',
    description: 'Handmade traditional Kurdish Klash shoes. Comfortable, durable, and stylish for any occasion.',
    condition: 'New',
    createdAt: '3 days ago',
    location: 'Duhok',
  },
  {
    id: '8',
    name: 'Local Honey Jar',
    price: 25000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/honey/400/300',
    imageHint: 'jar honey',
    seller: {
      name: 'Kurdistan Mountains Honey',
      avatarUrl: 'https://picsum.photos/seed/seller6/40/40',
      rating: 5.0,
    },
    category: 'Home & Garden',
    description: 'Pure, raw honey harvested from the mountains of Kurdistan. A sweet and healthy natural product.',
    condition: 'New',
    createdAt: '4 days ago',
    location: 'Erbil',
  },
  {
    id: '9',
    name: 'Kurdish Poetry Book',
    price: 15000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/book/400/300',
    imageHint: 'poetry book',
    seller: {
      name: 'Zanyari Bookstore',
      avatarUrl: 'https://picsum.photos/seed/seller7/40/40',
      rating: 4.7,
    },
    category: 'Books & Media',
    description: 'A collection of classic and contemporary Kurdish poetry. A must-have for literature lovers.',
    condition: 'New',
    createdAt: '1 week ago',
    location: 'Sulaymaniyah',
  },
  {
    id: '10',
    name: 'Professional Camera',
    price: 1800000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/camera/400/300',
    imageHint: 'professional camera',
    seller: {
      name: 'Erbil Electronics',
      avatarUrl: 'https://picsum.photos/seed/seller2/40/40',
      rating: 4.9,
    },
    category: 'Electronics',
    description: 'A high-end DSLR camera for professional photographers. Comes with a standard kit lens.',
    condition: 'Used - Like New',
    createdAt: '2 weeks ago',
    location: 'Erbil',
  },
  {
    id: '11',
    name: 'Leather Jacket',
    price: 250000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/jacket/400/300',
    imageHint: 'leather jacket',
    seller: {
      name: 'Chic Boutique',
      avatarUrl: 'https://picsum.photos/seed/seller3/40/40',
      rating: 4.7,
    },
    category: 'Fashion',
    description: 'A stylish and durable leather jacket for men. Perfect for the colder seasons.',
    condition: 'New',
    createdAt: '1 day ago',
    location: 'Duhok',
  },
  {
    id: '12',
    name: 'Mountain Bike',
    price: 450000,
    currency: 'IQD',
    imageUrl: 'https://picsum.photos/seed/bike/400/300',
    imageHint: 'mountain bike',
    seller: {
      name: 'Adventure Gear',
      avatarUrl: 'https://picsum.photos/seed/seller8/40/40',
      rating: 4.6,
    },
    category: 'Sports & Outdoors',
    description: 'A sturdy mountain bike with 21 speeds and front suspension. Ready for any trail.',
    condition: 'New',
    createdAt: '5 days ago',
    location: 'Sulaymaniyah',
  }
];

const categories = [
    { name: 'Electronics', icon: Smartphone, href: '#' },
    { name: 'Fashion', icon: Shirt, href: '#' },
    { name: 'Home', icon: Home, href: '#' },
    { name: 'Toys', icon: Gamepad2, href: '#' },
    { name: 'Health', icon: HeartPulse, href: '#' },
    { name: 'Sports', icon: Bike, href: '#' },
    { name: 'Books', icon: Book, href: '#' },
    { name: 'More', icon: MoreHorizontal, href: '#' },
]

const INITIAL_LOAD_COUNT = 6;
const LOAD_MORE_COUNT = 6;


export default function MarketplacePage() {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  
  useEffect(() => {
    setDisplayedProducts(allProducts.slice(0, INITIAL_LOAD_COUNT));
    setHasMore(allProducts.length > INITIAL_LOAD_COUNT);
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        const currentLength = displayedProducts.length;
        const newProducts = allProducts.slice(currentLength, currentLength + LOAD_MORE_COUNT);

        if(newProducts.length > 0) {
            setDisplayedProducts(prev => [...prev, ...newProducts]);
        }
        
        if (displayedProducts.length + newProducts.length >= allProducts.length) {
            setHasMore(false);
        }
        setIsLoading(false);
    }, 500);
  }, [displayedProducts.length, hasMore, isLoading]);

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            loadMoreProducts();
        }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreProducts]);


  return (
    <AppLayout>
      <div className="flex flex-col">

        {/* Categories Section */}
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {categories.map((category) => (
                        <Link href={category.href} key={category.name} className="group flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                           <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                             <category.icon className="w-8 h-8 text-primary group-hover:text-white" />
                           </div>
                           <span className="font-semibold text-sm text-center text-muted-foreground group-hover:text-primary">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* Special Offers */}
        <section id="special-offers" className="py-12 bg-accent">
          <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Latest Listings</h2>
                  <Button asChild variant="link" className="text-primary font-semibold">
                      <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {displayedProducts.map((product, index) => {
                    if(displayedProducts.length === index + 1) {
                        return <div ref={lastProductElementRef} key={product.id}><ProductCard product={product} /></div>
                    }
                    return <ProductCard key={product.id} product={product} />
                })}
              </div>
              {isLoading && (
                  <div className="flex justify-center mt-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              )}
          </div>
        </section>

        {/* App Download Section */}
        <section className="py-12 bg-primary text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Shop On The Go</h2>
                        <p className="mb-6 opacity-90">Download the KurdMall app for exclusive mobile-only deals, faster browsing, and personalized recommendations.</p>
                         <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                                <Link href="#">Google Play</Link>
                            </Button>
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                                <Link href="#">App Store</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <Image src="https://picsum.photos/seed/app/815/543" alt="Mobile App" width={815} height={543} className="w-full max-w-sm rounded-xl shadow-xl" data-ai-hint="mobile app" />
                    </div>
                </div>
            </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is KurdMall reliable and safe to use?</AccordionTrigger>
                        <AccordionContent>
                         Yes, KurdMall is a trustworthy online shopping platform. We prioritize transaction security with buyer protection policies that ensure you can shop with confidence.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                        <AccordionContent>
                          Delivery times vary depending on the seller's location and your location. Most local deliveries are completed within 1-3 business days.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How can I contact customer service?</AccordionTrigger>
                        <AccordionContent>
                          You can reach our customer service team 24/7 through the Help Center on our website or app. We offer live chat and email assistance.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-12 bg-primary text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with KurdMall</h2>
                <p className="mb-6 max-w-2xl mx-auto opacity-90">Subscribe to our newsletter for exclusive deals, new product alerts, and shopping tips.</p>
                <form className="max-w-md mx-auto flex">
                    <Input type="email" placeholder="Your email address" className="flex-1 rounded-l-full text-gray-800 focus:outline-none" />
                    <Button type="submit" className="bg-accent-foreground py-3 px-6 rounded-r-full font-semibold hover:bg-orange-800 transition">Subscribe</Button>
                </form>
            </div>
        </section>

      </div>
    </AppLayout>
  );
}

    
