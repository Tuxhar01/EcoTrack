'use server';

/**
 * @fileOverview An AI agent that answers carbon emission-related questions.
 *
 * - answerCarbonEmissionQuestion - A function that handles answering carbon emission questions.
 * - AnswerCarbonEmissionQuestionInput - The input type for the answerCarbonEmissionQuestion function.
 * - AnswerCarbonEmissionQuestionOutput - The return type for the answerCarbonEmissionQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCarbonEmissionQuestionInputSchema = z.object({
  query: z.string().describe('The user query about carbon emissions or the EcoTrack application.'),
});

export type AnswerCarbonEmissionQuestionInput = z.infer<
  typeof AnswerCarbonEmissionQuestionInputSchema
>;

const AnswerCarbonEmissionQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});

export type AnswerCarbonEmissionQuestionOutput = z.infer<
  typeof AnswerCarbonEmissionQuestionOutputSchema
>;

export async function answerCarbonEmissionQuestion(
  input: AnswerCarbonEmissionQuestionInput
): Promise<AnswerCarbonEmissionQuestionOutput> {
  return answerCarbonEmissionQuestionFlow(input);
}

const answerCarbonEmissionQuestionPrompt = ai.definePrompt({
  name: 'answerCarbonEmissionQuestionPrompt',
  input: {schema: AnswerCarbonEmissionQuestionInputSchema},
  output: {schema: AnswerCarbonEmissionQuestionOutputSchema},
  prompt: `You are a carbon footprint assistant for the EcoTrack application.
Your role is to answer user questions about carbon emissions, the application, and how activities impact their carbon footprint.

If the user message is related to carbon footprint, emissions, activities tracked in EcoTrack, or sustainability, you should respond normally.

For queries outside this scope, you must respond with exactly: "sorry my ai model is not trained to give that answer"

User Query: {{{query}}}`,
});

const answerCarbonEmissionQuestionFlow = ai.defineFlow(
  {
    name: 'answerCarbonEmissionQuestionFlow',
    inputSchema: AnswerCarbonEmissionQuestionInputSchema,
    outputSchema: AnswerCarbonEmissionQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerCarbonEmissionQuestionPrompt(input);
    return output!;
  }
);
