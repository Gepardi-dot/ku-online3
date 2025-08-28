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

const placeholderProducts: Omit<Product, 'name' | 'id' | 'imageUrl' | 'imageHint' | 'description'>[] = [
    // These are just for visual structure before real data loads
    { price: 100000, currency: 'IQD', seller: { name: 'Seller A', avatarUrl: 'https://picsum.photos/seed/sa/40/40', rating: 4.5 }, category: 'Other', condition: 'New', createdAt: '1 day ago' },
    { price: 120000, currency: 'IQD', seller: { name: 'Seller B', avatarUrl: 'https://picsum.photos/seed/sb/40/40', rating: 4.7 }, category: 'Other', condition: 'Used - Like New', createdAt: '3 days ago' },
    { price: 80000, currency: 'IQD', seller: { name: 'Seller C', avatarUrl: 'https://picsum.photos/seed/sc/40/40', rating: 4.2 }, category: 'Other', condition: 'New', createdAt: '1 week ago' },
    { price: 150000, currency: 'IQD', seller: { name: 'Seller D', avatarUrl: 'https://picsum.photos/seed/sd/40/40', rating: 4.8 }, category: 'Other', condition: 'Used - Good', createdAt: '2 days ago' },
    { price: 200000, currency: 'IQD', seller: { name: 'Seller E', avatarUrl: 'https://picsum.photos/seed/se/40/40', rating: 4.9 }, category: 'Other', condition: 'New', createdAt: '4 days ago' },
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
  
  const recommendedProducts: Product[] = recommendations.map((name, index) => {
    const baseProduct = placeholderProducts[index % placeholderProducts.length];
    return {
        ...baseProduct,
        id: `rec-${index}`,
        name,
        description: `This is a recommended item: ${name}`,
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
