import { createClient } from '../../utils/supabase/client'

// Database initialization and schema setup
export async function initializeDatabase() {
  const supabase = createClient()
  
  // Create the products table if it doesn't exist
  const { error: tableError } = await supabase.rpc('create_products_table_if_not_exists')
  
  if (tableError && !tableError.message.includes('already exists')) {
    console.error('Error creating products table:', tableError)
  }

  // Create users profile table for seller information
  const { error: profileError } = await supabase.rpc('create_user_profiles_table_if_not_exists')
  
  if (profileError && !profileError.message.includes('already exists')) {
    console.error('Error creating profiles table:', profileError)
  }
  
  return { success: true }
}

// Test connection and create sample data if needed
export async function seedDatabase() {
  const supabase = createClient()
  
  // Check if we have any products
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id')
    .limit(1)
    
  if (!existingProducts || existingProducts.length === 0) {
    console.log('No products found, database may need to be set up manually in Supabase dashboard')
  }
  
  return { success: true, hasData: existingProducts && existingProducts.length > 0 }
}