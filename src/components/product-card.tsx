import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary mb-2">
            {product.name}
          </h3>
          
          <div className="flex-grow space-y-2">
            <p className="font-bold text-primary text-lg">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(product.price)}
            </p>
             <div className="flex items-center text-sm text-muted-foreground/90 gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <p className="text-base font-medium">{product.location}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground/90 gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <p className="text-xs">{product.createdAt}</p>
            </div>
            <Badge variant="outline" className="font-normal text-lg py-1 px-3">{product.condition}</Badge>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Avatar className="h-7 w-7">
              <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
              <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground truncate">{product.seller.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
