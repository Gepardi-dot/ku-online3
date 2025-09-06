'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Skeleton } from './ui/skeleton'
import { MapPin, Calendar, Heart, Share2, Eye } from 'lucide-react'
import Link from 'next/link'
import { getProducts, type Product } from '../lib/products'
import { useToast } from '../hooks/use-toast'

interface SearchFilters {
  search: string
  category: string
  location: string
  condition: string
  priceMin: number | undefined
  priceMax: number | undefined
}

interface ProductGridProps {
  filters?: SearchFilters
  limit?: number
}

export default function ProductGrid({ filters, limit = 20 }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const { toast } = useToast()

  const loadProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setIsLoading(true)
        setError(null)
      }
      
      const currentOffset = isLoadMore ? offset : 0
      
      // Filter out undefined values to avoid issues
      const searchParams: any = {
        limit,
        offset: currentOffset,
      }
      
      if (filters?.search) searchParams.search = filters.search
      if (filters?.category) searchParams.category = filters.category
      if (filters?.location) searchParams.location = filters.location
      if (filters?.condition) searchParams.condition = filters.condition
      if (filters?.priceMin !== undefined) searchParams.priceMin = filters.priceMin
      if (filters?.priceMax !== undefined) searchParams.priceMax = filters.priceMax
      
      const newProducts = await getProducts(searchParams)
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...newProducts])
      } else {
        setProducts(newProducts)
      }
      
      // Check if we have more products
      setHasMore(newProducts.length === limit)
      setOffset(isLoadMore ? currentOffset + limit : limit)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products'
      setError(errorMessage)
      
      // Only show toast for non-network errors in production
      if (!errorMessage.includes('network') && !errorMessage.includes('fetch')) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }, [filters, limit, offset, toast])

  // Load products when filters change
  useEffect(() => {
    setOffset(0)
    loadProducts(false)
  }, [filters])

  // Initial load
  useEffect(() => {
    loadProducts(false)
  }, [])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadProducts(true)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">Error Loading Products</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        <Button onClick={() => loadProducts(false)}>
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Eye className="mx-auto h-16 w-16 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500">
            {filters && (filters.search || filters.category || filters.location) 
              ? 'Try adjusting your search criteria or filters'
              : 'Be the first to list a product on the marketplace!'
            }
          </p>
        </div>
        {filters && (filters.search || filters.category || filters.location) && (
          <Button variant="outline" onClick={() => loadProducts(false)}>
            Clear Search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-95"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
              </Link>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button size="sm" variant="secondary" className="opacity-80 hover:opacity-100 h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="opacity-80 hover:opacity-100 h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="absolute bottom-2 left-2" variant="secondary">
                {product.condition}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                  <span>•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description || 'No description available'}
                </p>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(product.price, product.currency)}
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
                    <AvatarFallback className="text-xs">
                      {product.seller.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{product.seller.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={loadMore} 
            disabled={loadingMore}
            variant="outline"
          >
            {loadingMore ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}
    </div>
  )
}