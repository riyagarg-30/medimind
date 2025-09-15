// src/ai/flows/categorize-patient-risk.ts
'use server';

/**
 * @fileOverview Categorizes patients into risk groups (Low/Medium/High) with explainable reasoning.
 *
 * - categorizePatientRisk - A function that categorizes patient risk.
 * - CategorizePatientRiskInput - The input type for the categorizePatientRisk function.
 * - CategorizePatientRiskOutput - The return type for the categorizePatientRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizePatientRiskInputSchema = z.object({
  patientHistory: z.string().describe('The patient medical history.'),
  symptoms: z.string().describe('The patient symptoms.'),
  vitals: z.string().describe('The patient vital signs.'),
  labs: z.string().describe('The patient lab results.'),
  medications: z.string().describe('The patient medications.'),
  imagingSummaries: z.string().describe('The patient imaging summaries.'),
  clinicalNotes: z.string().describe('The patient clinical notes.'),
});
export type CategorizePatientRiskInput = z.infer<typeof CategorizePatientRiskInputSchema>;

const CategorizePatientRiskOutputSchema = z.object({
  riskCategory: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The risk category of the patient.'),
  reasoning: z.string().describe('The reasoning behind the risk categorization.'),
  keyDrivers: z.string().describe('The key factors driving the risk assignment.'),
});
export type CategorizePatientRiskOutput = z.infer<typeof CategorizePatientRiskOutputSchema>;

export async function categorizePatientRisk(
  input: CategorizePatientRiskInput
): Promise<CategorizePatientRiskOutput> {
  return categorizePatientRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizePatientRiskPrompt',
  input: {schema: CategorizePatientRiskInputSchema},
  output: {schema: CategorizePatientRiskOutputSchema},
  prompt: `You are an expert medical professional tasked with categorizing patient risk.

  Based on the provided patient data, determine whether the patient is Low, Medium, or High risk.

  Provide a concise explanation of your reasoning for the assigned risk category.

  Identify the key drivers that contributed to the risk assignment.

  Patient History: {{{patientHistory}}}
  Symptoms: {{{symptoms}}}
  Vitals: {{{vitals}}}
  Labs: {{{labs}}}
  Medications: {{{medications}}}
  Imaging Summaries: {{{imagingSummaries}}}
  Clinical Notes: {{{clinicalNotes}}}
  `,
});

const categorizePatientRiskFlow = ai.defineFlow(
  {
    name: 'categorizePatientRiskFlow',
    inputSchema: CategorizePatientRiskInputSchema,
    outputSchema: CategorizePatientRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
