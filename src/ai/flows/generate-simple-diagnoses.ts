
'use server';
/**
 * @fileOverview Generates a simple list of diagnoses based on user symptoms and an optional report.
 *
 * - generateSimpleDiagnoses - A function that generates a list of likely diagnoses.
 * - GenerateSimpleDiagnosesInput - The input type for the function.
 * - GenerateSimpleDiagnosesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSimpleDiagnosesInputSchema = z.object({
  symptoms: z.string().describe('The symptoms exhibited by the user.'),
  reportDataUri: z.string().optional().describe(
      "An optional medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateSimpleDiagnosesInput = z.infer<typeof GenerateSimpleDiagnosesInputSchema>;

const DiagnosisSchema = z.object({
  diagnosis: z.string().describe('The diagnosis.'),
  justification: z.string().describe('The evidence-based justification for the diagnosis.'),
});

const GenerateSimpleDiagnosesOutputSchema = z.array(DiagnosisSchema).describe('A list of likely diagnoses with justifications.');
export type GenerateSimpleDiagnosesOutput = z.infer<typeof GenerateSimpleDiagnosesOutputSchema>;

export async function generateSimpleDiagnoses(input: GenerateSimpleDiagnosesInput): Promise<GenerateSimpleDiagnosesOutput> {
  return generateSimpleDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleDiagnosesPrompt',
  input: {schema: GenerateSimpleDiagnosesInputSchema},
  output: {schema: GenerateSimpleDiagnosesOutputSchema},
  prompt: `You are an AI assistant that provides a simple list of possible diagnoses based on user-provided symptoms and/or a medical report.

  Analyze the following information to provide a few likely diagnoses. For each diagnosis, provide a brief justification based on the input.

  Do not provide confidence scores. This is a simple analysis.

  Symptoms: {{{symptoms}}}
  {{#if reportDataUri}}
  Medical Report: {{media url=reportDataUri}}
  {{/if}}

  Format your output as a JSON array of diagnoses, each with a diagnosis and justification.
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
    if (!input.symptoms && !input.reportDataUri) {
        return [];
    }
    const {output} = await prompt(input);
    return output!;
  }
);
