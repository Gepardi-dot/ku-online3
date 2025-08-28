"use client";

import { useState, useEffect } from 'react';
import { getSimilarItemRecommendations } from '@/ai/flows/similar-item-recommendations';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '@/components/product-card'; // Assuming a generic product card component
import { Skeleton } from '@/components/ui/skeleton';

interface SimilarItemsProps {
  product: Product;
}

const placeholderProducts: Product[] = [
    // These are just for visual structure before real data loads
    { id: 'p1', name: 'Placeholder Item 1', price: 100000, currency: 'IQD', imageUrl: 'https://picsum.photos/seed/p1/400/300', imageHint: 'placeholder', seller: { name: 'Seller A', avatarUrl: 'https://picsum.photos/seed/sa/40/40', rating: 4.5 }, category: 'Other', description: '', condition: 'New' },
    { id: 'p2', name: 'Placeholder Item 2', price: 120000, currency: 'IQD', imageUrl: 'https://picsum.photos/seed/p2/400/300', imageHint: 'placeholder', seller: { name: 'Seller B', avatarUrl: 'https://picsum.photos/seed/sb/40/40', rating: 4.7 }, category: 'Other', description: '', condition: 'New' },
    { id: 'p3', name: 'Placeholder Item 3', price: 80000, currency: 'IQD', imageUrl: 'https://picsum.photos/seed/p3/400/300', imageHint: 'placeholder', seller: { name: 'Seller C', avatarUrl: 'https://picsum.photos/seed/sc/40/40', rating: 4.2 }, category: 'Other', description: '', condition: 'New' },
    { id: 'p4', name: 'Placeholder Item 4', price: 150000, currency: 'IQD', imageUrl: 'https://picsum.photos/seed/p4/400/300', imageHint: 'placeholder', seller: { name: 'Seller D', avatarUrl: 'https://picsum.photos/seed/sd/40/40', rating: 4.8 }, category: 'Other', description: '', condition: 'New' },
    { id: 'p5', name: 'Placeholder Item 5', price: 200000, currency: 'IQD', imageUrl: 'https://picsum.photos/seed/p5/400/300', imageHint: 'placeholder', seller: { name: 'Seller E', avatarUrl: 'https://picsum.photos/seed/se/40/40', rating: 4.9 }, category: 'Other', description: '', condition: 'New' },
];

export default function SimilarItems({ product }: SimilarItemsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const result = await getSimilarItemRecommendations({
          productDescription: product.description,
          productCategory: product.category,
        });
        setRecommendations(result.recommendedItems);
      } catch (error) {
        console.error("Failed to fetch similar items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [product]);
  
  const recommendedProducts = recommendations.map((name, index) => {
    const baseProduct = placeholderProducts[index % placeholderProducts.length];
    return {
        ...baseProduct,
        id: `rec-${index}`,
        name,
        imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/300`,
        imageHint: name.split(' ').slice(0, 2).join(' ').toLowerCase(),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-4">
                               <Skeleton className="w-full h-32 rounded-lg" />
                               <Skeleton className="w-3/4 h-6" />
                               <Skeleton className="w-1/2 h-8" />
                            </CardContent>
                        </Card>
                    </div>
                  </CarouselItem>
                ))
              : recommendedProducts.map((recProduct, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <ProductCard product={recProduct} />
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex"/>
          <CarouselNext className="hidden sm:flex"/>
        </Carousel>
      </CardContent>
    </Card>
  );
}
