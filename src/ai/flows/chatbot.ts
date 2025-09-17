
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
        
        const asksForMedicine = query.toLowerCase().includes('medicine') || query.toLowerCase().includes('suggest medicine');

        if (asksForMedicine) {
            response += "\nHere are some common over-the-counter and prescription medications associated with these conditions. **This is not medical advice. Please consult a doctor before taking any medication.**\n\n";
            diagnoses.forEach(d => {
                if (d.medications && d.medications.length > 0) {
                    response += `- **For ${d.diagnosis}:** ${d.medications.join(', ')}\n`;
                }
            });
        }

        response += "\nRemember, this is not a medical diagnosis. Please consult a healthcare professional for accurate advice.";
        
        return response;

    } catch (error) {
        console.error("Chatbot flow failed:", error);
        return "Sorry, I encountered an error and can't provide a diagnosis at the moment. Please try again later.";
    }
  }
);
