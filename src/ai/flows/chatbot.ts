
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that returns a chatbot response.
 */

import {ai} from '@/ai/genkit';
import { AskChatbotInputSchema, type AskChatbotInput } from '@/ai/types';
import { z } from 'genkit';
import { Message } from '@genkit-ai/googleai';


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
    
    const systemPrompt = `You are a helpful and friendly medical AI assistant named MediMind. 
    Your goal is to provide preliminary medical information and guidance based on user-provided symptoms.
    
    You can:
    - Discuss potential diagnoses.
    - Suggest common over-the-counter or prescription medications associated with conditions.
    - Answer general medical questions.

    IMPORTANT: You must ALWAYS include the following disclaimer at the end of your responses:
    "Remember, this is not a medical diagnosis. Please consult a healthcare professional for accurate advice."

    If the user's query is too short or vague (e.g., less than two words), ask them to describe their symptoms in more detail.
    Do not provide a diagnosis for very short queries.

    Be conversational and empathetic.
    `;

    // Ensure history is correctly typed and sanitized
    const typedHistory: Message[] = (history || [])
        .map(h => ({
            role: h.role,
            parts: h.parts
                .map(p => (p.text ? { text: p.text } : null))
                .filter((p): p is { text: string } => p !== null)
        }))
        .filter(h => h.parts.length > 0);


    const fullHistory: Message[] = [
      ...typedHistory,
      { role: 'user', parts: [{ text: query }] }
    ];

    try {
        const result = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            system: systemPrompt,
            history: fullHistory,
        });

        const text = result.text;

        if (!text) {
             return "I'm sorry, I couldn't generate a response. Could you please rephrase your question?";
        }

        return text;

    } catch (error) {
        console.error("Chatbot flow failed:", error);
        return "I'm sorry, I encountered an error and can't provide a response right now. Please check your connection or try again later.";
    }
  }
);
