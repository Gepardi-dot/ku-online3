'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProduct, type Product } from '../../../lib/products'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Card, CardContent } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import { ArrowLeft, MapPin, Calendar, Heart, Share2, Flag, MessageCircle, Phone, Mail } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import Link from 'next/link'

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const productId = params.id as string

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      
      try {
        setLoading(true)
        setError(null)
        const productData = await getProduct(productId)
        setProduct(productData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product'
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, toast])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleContact = (method: 'message' | 'phone' | 'email') => {
    toast({
      title: "Feature Coming Soon",
      description: `${method.charAt(0).toUpperCase() + method.slice(1)} contact functionality will be available soon.`
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Return to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/800x400?text=No+Image'
                }}
              />
            </Card>

            {/* Product Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Listed on {formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(product.price, product.currency)}
                      </div>
                      <Badge className="mt-2">{product.condition}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Category</h3>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Condition</h3>
                      <Badge variant="outline">{product.condition}</Badge>
                    </div>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Info and Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller.avatarUrl} alt={product.seller.name} />
                    <AvatarFallback>
                      {product.seller.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.seller.name}</h4>
                    <p className="text-sm text-gray-600">Member since 2024</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => handleContact('message')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleContact('phone')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Seller
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleContact('email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Tips</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Meet in a public place for transactions</p>
                  <p>• Inspect items carefully before purchasing</p>
                  <p>• Use secure payment methods</p>
                  <p>• Trust your instincts about deals</p>
                  <p>• Report suspicious activity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}