
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
});

export const GenerateDetailedDiagnosesOutputSchema = z.object({
    conditions: z.array(ConditionSchema).describe("A list of the most likely medical conditions."),
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
