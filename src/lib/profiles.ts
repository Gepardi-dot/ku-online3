import { createClient } from '../../utils/supabase/client'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  location?: string
  phone?: string
  avatar_url?: string
}

// Get user profile
export async function getUserProfile(userId?: string) {
  const supabase = createClient()
  
  let targetUserId = userId
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    targetUserId = user.id
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()
    
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching profile:', error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }
  
  return data as UserProfile | null
}

// Create or update user profile
export async function upsertUserProfile(profileData: UpdateProfileData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
    
  if (error) {
    console.error('Error upserting profile:', error)
    throw new Error(`Failed to update profile: ${error.message}`)
  }
  
  return data as UserProfile
}

// Update profile
export async function updateUserProfile(profileData: UpdateProfileData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(`Failed to update profile: ${error.message}`)
  }
  
  return data as UserProfile
}

// Get current user's products
export async function getCurrentUserProducts() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sellerId', user.id)
    .order('createdAt', { ascending: false })
    
  if (error) {
    console.error('Error fetching user products:', error)
    throw new Error(`Failed to fetch user products: ${error.message}`)
  }
  
  return data
}