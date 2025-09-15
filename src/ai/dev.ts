import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-patient-risk.ts';
import '@/ai/flows/generate-ranked-diagnoses.ts';
import '@/ai/flows/detect-urgent-conditions.ts';