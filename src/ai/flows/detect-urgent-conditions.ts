'use server';

/**
 * @fileOverview An AI agent for detecting urgent, life-threatening conditions and generating escalation alerts.
 *
 * - detectUrgentConditions - A function that detects urgent conditions and generates alerts.
 * - DetectUrgentConditionsInput - The input type for the detectUrgentConditions function.
 * - DetectUrgentConditionsOutput - The return type for the detectUrgentConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectUrgentConditionsInputSchema = z.object({
  patientData: z
    .string()
    .describe(
      'A comprehensive summary of patient data, including history, symptoms, vitals, labs, medications, imaging summaries, and clinical notes.'
    ),
});
export type DetectUrgentConditionsInput = z.infer<typeof DetectUrgentConditionsInputSchema>;

const DetectUrgentConditionsOutputSchema = z.object({
  urgentConditionsDetected: z
    .boolean()
    .describe('Whether any urgent, life-threatening conditions were detected.'),
  escalationAlerts: z
    .array(
      z.object({
        condition: z.string().describe('The specific urgent condition detected.'),
        urgencyLevel: z
          .enum(['Immediate', 'High', 'Medium'])
          .describe('The assigned urgency level for the condition.'),
        justification: z
          .string()
          .describe(
            'Evidence-based justification for the alert, linked to specific patient data points.'
          ),
      })
    )
    .describe('A list of escalation alerts for detected urgent conditions.'),
});
export type DetectUrgentConditionsOutput = z.infer<typeof DetectUrgentConditionsOutputSchema>;

export async function detectUrgentConditions(
  input: DetectUrgentConditionsInput
): Promise<DetectUrgentConditionsOutput> {
  return detectUrgentConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectUrgentConditionsPrompt',
  input: {schema: DetectUrgentConditionsInputSchema},
  output: {schema: DetectUrgentConditionsOutputSchema},
  prompt: `You are an AI assistant that specializes in detecting urgent, life-threatening conditions from patient data.

  Based on the provided patient data, identify any urgent conditions and generate escalation alerts with assigned urgency levels and justifications.

  Patient Data: {{{patientData}}}

  Your response should include:
  - urgentConditionsDetected: true if any urgent conditions are detected, false otherwise.
  - escalationAlerts: A list of escalation alerts, each containing the condition, urgency level (Immediate, High, or Medium), and justification.

  If no urgent conditions are detected, set urgentConditionsDetected to false and escalationAlerts to an empty list.
  `,
});

const detectUrgentConditionsFlow = ai.defineFlow(
  {
    name: 'detectUrgentConditionsFlow',
    inputSchema: DetectUrgentConditionsInputSchema,
    outputSchema: DetectUrgentConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
