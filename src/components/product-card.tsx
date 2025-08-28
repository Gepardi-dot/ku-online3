import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(((Math.random() * 20) + 10)); // Random discount between 10-30%
  const originalPrice = product.price / (1 - (discount / 100));

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.imageHint}
          />
          <Badge variant="destructive" className="absolute top-3 left-3">-{discount}%</Badge>
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary">
            {product.name}
          </h3>
          
          <div className="mt-2">
            <span className="font-bold text-primary text-lg">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(product.price)}
            </span>
             <span className="text-gray-400 text-sm line-through ml-2">
                {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(originalPrice)}
            </span>
          </div>

          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <div className="flex text-yellow-400">
              {[...Array(Math.floor(product.seller.rating))].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              {product.seller.rating % 1 >= 0.5 && <Star className="w-3 h-3 fill-current" />}
              {[...Array(5 - Math.ceil(product.seller.rating))].map((_, i) => <Star key={i} className="w-3 h-3 text-gray-300 fill-current" />)}
            </div>
            <span className="ml-2">({(Math.random() * 5).toFixed(1)}k)</span>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
              <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground truncate">{product.seller.name}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
