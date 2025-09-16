
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
  prompt: `You are an expert medical AI assistant. Your purpose is to provide a detailed, structured, and safe preliminary diagnosis based on user-provided information.

  Analyze the following symptoms and/or medical report in great detail. If a medical report is provided, extract all relevant medical data, values, and observations before making your analysis.

  Symptoms: {{{symptoms}}}
  {{#if reportDataUri}}
  Medical Report: {{media url=reportDataUri}}
  {{/if}}

  Your analysis MUST include the following:
  1.  A list of 2-3 possible conditions. For each condition, provide:
      - The name of the condition.
      - A detailed explanation of why the user's symptoms or report findings align with this condition.
      - A likelihood assessment (High, Medium, or Low).
      - A list of other possible differential diagnoses related to the primary condition.
      - A list of suggested medications (with a disclaimer to consult a doctor).
  2.  An overall Risk Score from 0 to 100, where 100 is the highest risk.
  3.  A "Next Steps" recommendation. This should be a clear, safe, and actionable suggestion (e.g., "Schedule an appointment with your primary care doctor," "Consider visiting an urgent care clinic," or "Go to the emergency department if symptoms worsen.").
  4.  A list of key "Vitals to Monitor" (e.g., Temperature, Blood Pressure).
  5.  A clear, non-negotiable disclaimer. It must state: "This is an AI-generated analysis and not a substitute for professional medical advice. Please consult a qualified healthcare provider for a definitive diagnosis and treatment plan."

  Prioritize safety above all else. If symptoms are severe (e.g., chest pain, difficulty breathing, severe headache), your primary recommendation should be to seek immediate medical attention and the risk score should be high.

  If the input is nonsensical, dangerous, or not medically related, return a valid output object but populate the fields with a polite refusal to diagnose and set the risk score to 0.
  `,
});

const generateDetailedDiagnosesFlow = ai.defineFlow(
  {
    name: 'generateDetailedDiagnosesFlow',
    inputSchema: GenerateDetailedDiagnosesInputSchema,
    outputSchema: GenerateDetailedDiagnosesOutputSchema,
  },
  async input => {
    if (!input.symptoms && !input.reportDataUri) {
        return {
            conditions: [],
            riskScore: 0,
            vitalsToMonitor: [],
            nextSteps: "No information provided. Please enter symptoms or upload a report.",
            disclaimer: "This is an AI assistant. No analysis can be performed without input."
        };
    }
    
    try {
        const {output} = await prompt(input);

        if (!output) {
            return {
                conditions: [],
                riskScore: 0,
                vitalsToMonitor: [],
                nextSteps: "The AI model could not generate a valid analysis for the provided input. This may happen with ambiguous or non-medical information.",
                disclaimer: "This is an AI assistant. Analysis failed."
            };
        }
        return output;

    } catch (error) {
        console.error("Detailed diagnosis flow failed:", error);
        return {
            conditions: [],
            riskScore: 0,
            vitalsToMonitor: [],
            nextSteps: "An error occurred while communicating with the AI service. Please try again later.",
            disclaimer: "This is an AI assistant. Analysis failed due to a service error."
        };
    }
  }
);
