'use server';

/**
 * @fileOverview Recommends similar items based on the product a buyer is currently viewing.
 *
 * - getSimilarItemRecommendations - A function that handles the process of recommending similar items.
 * - SimilarItemRecommendationsInput - The input type for the getSimilarItemRecommendations function.
 * - SimilarItemRecommendationsOutput - The return type for the getSimilarItemRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimilarItemRecommendationsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product the buyer is currently viewing.'),
  productCategory: z.string().describe('The category of the product.'),
  buyerPreferences: z
    .string()
    .optional()
    .describe('Optional: The buyer\u2019s stated preferences or search history.'),
});
export type SimilarItemRecommendationsInput = z.infer<
  typeof SimilarItemRecommendationsInputSchema
>;

const SimilarItemRecommendationsOutputSchema = z.object({
  recommendedItems: z
    .array(z.string())
    .describe('A list of recommended items similar to the viewed product.'),
});
export type SimilarItemRecommendationsOutput = z.infer<
  typeof SimilarItemRecommendationsOutputSchema
>;

export async function getSimilarItemRecommendations(
  input: SimilarItemRecommendationsInput
): Promise<SimilarItemRecommendationsOutput> {
  return similarItemRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'similarItemRecommendationsPrompt',
  input: {schema: SimilarItemRecommendationsInputSchema},
  output: {schema: SimilarItemRecommendationsOutputSchema},
  prompt: `You are an expert recommendation system for an e-commerce marketplace.

  Based on the description and category of the product the buyer is currently viewing, and optionally their stated preferences, recommend a list of similar items that they might be interested in.

  Product Description: {{{productDescription}}}
  Product Category: {{{productCategory}}}
  Buyer Preferences: {{{buyerPreferences}}}

  Return a list of product names that are similar to the above item.  Do not include the item itself in the recommendations.
  Do not include any introductory or concluding sentences.  Just the list of product names.
  `,
  config: {
    model: 'googleai/gemini-pro',
  },
});

const similarItemRecommendationsFlow = ai.defineFlow(
  {
    name: 'similarItemRecommendationsFlow',
    inputSchema: SimilarItemRecommendationsInputSchema,
    outputSchema: SimilarItemRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
