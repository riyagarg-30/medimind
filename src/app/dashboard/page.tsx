
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateSimpleDiagnoses, GenerateSimpleDiagnosesOutput } from '@/ai/flows/generate-simple-diagnoses';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [report, setReport] = useState<File | null>(null);
  const [diagnoses, setDiagnoses] = useState<GenerateSimpleDiagnosesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReport(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setDiagnoses(null);

    let reportDataUri = '';
    if (report) {
      const reader = new FileReader();
      reader.readAsDataURL(report);
      reader.onload = async () => {
        reportDataUri = reader.result as string;
        const result = await generateSimpleDiagnoses({ symptoms, reportDataUri });
        setDiagnoses(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        console.error("Could not read file.");
        setIsLoading(false);
      }
    } else {
       const result = await generateSimpleDiagnoses({ symptoms, reportDataUri: '' });
       setDiagnoses(result);
       setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex items-center gap-3 p-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">MediMind</h1>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
        </div>
        <Avatar>
            <AvatarImage src="https://picsum.photos/seed/101/128/128" alt="User avatar" data-ai-hint="female portrait" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
              <CardDescription>
                Describe your symptoms or upload a medical report for an initial analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  placeholder="e.g., 'I have a fever, cough, and a headache.'"
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="report">Upload Report (Optional)</Label>
                <input id="report" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleReportUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isLoading || (!symptoms && !report)}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Analysis
              </Button>
            </CardFooter>
          </Card>
        </div>

        {isLoading && (
            <div className="w-full max-w-3xl mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis in Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-8">
                         <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        )}

        {diagnoses && (
          <div className="w-full max-w-3xl mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Potential Diagnoses</CardTitle>
                <CardDescription>
                  This is a preliminary analysis. Please consult a medical professional for a definitive diagnosis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {diagnoses.map((diag, index) => (
                    <li key={index} className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-semibold text-lg">{diag.diagnosis}</h3>
                      <p className="text-sm text-muted-foreground">{diag.justification}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
