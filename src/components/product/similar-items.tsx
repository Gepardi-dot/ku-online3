"use client";

import { useState, useEffect } from 'react';
import { getSimilarItemRecommendations } from '@/ai/flows/similar-item-recommendations';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface SimilarItemsProps {
  product: Product;
}

const placeholderProducts: Omit<Product, 'name' | 'id' | 'imageUrl' | 'imageHint' | 'description' | 'location' | 'createdAt'>[] = [
    { price: 100000, currency: 'IQD', seller: { name: 'Seller A', avatarUrl: 'https://picsum.photos/seed/sa/40/40', rating: 4.5 }, category: 'Other', condition: 'New', sellerId: '1' },
    { price: 120000, currency: 'IQD', seller: { name: 'Seller B', avatarUrl: 'https://picsum.photos/seed/sb/40/40', rating: 4.7 }, category: 'Other', condition: 'Used - Like New', sellerId: '2' },
    { price: 80000, currency: 'IQD', seller: { name: 'Seller C', avatarUrl: 'https://picsum.photos/seed/sc/40/40', rating: 4.2 }, category: 'Other', condition: 'New', sellerId: '3' },
    { price: 150000, currency: 'IQD', seller: { name: 'Seller D', avatarUrl: 'https://picsum.photos/seed/sd/40/40', rating: 4.8 }, category: 'Other', condition: 'Used - Good', sellerId: '4' },
    { price: 200000, currency: 'IQD', seller: { name: 'Seller E', avatarUrl: 'https://picsum.photos/seed/se/40/40', rating: 4.9 }, category: 'Other', condition: 'New', sellerId: '5' },
];

export default function SimilarItems({ product }: SimilarItemsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
        toast({
            variant: "default",
            title: "Could Not Load Recommendations",
            description: "There was an issue fetching similar items.",
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [product, toast]);
  
  const recommendedProducts: Product[] = recommendations.map((name, index) => {
    const baseProduct = placeholderProducts[index % placeholderProducts.length];
    return {
        ...baseProduct,
        id: `rec-${index}`,
        name,
        description: `This is a recommended item: ${name}`,
        imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/300`,
        imageHint: name.split(' ').slice(0, 2).join(' ').toLowerCase(),
        location: ['Erbil', 'Sulaymaniyah', 'Duhok'][index % 3],
        createdAt: new Date() as any, // Using current date for placeholder
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
            loop: recommendations.length > 3,
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
