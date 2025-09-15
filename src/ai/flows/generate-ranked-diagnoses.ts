// src/ai/flows/generate-ranked-diagnoses.ts
'use server';
/**
 * @fileOverview Generates a ranked list of likely diagnoses with confidence scores and evidence-based justifications.
 *
 * - generateRankedDiagnoses - A function that generates a ranked list of likely diagnoses.
 * - GenerateRankedDiagnosesInput - The input type for the generateRankedDiagnoses function.
 * - GenerateRankedDiagnosesOutput - The return type for the generateRankedDiagnoses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRankedDiagnosesInputSchema = z.object({
  patientHistory: z.string().describe('The patient medical history.'),
  symptoms: z.string().describe('The symptoms exhibited by the patient.'),
  vitals: z.string().describe('The patient vital signs.'),
  labs: z.string().describe('The patient lab results.'),
  medications: z.string().describe('The patient medications.'),
  imagingSummaries: z.string().describe('Summaries of the patient imaging scans.'),
  clinicalNotes: z.string().describe('The clinician notes about the patient.'),
});
export type GenerateRankedDiagnosesInput = z.infer<typeof GenerateRankedDiagnosesInputSchema>;

const DiagnosisSchema = z.object({
  diagnosis: z.string().describe('The diagnosis.'),
  confidence: z.number().describe('The confidence score for the diagnosis (0-1).'),
  justification: z.string().describe('The evidence-based justification for the diagnosis, linked to patient data points.'),
});

const GenerateRankedDiagnosesOutputSchema = z.array(DiagnosisSchema).describe('A ranked list of likely diagnoses with confidence scores and evidence-based justifications.');
export type GenerateRankedDiagnosesOutput = z.infer<typeof GenerateRankedDiagnosesOutputSchema>;

export async function generateRankedDiagnoses(input: GenerateRankedDiagnosesInput): Promise<GenerateRankedDiagnosesOutput> {
  return generateRankedDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRankedDiagnosesPrompt',
  input: {schema: GenerateRankedDiagnosesInputSchema},
  output: {schema: GenerateRankedDiagnosesOutputSchema},
  prompt: `You are an AI assistant that generates a ranked list of likely diagnoses for a patient, given their medical data.

  The diagnoses should be ranked by confidence score, with the most likely diagnosis first.
  Each diagnosis should include evidence-based justifications linked to specific patient data points.

  Patient History: {{{patientHistory}}}
  Symptoms: {{{symptoms}}}
  Vitals: {{{vitals}}}
  Labs: {{{labs}}}
  Medications: {{{medications}}}
  Imaging Summaries: {{{imagingSummaries}}}
  Clinical Notes: {{{clinicalNotes}}}

  Format your output as a JSON array of diagnoses, each with a diagnosis, confidence (0-1), and justification.
  `,
});

const generateRankedDiagnosesFlow = ai.defineFlow(
  {
    name: 'generateRankedDiagnosesFlow',
    inputSchema: GenerateRankedDiagnosesInputSchema,
    outputSchema: GenerateRankedDiagnosesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
