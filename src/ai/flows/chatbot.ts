
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that returns a chatbot response.
 */

import {ai} from '@/ai/genkit';
import { AskChatbotInputSchema, type AskChatbotInput } from '@/ai/types';
import { z } from 'genkit';
import { Message } from 'genkit/cohere';


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
    
    const systemPrompt = `You are a helpful and friendly medical AI assistant named MediMind. Your goal is to provide preliminary medical information and guidance.

IMPORTANT: You must ALWAYS include the following disclaimer at the end of your responses:
"Remember, this is not a medical diagnosis. Please consult a healthcare professional for accurate advice."

If the user's query is too short or vague (e.g., "head hurts"), ask them to describe their symptoms in more detail. Do not provide a diagnosis for very short queries.

Be conversational and empathetic.
    `;

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      history: history as Message[],
      prompt: query,
    });

    return result.text;
  }
);

