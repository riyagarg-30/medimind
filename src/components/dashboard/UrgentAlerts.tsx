import { detectUrgentConditions } from '@/ai/flows/detect-urgent-conditions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Patient } from '@/lib/types';
import { Siren } from 'lucide-react';

function formatPatientDataForAI(patient: Patient): string {
  return `
    Patient History: ${patient.patientHistory}
    Symptoms: ${patient.symptoms}
    Vitals: Heart Rate: ${patient.vitals.heartRate}, Blood Pressure: ${patient.vitals.bloodPressure}, Temperature: ${patient.vitals.temperature}, Respiratory Rate: ${patient.vitals.respiratoryRate}, SpO2: ${patient.vitals.oxygenSaturation}
    Labs: ${patient.labs}
    Medications: ${patient.medications}
    Imaging Summaries: ${patient.imagingSummaries}
    Clinical Notes: ${patient.clinicalNotes}
  `.trim();
}

function getBadgeVariant(urgency: 'Immediate' | 'High' | 'Medium'): "destructive" | "secondary" | "default" {
    switch (urgency) {
        case 'Immediate':
            return 'destructive';
        case 'High':
            return 'secondary';
        default:
            return 'default';
    }
}

export async function UrgentAlerts({ patient }: { patient: Patient }) {
  const patientDataString = formatPatientDataForAI(patient);
  const alertsData = await detectUrgentConditions({
    patientData: patientDataString,
  });

  if (!alertsData.urgentConditionsDetected || alertsData.escalationAlerts.length === 0) {
    return null;
  }

  return (
    <div>
        <h2 className="text-xl font-bold mb-2 text-destructive">Red-Flag Alerts</h2>
        <div className="grid gap-4 md:grid-cols-2">
            {alertsData.escalationAlerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                <span>{alert.condition}</span>
                <Badge variant={getBadgeVariant(alert.urgencyLevel)}>{alert.urgencyLevel}</Badge>
                </AlertTitle>
                <AlertDescription>{alert.justification}</AlertDescription>
            </Alert>
            ))}
        </div>
    </div>
  );
}

export function UrgentAlertsSkeleton() {
  return (
     <div>
        <h2 className="text-xl font-bold mb-2 text-destructive">Red-Flag Alerts</h2>
        <div className="grid gap-4 md:grid-cols-2">
            <Alert variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </AlertTitle>
                <AlertDescription>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                </AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </AlertTitle>
                <AlertDescription>
                    <Skeleton className="h-4 w-full mt-2" />
                </AlertDescription>
            </Alert>
        </div>
    </div>
  );
}
