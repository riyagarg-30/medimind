
'use server';
/**
 * @fileOverview Generates a simple list of diagnoses based on user symptoms.
 *
 * - generateSimpleDiagnoses - A function that generates a list of likely diagnoses.
 */

import {ai} from '@/ai/genkit';
import { GenerateSimpleDiagnosesInputSchema, GenerateSimpleDiagnosesOutputSchema, type GenerateSimpleDiagnosesInput, type GenerateSimpleDiagnosesOutput } from '@/ai/types';


export async function generateSimpleDiagnoses(input: GenerateSimpleDiagnosesInput): Promise<GenerateSimpleDiagnosesOutput> {
  return generateSimpleDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleDiagnosesPrompt',
  input: {schema: GenerateSimpleDiagnosesInputSchema},
  output: {schema: GenerateSimpleDiagnosesOutputSchema},
  prompt: `You are an AI assistant that provides a simple list of possible diagnoses based on user-provided symptoms and an optional description.

  Analyze the following information to provide a few likely diagnoses. For each diagnosis, provide a brief justification based on the input, and a list of common medications.

  Symptoms: {{{symptoms}}}
  {{#if description}}
  Description: {{{description}}}
  {{/if}}

  Format your output as a JSON array of diagnoses, each with a "diagnosis", "justification", and an optional array of "medications".
  If the input is empty or nonsensical, return an empty array.
  `,
});

const generateSimpleDiagnosesFlow = ai.defineFlow(
  {
    name: 'generateSimpleDiagnosesFlow',
    inputSchema: GenerateSimpleDiagnosesInputSchema,
    outputSchema: GenerateSimpleDiagnosesOutputSchema,
  },
  async input => {
    if (!input.symptoms) {
        return [];
    }
    const {output} = await prompt(input);
    return output!;
  }
);
