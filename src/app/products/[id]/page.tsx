
"use client"
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import ProductDetailClient from './product-detail-client';
import { createSupabaseClient } from '@/lib/supabase-client';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
          setLoading(false);
          setError("No product ID provided.");
          return;
      };
      try {
        const { data, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('id', params.id)
            .single();

        if (fetchError) throw fetchError;
        
        if (data) {
          setProduct(data as Product);
        } else {
          setError("Product not found.");
        }
      } catch (err: any) {
          console.error("Error fetching product:", err);
          setError(err.message || "Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, supabase]);

  if (loading) {
      return (
          <AppLayout>
              <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[60vh]">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
          </AppLayout>
      )
  }

  if (error) {
       return (
          <AppLayout>
              <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[60vh]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
              </div>
          </AppLayout>
      )
  }

  return (
    <AppLayout>
        {product && <ProductDetailClient product={product} />}
    </AppLayout>
  );
}
