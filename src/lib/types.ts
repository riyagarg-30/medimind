export interface Patient {
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
  };
  patientHistory: string;
  symptoms: string;
  vitals: {
    heartRate: string;
    bloodPressure: string;
    temperature: string;
    respiratoryRate: string;
    oxygenSaturation: string;
  };
  labs: string;
  medications: string;
  imagingSummaries: string;
  clinicalNotes: string;
}
