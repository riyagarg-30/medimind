import { categorizePatientRisk } from '@/ai/flows/categorize-patient-risk';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Patient } from '@/lib/types';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

function getRiskAppearance(
  riskCategory: 'Low' | 'Medium' | 'High'
): { variant: 'default' | 'secondary' | 'destructive'; Icon: React.ElementType } {
  switch (riskCategory) {
    case 'High':
      return { variant: 'destructive', Icon: ShieldAlert };
    case 'Medium':
      return { variant: 'secondary', Icon: ShieldQuestion };
    case 'Low':
      return { variant: 'default', Icon: ShieldCheck };
    default:
      return { variant: 'default', Icon: ShieldCheck };
  }
}

export async function RiskStratification({ patient }: { patient: Patient }) {
  const riskData = await categorizePatientRisk({
    patientHistory: patient.patientHistory,
    symptoms: patient.symptoms,
    vitals: Object.values(patient.vitals).join(', '),
    labs: patient.labs,
    medications: patient.medications,
    imagingSummaries: patient.imagingSummaries,
    clinicalNotes: patient.clinicalNotes,
  });

  const { variant, Icon } = getRiskAppearance(riskData.riskCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Risk Stratification</span>
          <Badge variant={variant} className="text-sm">
            <Icon className="mr-2 h-4 w-4" />
            {riskData.riskCategory} Risk
          </Badge>
        </CardTitle>
        <CardDescription>AI-powered patient risk assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-1 text-sm">Reasoning</h4>
          <p className="text-sm text-muted-foreground">{riskData.reasoning}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-sm">Key Drivers</h4>
          <p className="text-sm text-muted-foreground">{riskData.keyDrivers}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskStratificationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Risk Stratification</span>
          <Skeleton className="h-7 w-28 rounded-full" />
        </CardTitle>
        <CardDescription>AI-powered patient risk assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-1 text-sm">Reasoning</h4>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-1" />
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-sm">Key Drivers</h4>
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}
