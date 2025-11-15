// Implemented the Genkit flow for suggesting personalized carbon reduction actions based on user's logged activities.

'use server';

/**
 * @fileOverview This file defines a Genkit flow that provides personalized suggestions for reducing carbon footprint based on user activities.
 *
 * - suggestCarbonReductionActions - An async function that takes user activity data and returns tailored suggestions.
 * - SuggestCarbonReductionActionsInput - The input type for the suggestCarbonReductionActions function.
 * - SuggestCarbonReductionActionsOutput - The output type for the suggestCarbonReductionActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCarbonReductionActionsInputSchema = z.object({
  transportEmissions: z.number().describe('Total carbon emissions from transportation activities in kgCO2e.'),
  energyEmissions: z.number().describe('Total carbon emissions from energy consumption in kgCO2e.'),
  foodEmissions: z.number().describe('Total carbon emissions from food consumption in kgCO2e.'),
  recentActivities: z.string().describe('A summary of the user recent activities.'),
});

export type SuggestCarbonReductionActionsInput = z.infer<
  typeof SuggestCarbonReductionActionsInputSchema
>;

const SuggestCarbonReductionActionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of actionable suggestions for the user to reduce their carbon footprint, tailored to their recent activities and emissions profile.'
    ),
});

export type SuggestCarbonReductionActionsOutput = z.infer<
  typeof SuggestCarbonReductionActionsOutputSchema
>;

export async function suggestCarbonReductionActions(
  input: SuggestCarbonReductionActionsInput
): Promise<SuggestCarbonReductionActionsOutput> {
  return suggestCarbonReductionActionsFlow(input);
}

const suggestCarbonReductionActionsPrompt = ai.definePrompt({
  name: 'suggestCarbonReductionActionsPrompt',
  input: {schema: SuggestCarbonReductionActionsInputSchema},
  output: {schema: SuggestCarbonReductionActionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized carbon reduction suggestions to users based on their recent activities and emissions data.

  Here's a summary of the user's recent activities: {{{recentActivities}}}

  Here's a breakdown of their emissions:
  - Transportation: {{{transportEmissions}}} kgCO2e
  - Energy: {{{energyEmissions}}} kgCO2e
  - Food: {{{foodEmissions}}} kgCO2e

  Based on this information, provide a list of actionable suggestions the user can take to reduce their carbon footprint. Focus on the areas where they have the highest emissions. Be specific and provide concrete examples.

  Format your response as a single paragraph of suggestions.
  `,
});

const suggestCarbonReductionActionsFlow = ai.defineFlow(
  {
    name: 'suggestCarbonReductionActionsFlow',
    inputSchema: SuggestCarbonReductionActionsInputSchema,
    outputSchema: SuggestCarbonReductionActionsOutputSchema,
  },
  async input => {
    const {output} = await suggestCarbonReductionActionsPrompt(input);
    return output!;
  }
);
