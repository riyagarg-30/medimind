
import {z} from 'genkit';

// From generate-detailed-diagnoses.ts
export const GenerateDetailedDiagnosesInputSchema = z.object({
  symptoms: z.string().optional().describe('The key symptoms exhibited by the user (e.g. "Headache").'),
  description: z.string().optional().describe('A more detailed description of the symptoms.'),
  reportDataUri: z.string().optional().describe(
      "A medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateDetailedDiagnosesInput = z.infer<typeof GenerateDetailedDiagnosesInputSchema>;

const ConditionSchema = z.object({
    name: z.string().describe("The name of the possible medical condition."),
    explanation: z.string().describe("A detailed, evidence-based explanation linking the user's symptoms to this condition."),
    likelihood: z.enum(["High", "Medium", "Low"]).describe("The likelihood that the user has this condition based on the provided information."),
    differentialDiagnoses: z.array(z.string()).describe("A list of other possible conditions to consider."),
    medications: z.array(z.string()).describe("A list of common medications, with a disclaimer to consult a doctor."),
    evidence: z.array(z.string()).describe("List of specific data points (e.g., 'Hemoglobin = 8 g/dL') supporting this diagnosis."),
});

const DataQualitySchema = z.object({
    score: z.number().int().min(0).max(100).describe("A score from 0-100 representing the quality and completeness of the provided data."),
    suggestions: z.array(z.string()).describe("Actionable suggestions to improve data quality, e.g., 'Upload higher resolution scan'.")
});

const RedFlagSchema = z.object({
    finding: z.string().describe("The specific finding that triggered the red flag (e.g., 'Hemoglobin < 7 g/dL')."),
    reasoning: z.string().describe("The clinical reasoning for why this is a red flag (e.g., 'Critical anemia risk').")
});

const BiomarkerSchema = z.object({
    name: z.string().describe("The name of the biomarker, e.g., 'Hemoglobin'."),
    value: z.string().describe("The user's value for the biomarker, e.g., '12.5' or '140/90'."),
    unit: z.string().describe("The unit of measurement, e.g., 'g/dL' or 'mmHg'."),
    normalRange: z.string().describe("The standard normal range for this biomarker, e.g., '13.5-17.5 g/dL'."),
    explanation: z.string().describe("A brief explanation of what this biomarker indicates."),
});

export const GenerateDetailedDiagnosesOutputSchema = z.object({
    conditions: z.array(ConditionSchema).describe("A list of the most likely medical conditions, ranked by likelihood."),
    riskScore: z.number().int().min(0).max(100).describe("An overall risk score from 0 to 100."),
    vitalsToMonitor: z.array(z.string()).describe("A list of key vital signs the user should monitor."),
    nextSteps: z.string().describe("Clear, actionable next steps for the user."),
    dataQuality: DataQualitySchema.describe("An assessment of the input data quality."),
    redFlags: z.array(RedFlagSchema).describe("A list of any urgent or life-threatening findings detected."),
    biomarkerAnalysis: z.array(BiomarkerSchema).optional().describe("An analysis of key biomarkers extracted from the user's report."),
    summaryReport: z.string().describe("A fully explainable natural language diagnostic report summarizing all findings."),
    disclaimer: z.string().describe("A mandatory disclaimer stating that this is an AI-generated analysis and not a substitute for professional medical advice."),
});
export type GenerateDetailedDiagnosesOutput = z.infer<typeof GenerateDetailedDiagnosesOutputSchema>;


// From chatbot.ts
const HistoryMessagePartSchema = z.object({
    text: z.string().optional(),
    // Add other possible part types if needed, e.g., media
});

const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(HistoryMessagePartSchema),
});

export const AskChatbotInputSchema = z.object({
  query: z.string().describe('The user\'s query.'),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
});
export type AskChatbotInput = z.infer<typeof AskChatbotInputSchema>;

export const QnaChatbotInputSchema = z.object({
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history.'),
  question: z.string().optional().describe('The user\'s answer to the last question.'),
});
export type QnaChatbotInput = z.infer<typeof QnaChatbotInputSchema>;

export const QnaChatbotOutputSchema = z.object({
  question: z.string().describe('The next question to ask the user.'),
  options: z.array(z.string()).optional().describe('A list of multiple choice options.'),
  diagnosis: z.string().optional().describe('The final diagnosis.'),
  isFinal: z.boolean().describe('Whether this is the final diagnosis or another question.'),
});
export type QnaChatbotOutput = z.infer<typeof QnaChatbotOutputSchema>;
