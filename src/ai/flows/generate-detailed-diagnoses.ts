
'use server';
/**
 * @fileOverview Generates a detailed diagnosis based on user symptoms and an optional report.
 *
 * - generateDetailedDiagnoses - A function that generates a detailed diagnosis.
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
  prompt: `You are an expert medical AI assistant. Your purpose is to provide a detailed, structured, traceable, and explainable preliminary diagnosis.

  Analyze the user's symptoms, optional description, and/or uploaded medical report. If a report is provided, perform OCR and extract all specific medical data, values, and clinical notes.

  Symptoms: {{{symptoms}}}
  {{#if description}}
  Description: {{{description}}}
  {{/if}}
  {{#if reportDataUri}}
  Medical Report: {{media url=reportDataUri}}
  {{/if}}

  Your analysis MUST be structured as follows:

  1.  **Data Quality Assessment**:
      -   Score the quality and completeness of the provided data (symptoms and report) from 0-100.
      -   Provide actionable suggestions if quality is low (e.g., "Scan is blurry, please upload a higher resolution image.").

  2.  **Red Flag Detection**:
      -   Identify any urgent, life-threatening findings based on established critical value thresholds (e.g., Hemoglobin < 7 g/dL, severe chest pain with shortness of breath).
      -   For each red flag, specify the exact finding and the clinical reasoning (e.g., "Finding: Hemoglobin = 6.5 g/dL. Reasoning: Critical anemia risk requiring immediate medical attention."). If no red flags, return an empty array.

  3.  **Key Biomarker Analysis (from report)**:
      -   If a report is present, extract key biomarkers (e.g., Hemoglobin, Glucose, Blood Pressure).
      -   For each biomarker, provide:
          -   **name**: The name of the biomarker.
          -   **value**: The user's value as a string (e.g., "140/90").
          -   **unit**: The unit of measurement (e.g., "mg/dL", "mmHg").
          -   **normalRange**: The standard normal range as a string (e.g., "90-120 mmHg").
          -   **explanation**: A brief explanation of what this biomarker indicates.
      - If no biomarkers are found or no report is uploaded, return an empty array.

  4.  **Ranked Diagnostic Analysis**:
      -   Provide a list of 2-3 possible conditions, ranked from most to least likely.
      -   For each condition:
          -   **Name**: The name of the condition.
          -   **Likelihood**: High, Medium, or Low.
          -   **Evidence**: A list of specific, extracted data points from the inputs that support this diagnosis (e.g., "Fatigue from symptoms," "Low hemoglobin (8 g/dL) from report.").
          -   **Explanation**: A detailed explanation of how the evidence points to this condition.
          -   **Differential Diagnoses**: A list of other possible related conditions.
          -   **Medications**: A list of common medications.

  5.  **Overall Assessment & Recommendations**:
      -   **Risk Score**: An overall risk score from 0 to 100 based on all findings.
      -   **Next Steps**: Clear, actionable recommendations (e.g., "Go to the emergency department," "Schedule an appointment with a primary care doctor.").
      -   **Vitals to Monitor**: A list of key vitals.

  6.  **Summary Report**:
      -   Generate a concise, natural language summary of the entire analysis, directly linking findings to the conclusion. Example: "Based on low hemoglobin (8 g/dL) from the report and reported fatigue, the system suggests anemia (85% likelihood). An urgent red flag was raised due to the critically low lab value."

  7.  **Disclaimer**:
      -   Include the mandatory disclaimer: "This is an AI-generated analysis and not a substitute for professional medical advice. Please consult a qualified healthcare provider for a definitive diagnosis and treatment plan."

  Prioritize safety above all else. Severe symptoms must always trigger red flags and high risk scores. If the input is nonsensical, return a valid output object but populate the fields with a polite refusal to diagnose.
  `,
});

const generateDetailedDiagnosesFlow = ai.defineFlow(
  {
    name: 'generateDetailedDiagnosesFlow',
    inputSchema: GenerateDetailedDiagnosesInputSchema,
    outputSchema: GenerateDetailedDiagnosesOutputSchema,
  },
  async input => {
    if (!input.symptoms && !input.reportDataUri && !input.description) {
        throw new Error("Please provide symptoms, a description, and/or a medical report for analysis.");
    }
    
    try {
        const {output} = await prompt(input, { model: 'googleai/gemini-1.5-pro' });

        if (!output) {
            throw new Error("The AI model could not generate a valid analysis for the provided input.");
        }
        return output;

    } catch (error) {
        console.error("Detailed diagnosis flow failed:", error);
        throw new Error("An error occurred while communicating with the AI service. Please try again later.");
    }
  }
);
