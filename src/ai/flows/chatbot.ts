
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that returns a chatbot response.
 */

import {ai} from '@/ai/genkit';
import { Part } from 'genkit/cohere';
import { AskChatbotInputSchema, type AskChatbotInput } from '@/ai/types';
import { z } from 'genkit';

export async function askChatbot(input: AskChatbotInput): Promise<string> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: AskChatbotInputSchema,
    outputSchema: z.string(),
  },
  async ({ query, history }) => {
    const systemPrompt = `You are a friendly and helpful medical AI assistant named MediMind.
    Your role is to answer user questions about health, symptoms, and medical conditions.
    Provide informative and safe responses.
    Always include a disclaimer that you are not a real doctor and the user should consult a professional.
    Do not provide a diagnosis. You can explain what conditions might be associated with symptoms, but do not diagnose.`;

    const {output} = await ai.generate({
      prompt: query,
      system: systemPrompt,
      history: history as { role: 'user' | 'model'; parts: Part[] }[] | undefined,
    });

    return output.text;
  }
);
