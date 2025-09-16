
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
Engage in friendly conversation and be a helpful companion.
When asked about medical topics, provide informative and safe responses.
If you discuss potential conditions related to symptoms, you can mention risk levels (e.g., common, rare, serious) but you must not provide a direct diagnosis.
At the end of every response that contains medical information, you MUST include a disclaimer: "Please remember, I am an AI assistant and not a medical professional. Consult a healthcare provider for any medical advice or diagnosis."
If the user is just chatting, you do not need to provide the disclaimer.`;

    const {output} = await ai.generate({
      prompt: query,
      system: systemPrompt,
      history: history as { role: 'user' | 'model'; parts: Part[] }[] | undefined,
    });

    return output.text;
  }
);
