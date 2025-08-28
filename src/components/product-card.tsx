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
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            data-ai-hint={product.imageHint}
          />
        </div>
        <CardContent className="p-2 flex flex-col flex-grow">
          <h3 className="font-semibold text-xs leading-tight line-clamp-2 group-hover:text-primary mb-1">
            {product.name}
          </h3>
          
          <div className="flex-grow space-y-1.5">
            <p className="font-bold text-primary text-base">
              {new Intl.NumberFormat('en-IQ', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(product.price)}
            </p>
             <div className="flex items-center text-xs text-muted-foreground/90 gap-1">
                <MapPin className="h-3 w-3" />
                <p className="font-semibold">{product.location}</p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground/90 gap-1">
                <Calendar className="h-3 w-3" />
                <p>{product.createdAt}</p>
            </div>
            <Badge variant="outline" className="font-normal text-xs py-0.5 px-2">{product.condition}</Badge>
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
              <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-xs text-muted-foreground truncate">{product.seller.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
