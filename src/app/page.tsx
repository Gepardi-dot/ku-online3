
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Zap, ShieldCheck, Globe, Tags, Smartphone, Shirt, Home, Gamepad2, HeartPulse, Bike, Book, MoreHorizontal, Loader2, ListFilter, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, where, Query, DocumentData } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
    { name: 'Electronics', href: '#' },
    { name: 'Fashion', href: '#' },
    { name: 'Home & Garden', href: '#' },
    { name: 'Toys', href: '#' },
    { name: 'Sports', href: '#' },
    { name: 'Kids', href: '#' },
    { name: 'Motors', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Others', href: '#' },
]

const PAGE_SIZE = 12;


export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [condition, setCondition] = useState('all');
  const [city, setCity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const observer = useRef<IntersectionObserver>();
  const isFetching = useRef(false);

  const buildQuery = useCallback(() => {
    let q: Query<DocumentData> = collection(db, 'products');

    if(condition !== 'all') {
      q = query(q, where('condition', '==', condition));
    }
    if(city !== 'all') {
      q = query(q, where('location', '==', city));
    }

    q = query(q, orderBy('createdAt', 'desc'));
    
    return q;
  }, [condition, city]);
  
  const fetchProducts = useCallback(async (isInitialLoad = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    try {
      let q = buildQuery();
      
      if (!isInitialLoad && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      q = query(q, limit(PAGE_SIZE));
      
      const querySnapshot = await getDocs(q);
      const newProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(newLastDoc || null);
      setHasMore(newProducts.length === PAGE_SIZE);

      if(isInitialLoad) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

    } catch (error) {
      console.error("Error fetching products: ", error);
      // You might want to show a toast message to the user here
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [buildQuery, lastDoc]);

  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchProducts(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, condition, city]);


  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
            fetchProducts();
        }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchProducts]);


  return (
    <AppLayout>
      <div className="flex flex-col">

        {/* Categories Section */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
              <h3 className="text-lg font-semibold mr-4">Categories:</h3>
              {categories.map((category) => (
                <Link href={category.href} key={category.name} className="font-medium text-muted-foreground hover:text-primary transition-colors">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section id="special-offers" className="pt-6 pb-12 bg-accent">
          <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Latest Listings</h2>
                  <Button asChild variant="link" className="text-primary font-semibold">
                      <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
              </div>

            {/* Filters Bar */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex justify-between items-center"
                >
                    <div className="flex items-center gap-2">
                        <ListFilter className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Filter & Sort:</span>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", { 'rotate-180': showFilters })} />
                </button>

                <div className={cn("mt-4 pt-4 border-t transition-all duration-300 ease-in-out", {
                     'hidden': !showFilters
                })}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <Select value={condition} onValueChange={setCondition}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Conditions</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                                    <SelectItem value="Used - Good">Used - Good</SelectItem>
                                    <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={city} onValueChange={setCity}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    <SelectItem value="Erbil">Erbil</SelectItem>
                                    <SelectItem value="Sulaymaniyah">Sulaymaniyah</SelectItem>
                                    <SelectItem value="Duhok">Duhok</SelectItem>
                                    <SelectItem value="Zaxo">Zaxo</SelectItem>
                                </SelectContent>
                            </Select>

                             <Select value={sortBy} onValueChange={setSortBy} disabled>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt_desc">Sort by: Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {isLoading && products.length === 0 ? (
                  Array.from({ length: PAGE_SIZE }).map((_, index) => (
                      <Card key={index}>
                          <CardContent className="flex flex-col aspect-square items-center justify-center p-2 gap-2">
                             <Skeleton className="w-full h-32 rounded-lg" />
                             <Skeleton className="w-3/4 h-4 mt-1" />
                             <Skeleton className="w-1/2 h-6" />
                          </CardContent>
                      </Card>
                  ))
                ) : (
                  products.map((product, index) => {
                      if(products.length === index + 1) {
                          return <div ref={lastProductElementRef} key={product.id}><ProductCard product={product} /></div>
                      }
                      return <ProductCard key={product.id} product={product} />
                  })
                )}
              </div>
              {isLoading && products.length > 0 && (
                  <div className="flex justify-center mt-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              )}
              {!isLoading && !hasMore && products.length > 0 && (
                <p className="text-center text-muted-foreground mt-8">You've reached the end of the list.</p>
              )}
               {!isLoading && products.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                </div>
              )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is KU-ONLINE reliable and safe to use?</AccordionTrigger>
                        <AccordionContent>
                         Yes, KU-ONLINE is a trustworthy online shopping platform. We prioritize transaction security with buyer protection policies that ensure you can shop with confidence.
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
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with KU-ONLINE</h2>
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
