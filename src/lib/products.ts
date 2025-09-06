import { createClient } from '../../utils/supabase/client'
import type { Product } from './types'

export interface CreateProductData {
  name: string
  description: string
  price: number
  currency: string
  category: string
  condition: string
  location: string
  imageUrl: string
  imageHint?: string
  tags?: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

// Get all products with pagination and filtering
export async function getProducts(options?: {
  limit?: number
  offset?: number
  category?: string
  location?: string
  search?: string
  condition?: string
  priceMin?: number
  priceMax?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .order('createdAt', { ascending: false })
    
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  if (options?.location) {
    query = query.ilike('location', `%${options.location}%`)
  }
  
  if (options?.condition) {
    query = query.eq('condition', options.condition)
  }
  
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }
  
  if (options?.priceMin !== undefined) {
    query = query.gte('price', options.priceMin)
  }
  
  if (options?.priceMax !== undefined) {
    query = query.lte('price', options.priceMax)
  }
    
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  
  return data as Product[]
}

// Get a single product by ID
export async function getProduct(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching product:', error)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
  
  return data as Product
}

// Create a new product (requires authentication)
export async function createProduct(productData: CreateProductData) {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required to create products')
  }
  
  // Get user profile for seller information
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (profileError) {
    // Create profile if it doesn't exist
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url || null
      })
      
    if (createError) {
      console.error('Error creating profile:', createError)
    }
  }
  
  const seller = {
    name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || ''
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      sellerId: user.id,
      seller: seller
    })
    .select()
    .single()
    
  if (error) {
    console.error('Error creating product:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }
  
  return data as Product
}

// Update a product (only by owner)
export async function updateProduct(productData: UpdateProductData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required to update products')
  }
  
  const { id, ...updateData } = productData
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .eq('sellerId', user.id) // Ensure user can only update their own products
    .select()
    .single()
    
  if (error) {
    console.error('Error updating product:', error)
    throw new Error(`Failed to update product: ${error.message}`)
  }
  
  return data as Product
}

// Delete a product (only by owner)
export async function deleteProduct(id: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required to delete products')
  }
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('sellerId', user.id) // Ensure user can only delete their own products
    
  if (error) {
    console.error('Error deleting product:', error)
    throw new Error(`Failed to delete product: ${error.message}`)
  }
  
  return { success: true }
}

// Get products by seller
export async function getProductsBySeller(sellerId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sellerId', sellerId)
    .order('createdAt', { ascending: false })
    
  if (error) {
    console.error('Error fetching seller products:', error)
    throw new Error(`Failed to fetch seller products: ${error.message}`)
  }
  
  return data as Product[]
}

// Get categories (distinct categories from products)
export async function getCategories() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('category')
    
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  // Get unique categories
  const categories = [...new Set(data.map(item => item.category))].filter(Boolean)
  
  return categories
}

// Get locations (distinct locations from products)
export async function getLocations() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('location')
    
  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }
  
  // Get unique locations
  const locations = [...new Set(data.map(item => item.location))].filter(Boolean)
  
  return locations
}