
'use server';
/**
 * @fileOverview Generates a detailed diagnosis based on a user's uploaded medical report.
 *
 * - generateDetailedDiagnoses - A function that generates a detailed diagnosis from a report.
 */

import {ai} from '@/ai/genkit';
import { GenerateDetailedDiagnosesInputSchema, GenerateDetailedDiagnosesOutputSchema, type GenerateDetailedDiagnosesInput, type GenerateDetailedDiagnosesOutput } from '@/ai/types';

export async function generateDetailedDiagnoses(input: GenerateDetailedDiagnosesInput): Promise<GenerateDetailedDiagnosesOutput> {
  return generateDetailedDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedDiagnosesPrompt',
  input: {schema: GenerateDetailedDiagnosesInputSchema},
  output: {schema: GenerateDetailedDiagnosesOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert medical AI assistant. Your purpose is to provide a detailed, structured, traceable, and explainable preliminary diagnosis based on an uploaded medical report.

  Analyze the user's uploaded medical report. You should also consider the optional symptoms and description for context. Perform OCR and extract all specific medical data, values, and clinical notes from the report.

  {{#if reportDataUri}}
  Medical Report: {{media url=reportDataUri}}
  {{/if}}
  {{#if symptoms}}
  Symptoms: {{{symptoms}}}
  {{/if}}
  {{#if description}}
  Description: {{{description}}}
  {{/if}}

  Your analysis MUST be structured as follows:

  1.  **Data Quality Assessment**:
      -   Score the quality and completeness of the provided report data from 0-100.
      -   Provide actionable suggestions if quality is low (e.g., "Scan is blurry, please upload a higher resolution image.").

  2.  **Red Flag Detection**:
      -   Identify any urgent, life-threatening findings based on established critical value thresholds (e.g., Hemoglobin < 7 g/dL).
      -   For each red flag, specify the exact finding and the clinical reasoning. If no red flags, return an empty array.

  3.  **Key Biomarker Analysis**:
      -   Extract key biomarkers (e.g., Hemoglobin, Glucose, Blood Pressure) from the report.
      -   For each biomarker, provide: name, value, unit, normalRange, and an explanation.
      -   If no biomarkers are found, return an empty array. This is a critical field, do your best to extract it.

  4.  **Ranked Diagnostic Analysis**:
      -   Provide a list of 2-4 possible conditions based on the report, ranked from most to least likely.
      -   For each condition: provide Name, a numeric confidenceScore from 0 to 100, Evidence (from the report), Explanation, Differential Diagnoses, and common Medications.

  5.  **Overall Assessment & Recommendations**:
      -   **Risk Score**: An overall risk score from 0 to 100 based on all findings.
      -   **Next Steps**: Clear, actionable recommendations.
      -   **Vitals to Monitor**: A list of key vitals.

  6.  **Summary Report**:
      -   Generate a concise, natural language summary of the entire analysis, directly linking findings from the report to the conclusion.

  7.  **Disclaimer**:
      -   Include the mandatory disclaimer: "This is an AI-generated analysis and not a substitute for professional medical advice. Please consult a qualified healthcare provider for a definitive diagnosis and treatment plan."

  Prioritize safety. Severe findings in the report must trigger red flags and high risk scores. If the report is unreadable or nonsensical, return a valid output object but populate the fields with a polite refusal to diagnose.
  `,
});

const generateDetailedDiagnosesFlow = ai.defineFlow(
  {
    name: 'generateDetailedDiagnosesFlow',
    inputSchema: GenerateDetailedDiagnosesInputSchema,
    outputSchema: GenerateDetailedDiagnosesOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('The AI model returned an empty response. This might be due to a temporary issue or invalid input.');
      }
      return output;
    } catch(e: any) {
      console.error(`[generateDetailedDiagnosesFlow] Error: ${e.message}`, e);
      // Re-throw a more user-friendly error
      throw new Error(`Failed to communicate with the AI service. Please try again. Details: ${e.message}`);
    }
  }
);
    
