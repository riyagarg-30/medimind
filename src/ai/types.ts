
import {z} from 'genkit';

// From generate-detailed-diagnoses.ts
export const GenerateDetailedDiagnosesInputSchema = z.object({
  symptoms: z.string().describe('The symptoms exhibited by the user.'),
  reportDataUri: z.string().optional().describe(
      "An optional medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateDetailedDiagnosesInput = z.infer<typeof GenerateDetailedDiagnosesInputSchema>;

const ConditionSchema = z.object({
    name: z.string().describe("The name of the possible medical condition."),
    explanation: z.string().describe("A detailed, evidence-based explanation linking the user's symptoms to this condition."),
    likelihood: z.enum(["High", "Medium", "Low"]).describe("The likelihood that the user has this condition based on the provided information."),
    differentialDiagnoses: z.array(z.string()).describe("A list of other possible conditions to consider."),
    medications: z.array(z.string()).describe("A list of common medications, with a disclaimer to consult a doctor."),
});

export const GenerateDetailedDiagnosesOutputSchema = z.object({
    conditions: z.array(ConditionSchema).describe("A list of the most likely medical conditions."),
    riskScore: z.number().int().min(0).max(100).describe("An overall risk score from 0 to 100."),
    vitalsToMonitor: z.array(z.string()).describe("A list of key vital signs the user should monitor."),
    nextSteps: z.string().describe("Clear, actionable next steps for the user, such as 'Consult a primary care physician' or 'Visit an urgent care clinic within 24 hours'."),
    disclaimer: z.string().describe("A mandatory disclaimer stating that this is an AI-generated analysis and not a substitute for professional medical advice."),
});
export type GenerateDetailedDiagnosesOutput = z.infer<typeof GenerateDetailedDiagnosesOutputSchema>;


// From generate-simple-diagnoses.ts
export const GenerateSimpleDiagnosesInputSchema = z.object({
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

export const GenerateSimpleDiagnosesOutputSchema = z.array(DiagnosisSchema).describe('A list of likely diagnoses with justifications.');
export type GenerateSimpleDiagnosesOutput = z.infer<typeof GenerateSimpleDiagnosesOutputSchema>;


// From chatbot.ts
const HistoryMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({text: z.string()})),
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
