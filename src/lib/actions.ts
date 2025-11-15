'use server';

import {
  answerCarbonEmissionQuestion,
  AnswerCarbonEmissionQuestionInput,
} from '@/ai/flows/answer-carbon-emission-questions';
import {
  suggestCarbonReductionActions,
  SuggestCarbonReductionActionsInput,
} from '@/ai/flows/suggest-carbon-reduction-actions';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1),
});

export async function handleChatSubmit(formData: FormData) {
  const parsed = chatSchema.safeParse({
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: 'Invalid message provided.' };
  }

  const input: AnswerCarbonEmissionQuestionInput = {
    query: parsed.data.message,
  };

  try {
    const result = await answerCarbonEmissionQuestion(input);
    return { response: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while processing your request.' };
  }
}

const suggestionSchema = z.object({
  transportEmissions: z.number(),
  energyEmissions: z.number(),
  foodEmissions: z.number(),
  recentActivities: z.string(),
});

export async function getAiSuggestions(data: z.infer<typeof suggestionSchema>) {
    const parsed = suggestionSchema.safeParse(data);

    if (!parsed.success) {
        return { error: 'Invalid input for suggestions.' };
    }

    const input: SuggestCarbonReductionActionsInput = parsed.data;

    try {
        const result = await suggestCarbonReductionActions(input);
        return { suggestions: result.suggestions };
    } catch (e) {
        console.error(e);
        return { error: 'An error occurred while fetching suggestions.' };
    }
}
