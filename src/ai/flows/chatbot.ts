
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that returns a chatbot response.
 * - AskChatbotInput - The input type for the function.
 */

import {ai} from '@/ai/genkit';
import { Part } from 'genkit/cohere';
import {z} from 'genkit';

const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({text: z.string()})),
});

export const AskChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s query.'),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
});
export type AskChatbotInput = z.infer<typeof AskChatbotInputSchema>;

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
    const prompt = `You are a friendly and helpful medical AI assistant named MediMind.
    Your role is to answer user questions about health, symptoms, and medical conditions.
    Provide informative and safe responses.
    Always include a disclaimer that you are not a real doctor and the user should consult a professional.
    Do not provide a diagnosis. You can explain what conditions might be associated with symptoms, but do not diagnose.

    Here is the conversation history:
    ${(history || []).map(m => `${m.role}: ${m.parts[0].text}`).join('\n')}
    `;

    const {output} = await ai.generate({
        prompt: prompt,
        history: history as { role: 'user' | 'model'; parts: Part[] }[] | undefined,
        input: {
            query: query
        },
    });

    return output.text;
  }
);
