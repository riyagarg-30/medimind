'use server';
/**
 * @fileOverview A Q&A chatbot flow for progressive diagnosis.
 *
 * - qnaChatbot - A function that handles the Q&A conversation for diagnosis.
 */

import {ai} from '@/ai/genkit';
import {
  QnaChatbotInputSchema,
  QnaChatbotOutputSchema,
  type QnaChatbotInput,
  type QnaChatbotOutput,
} from '@/ai/types';
import {z} from 'genkit';

export async function qnaChatbot(
  input: QnaChatbotInput
): Promise<QnaChatbotOutput> {
  return qnaChatbotFlow(input);
}

const diagnosisPrompt = ai.definePrompt({
  name: 'diagnosisPrompt',
  input: {schema: QnaChatbotInputSchema},
  output: {schema: QnaChatbotOutputSchema},
  prompt: `You are a medical diagnosis AI. Your goal is to determine the most likely condition based on a Q&A conversation with a user. You have been having a conversation with a user about their symptoms.

Review the entire conversation history:
{{#each history}}
- {{role}}: {{parts.[0].text}}
{{/each}}

Based on this history, determine a final diagnosis. Provide a ranked list of 2-4 possible conditions with confidence scores.

Respond with the final diagnosis and set the 'isFinal' flag to true. The 'question' field should be a summary of the diagnosis.
  `,
});

const questionPrompt = ai.definePrompt({
  name: 'questionPrompt',
  input: {schema: QnaChatbotInputSchema},
  output: {schema: QnaChatbotOutputSchema},
  prompt: `You are a medical Q&A AI. Your goal is to ask clarifying questions to diagnose a user's condition.

This is the conversation so far:
{{#each history}}
- {{role}}: {{parts.[0].text}}
{{/each}}

Based on the history, ask the NEXT, most important, single question to help narrow down the diagnosis.
If the user's last answer was "Nothing" or "I don't know", try asking a different question.

If you have enough information to make a confident diagnosis (at least 3-4 questions asked), switch to the 'diagnosis' tool. Otherwise, continue asking questions.

- Keep questions concise.
- If relevant, provide multiple choice 'options' to guide the user. For example, when asking about pain, provide options like "Sharp," "Dull," "Throbbing."
- Ensure 'isFinal' is false.
  `,
});

const qnaChatbotFlow = ai.defineFlow(
  {
    name: 'qnaChatbotFlow',
    inputSchema: QnaChatbotInputSchema,
    outputSchema: QnaChatbotOutputSchema,
  },
  async (input: QnaChatbotInput) => {
    // If there are more than 6 messages (3 turns), lean towards diagnosis.
    if (input.history && input.history.length > 6) {
      const {output} = await diagnosisPrompt(input);
      return output!;
    }

    const {output} = await questionPrompt(input);
    return output!;
  }
);
