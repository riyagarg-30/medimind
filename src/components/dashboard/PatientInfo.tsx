import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/lib/types';
import {
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  Pill,
  Thermometer,
} from 'lucide-react';

interface PatientInfoProps {
  patient: Patient;
}

export function PatientInfo({ patient }: PatientInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['vitals', 'symptoms']} className="w-full">
          <AccordionItem value="vitals">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <HeartPulse className="h-5 w-5 text-primary" /> Vitals
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pl-4 text-sm">
              <p><strong>Heart Rate:</strong> {patient.vitals.heartRate}</p>
              <p><strong>Blood Pressure:</strong> {patient.vitals.bloodPressure}</p>
              <p><strong>Temperature:</strong> {patient.vitals.temperature}</p>
              <p><strong>Respiratory Rate:</strong> {patient.vitals.respiratoryRate}</p>
              <p><strong>Oxygen Saturation:</strong> {patient.vitals.oxygenSaturation}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="symptoms">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-primary" /> Symptoms
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 text-sm">
              {patient.symptoms}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="history">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" /> Patient History
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 text-sm">
              {patient.patientHistory}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="labs">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" /> Lab Results
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 text-sm">
              {patient.labs}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="medications">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Pill className="h-5 w-5 text-primary" /> Medications
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 text-sm">
              {patient.medications}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="imaging">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" /> Imaging & Notes
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pl-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Imaging Summaries</h4>
                <p>{patient.imagingSummaries}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Clinical Notes</h4>
                <p>{patient.clinicalNotes}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
