
'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - askChatbot - A function that returns a chatbot response.
 */

import {ai} from '@/ai/genkit';
import { generateSimpleDiagnoses } from './generate-simple-diagnoses';
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
  async ({ query }) => {
    
    if (query.trim().split(" ").length < 2) {
      return "Please describe your symptoms in a bit more detail.";
    }

    try {
        const diagnoses = await generateSimpleDiagnoses({ symptoms: query });

        if (!diagnoses || diagnoses.length === 0) {
            return "I couldn't determine a likely diagnosis from your symptoms. Please try describing them differently.";
        }

        let response = "Based on your symptoms, here are a few possibilities:\n\n";
        diagnoses.forEach(d => {
            response += `- **${d.diagnosis}:** ${d.justification}\n`;
        });
        response += "\nRemember, this is not a medical diagnosis. Please consult a healthcare professional.";
        
        return response;

    } catch (error) {
        console.error("Chatbot flow failed:", error);
        return "Sorry, I encountered an error and can't provide a diagnosis at the moment. Please try again later.";
    }
  }
);
