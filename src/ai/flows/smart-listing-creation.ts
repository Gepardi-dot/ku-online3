'use server';

/**
 * @fileOverview AI-powered flow for smart listing creation.
 *
 * - smartListingCreation - A function that orchestrates the listing creation process.
 * - SmartListingCreationInput - The input type for the smartListingCreation function.
 * - SmartListingCreationOutput - The return type for the smartListingCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartListingCreationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().optional().describe('The title of the product, if available.'),
  category: z.string().optional().describe('The category of the product, if available.'),
});
export type SmartListingCreationInput = z.infer<typeof SmartListingCreationInputSchema>;

const SmartListingCreationOutputSchema = z.object({
  suggestedCategory: z.string().describe('The AI-suggested product category.'),
  suggestedDescription: z.string().describe('The AI-suggested product description.'),
  suggestedTags: z.array(z.string()).describe('The AI-suggested SEO-friendly tags.'),
  suggestedPrice: z.number().optional().describe('The AI-suggested price for the product.'),
});
export type SmartListingCreationOutput = z.infer<typeof SmartListingCreationOutputSchema>;

export async function smartListingCreation(input: SmartListingCreationInput): Promise<SmartListingCreationOutput> {
  return smartListingCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartListingCreationPrompt',
  input: {schema: SmartListingCreationInputSchema},
  output: {schema: SmartListingCreationOutputSchema},
  prompt: `You are an AI assistant that helps sellers create compelling listings for their products.

Based on the product image, generate a product category, a product description, and SEO-friendly tags.  If a title and category are provided, use them to help.

Product Image: {{media url=photoDataUri}}
Title: {{{title}}}
Category: {{{category}}}

Make sure the product category is from the KU-ONLINE categories, which include:
- Electronics
- Home & Garden
- Fashion
- Health & Beauty
- Sports & Outdoors
- Toys & Games
- Books & Media
- Other
`,
});

const smartListingCreationFlow = ai.defineFlow(
  {
    name: 'smartListingCreationFlow',
    inputSchema: SmartListingCreationInputSchema,
    outputSchema: SmartListingCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
