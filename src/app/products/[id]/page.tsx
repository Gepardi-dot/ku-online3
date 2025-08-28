"use client"
import { useState } from 'react';
import AppLayout from '@/components/layout/app-layout';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Share2, Heart, Languages, Loader2, Calendar, Tag, MapPin } from 'lucide-react';
import type { Product } from '@/lib/types';
import SimilarItems from '@/components/product/similar-items';
import { translateText } from '@/ai/flows/real-time-translation';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const product: Product = {
  id: '1',
  name: 'Handwoven Kurdish Rug',
  price: 150000,
  currency: 'IQD',
  imageUrl: 'https://picsum.photos/seed/rug/800/600',
  imageHint: 'kurdish rug',
  seller: {
    name: 'Nishtiman Crafts',
    avatarUrl: 'https://picsum.photos/seed/seller1/40/40',
    rating: 4.8,
  },
  category: 'Home & Garden',
  description: 'Beautiful handwoven rug with traditional Kurdish patterns. Made from 100% pure wool, this piece is a testament to the rich cultural heritage of the region. Its vibrant colors and intricate design make it a perfect centerpiece for any living room or a unique wall hanging. The rug measures approximately 120cm by 180cm. It is durable, naturally stain-resistant, and will bring warmth and artistry to your home for years to come.',
  condition: 'New',
  createdAt: '2 days ago',
  location: 'Erbil',
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();
  
  const handleTranslate = async (targetLanguage: 'Kurdish' | 'Arabic' | 'English') => {
    setIsTranslating(true);
    setTranslatedDescription('');
    try {
        const result = await translateText({
            text: product.description,
            sourceLanguage: 'English',
            targetLanguage: targetLanguage,
        });
        setTranslatedDescription(result.translatedText);
    } catch(error) {
        console.error("Translation failed", error);
        toast({
            variant: "destructive",
            title: "Translation Failed",
            description: "Could not translate the description. Please try again."
        })
    } finally {
        setIsTranslating(false);
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  data-ai-hint={product.imageHint}
                  priority
                />
              </div>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="font-headline text-3xl lg:text-4xl font-bold">{product.name}</h1>
              <p className="font-bold text-primary text-3xl">
                {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(product.price)}
              </p>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Condition: <span className="font-medium text-foreground">{product.condition}</span></span>
                  </div>
                   <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Listed: <span className="font-medium text-foreground">{product.createdAt}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: <span className="font-medium text-foreground">{product.location}</span></span>
                  </div>
              </div>
            </div>

            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{product.seller.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.seller.rating}</span>
                    <span className="text-sm text-muted-foreground">(120 reviews)</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            <div className="flex flex-wrap gap-2">
              <Button size="lg" className="flex-1">
                <MessageSquare className="mr-2 h-5 w-5" /> Contact Seller
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="mr-2 h-5 w-5" /> Favorite
              </Button>
              <Button size="lg" variant="outline" className="px-3">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-12 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle className="font-headline text-2xl">Description</CardTitle>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isTranslating}>
                              {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Languages className="mr-2 h-4 w-4" />}
                              Translate
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTranslate('Kurdish')}>کوردی (سۆرانی)</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTranslate('Arabic')}>العربية</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTranslatedDescription('')}>English (Original)</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm sm:prose-base max-w-none text-foreground">
              <p>{translatedDescription || product.description}</p>
            </CardContent>
          </Card>

          <SimilarItems product={product} />
        </div>
      </div>
    </AppLayout>
  );
}
