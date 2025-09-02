
'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().nonempty('Please select a category.'),
  condition: z.enum(['New', 'Used - Like New', 'Used - Good', 'Used - Fair']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  location: z.string().nonempty('Please select a city.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  tags: z.string().optional(),
});

export async function createListingAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // 1. Validate user authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User is not authenticated.' };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  
  // 2. Validate form data
  const validatedFields = formSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const imageFile = formData.get('image') as File | null;
  if (!imageFile || imageFile.size === 0) {
    return { success: false, error: 'Product image is required.' };
  }

  try {
    // 3. Upload image to Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading image to Supabase:', uploadError);
      return { success: false, error: 'Could not upload image.' };
    }

    const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(uploadData.path);
      
    // 4. Add product data to Supabase database
    const productData = {
      ...validatedFields.data,
      tags: validatedFields.data.tags?.split(',').map((tag) => tag.trim()).filter(Boolean),
      currency: 'IQD',
      imageUrl,
      imageHint: '',
      sellerId: user.id,
      seller: {
        name: user.user_metadata.full_name || 'Anonymous',
        avatarUrl: user.user_metadata.avatar_url || '',
        rating: 0,
      },
      name: validatedFields.data.title,
    };
    
    const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

    if (insertError) {
      console.error('Error inserting product into Supabase:', insertError);
      return { success: false, error: 'Could not save listing to the database.' };
    }

    revalidatePath('/'); // Refresh the homepage cache
    return { success: true, productId: newProduct.id };

  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function generateAIAssistance(photoDataUri: string, title?: string, category?: string) {
    if (!photoDataUri) {
        return { success: false, error: "Please upload an image first to use the AI assistant." };
    }
    
    try {
        const result = await (await import('@/ai/flows/smart-listing-creation')).smartListingCreation({
            photoDataUri,
            title,
            category,
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("AI generation failed:", error);
        return { success: false, error: "Could not generate suggestions. Please try again." };
    }
}
