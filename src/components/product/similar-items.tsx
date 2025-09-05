"use client";
import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';

interface SimilarItemsProps {
  product: Product;
}

export default function SimilarItems({ product }: SimilarItemsProps) {
  const { products: allProducts, isLoading: productsLoading } = useRealtimeProducts();
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productsLoading && allProducts) {
      setIsLoading(true);
      
      // Filter products from the same category, excluding the current product
      const filtered = allProducts.filter(p => 
        p.category === product.category && p.id !== product.id
      );
      
      // Simulate a brief delay for better UX
      setTimeout(() => {
        setSimilarProducts(filtered.slice(0, 6)); // Limit to 6 similar items
        setIsLoading(false);
      }, 300);
    }
  }, [allProducts, productsLoading, product]);

  if (isLoading || productsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">You Might Also Like</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="p-1" key={index}>
                <Card>
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-4">
                    <Skeleton className="w-full h-32 rounded-lg" />
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-1/2 h-8" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">You Might Also Like</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12l-6-3m12 6l6-3" />
              </svg>
              <p className="text-gray-600">No similar items found in this category.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: similarProducts.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent>
            {similarProducts.map((recProduct) => (
              <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={recProduct.id}>
                <div className="p-1 h-full">
                  <ProductCard product={recProduct} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
