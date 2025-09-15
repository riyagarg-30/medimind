import { Patient } from './types';

export const patientData: Patient = {
  personalInfo: {
    name: 'John Doe',
    age: 58,
    gender: 'Male',
    bloodType: 'O+',
  },
  patientHistory:
    'Hypertension diagnosed 5 years ago, well-controlled on Lisinopril. Smoker, 1 pack/day for 20 years. Father had a myocardial infarction at age 65.',
  symptoms:
    'Patient presents with a 2-hour history of substernal chest pain, described as "crushing" and radiating to the left arm. Accompanied by diaphoresis, nausea, and shortness of breath.',
  vitals: {
    heartRate: '95 bpm (Sinus Tachycardia)',
    bloodPressure: '150/90 mmHg',
    temperature: '37.0°C (98.6°F)',
    respiratoryRate: '20 breaths/min',
    oxygenSaturation: '94% on room air',
  },
  labs: 'Initial Troponin I: 0.8 ng/mL (elevated). CK-MB: 15 U/L (elevated). Complete Blood Count (CBC) shows mild leukocytosis. Basic Metabolic Panel (BMP) is within normal limits.',
  medications:
    'Lisinopril 10mg daily. Patient took one 325mg aspirin at home.',
  imagingSummaries:
    'Chest X-ray: No evidence of acute pulmonary edema or aortic dissection. ECG: ST-segment elevation in leads V2-V5, consistent with an anterior wall myocardial infarction.',
  clinicalNotes:
    'Patient appears anxious and is in moderate distress. Skin is cool and clammy. Auscultation reveals clear lung fields bilaterally. S1 and S2 heart sounds are normal, with an audible S4 gallop. No murmurs or rubs. Immediate cardiology consult requested.',
};
