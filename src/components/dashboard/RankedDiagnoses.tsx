import { generateRankedDiagnoses } from '@/ai/flows/generate-ranked-diagnoses';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Patient } from '@/lib/types';
import { ListOrdered } from 'lucide-react';

export async function RankedDiagnoses({ patient }: { patient: Patient }) {
  const diagnoses = await generateRankedDiagnoses({
    patientHistory: patient.patientHistory,
    symptoms: patient.symptoms,
    vitals: Object.values(patient.vitals).join(', '),
    labs: patient.labs,
    medications: patient.medications,
    imagingSummaries: patient.imagingSummaries,
    clinicalNotes: patient.clinicalNotes,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ListOrdered className="h-6 w-6" />
          Ranked Diagnostic List
        </CardTitle>
        <CardDescription>
          Differential diagnoses ranked by AI-calculated confidence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Diagnosis</TableHead>
              <TableHead className="w-[20%] text-center">Confidence</TableHead>
              <TableHead className="w-[40%]">Justification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.map((diag, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{diag.diagnosis}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Progress
                      value={diag.confidence * 100}
                      className="h-2 w-24"
                    />
                    <span>{(diag.confidence * 100).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {diag.justification}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function RankedDiagnosesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ListOrdered className="h-6 w-6" />
          Ranked Diagnostic List
        </CardTitle>
        <CardDescription>
          Differential diagnoses ranked by AI-calculated confidence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Diagnosis</TableHead>
              <TableHead className="w-[20%] text-center">Confidence</TableHead>
              <TableHead className="w-[40%]">Justification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-2 w-24" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-3/4 mt-1" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
