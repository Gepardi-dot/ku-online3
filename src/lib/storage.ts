import { createClient } from '../../utils/supabase/client'

export interface UploadResult {
  url: string
  path: string
}

// Upload image to Supabase Storage
export async function uploadProductImage(file: File, productId?: string): Promise<UploadResult> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required for uploads')
  }
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `products/${user.id}/${fileName}`
  
  // Upload file
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
    
  if (error) {
    console.error('Error uploading file:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(data.path)
    
  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

// Upload avatar image
export async function uploadAvatarImage(file: File): Promise<UploadResult> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required for uploads')
  }
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `avatar-${Date.now()}.${fileExt}`
  const filePath = `avatars/${user.id}/${fileName}`
  
  // Upload file
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true // Allow overwriting existing avatars
    })
    
  if (error) {
    console.error('Error uploading avatar:', error)
    throw new Error(`Failed to upload avatar: ${error.message}`)
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(data.path)
    
  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

// Delete image from storage
export async function deleteImage(path: string, bucket: 'products' | 'avatars' = 'products') {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
    
  if (error) {
    console.error('Error deleting image:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
  
  return { success: true }
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)' 
    }
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'Image file size must be less than 5MB' 
    }
  }
  
  return { valid: true }
}