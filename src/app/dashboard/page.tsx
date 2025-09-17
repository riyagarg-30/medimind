
"use client";

import { useState, useRef, DragEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateDetailedDiagnoses } from '@/ai/flows/generate-detailed-diagnoses';
import { GenerateDetailedDiagnosesOutput } from '@/ai/types';
import { Loader2, AlertTriangle, Activity, X, ImageIcon, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ClinicianDashboard } from '@/components/clinician-dashboard';

type HistoryItem = {
    id: number;
    date: string;
    inputType: "Symptoms" | "Report";
    input: string;
    result: string;
};

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  age: number | '';
  address: string;
  role: 'user' | 'clinician';
  profilePic: string;
  lastCondition?: string;
}

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GenerateDetailedDiagnosesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);

   useEffect(() => {
    setIsClient(true);
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error("Failed to load current user from local storage", error);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
       const reader = new FileReader();
      reader.onload = (e) => {
        setReportDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHistoryAndRecordCondition = (analysisResult: GenerateDetailedDiagnosesOutput) => {
    if (!currentUser) return;

    const topCondition = analysisResult.conditions?.[0]?.name;

    const newItem: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      inputType: reportDataUri ? 'Report' : 'Symptoms',
      input: reportDataUri ? `Report + ${symptoms}` : symptoms,
      result: analysisResult.summaryReport || "No summary available.",
    };

    try {
        const historyKey = `symptomHistory_${currentUser.id}`;
        const savedHistory = localStorage.getItem(historyKey);
        const history: HistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = [newItem, ...history];
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save to history:", error);
    }

    if (topCondition) {
        try {
            const allUsersString = localStorage.getItem('users');
            if (allUsersString) {
                let allUsers: CurrentUser[] = JSON.parse(allUsersString);
                const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
                if (userIndex > -1) {
                    allUsers[userIndex].lastCondition = topCondition;
                    localStorage.setItem('users', JSON.stringify(allUsers));
                }
            }
        } catch (error) {
            console.error("Failed to save last condition:", error);
        }
    }
  };


  const handleSubmit = async () => {
    if (!symptoms && !reportDataUri) {
      setError("Please enter symptoms or upload a medical report to get an analysis.");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await generateDetailedDiagnoses({ 
        symptoms,
        description,
        reportDataUri: reportDataUri ?? undefined,
      });
      setAnalysis(result);
      saveToHistoryAndRecordCondition(result);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
        <div className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (isClient && currentUser?.role === 'clinician') {
    return <ClinicianDashboard />;
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
       <div className="w-full max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-primary mb-12 flex items-center justify-center gap-3">
                How are you feeling today? 👼
            </h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Symptom & Report Analysis</CardTitle>
            <CardDescription>
              Enter symptoms for a basic analysis, or upload a medical report for a detailed one.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Key Symptoms (e.g., "Headache")</Label>
                <Input
                    id="symptoms"
                    placeholder="e.g. 'Fever and Cough'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description (Optional)</Label>
                <Textarea
                    id="description"
                    placeholder="e.g. 'I have a high fever, a persistent dry cough, and I've been feeling extremely tired for the past three days.'"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Upload Medical Report (Optional)</Label>
              <div 
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full min-h-[170px] border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, application/pdf"
                  />
                {reportDataUri ? (
                  <div className="relative group">
                    {reportDataUri.startsWith('data:image') ? (
                        <Image src={reportDataUri} alt="Report preview" width={128} height={128} className="rounded-md object-cover h-32 w-32" />
                    ): (
                         <div className="text-center text-muted-foreground p-4 flex flex-col items-center gap-2">
                            <FileText className="h-10 w-10" />
                            <p>PDF report uploaded</p>
                        </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportDataUri(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs">PNG, JPG, WEBP, or PDF</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading || (!symptoms && !reportDataUri)}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity />}
                Run Analysis
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {isLoading && (
          <div className="w-full max-w-4xl mt-8 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is analyzing your data... please wait.</p>
          </div>
      )}

      {error && (
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mt-8"
        >
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        </motion.div>
      )}

      {analysis && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mt-8 space-y-6"
        >
           {/* Red Flags */}
          {analysis.redFlags?.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Urgent Red Flags Detected!</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {analysis.redFlags.map((flag, i) => (
                    <li key={i}><strong>{flag.finding}:</strong> {flag.reasoning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.summaryReport}</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Data Quality & Risk Score */}
            <Card>
              <CardHeader><CardTitle>Assessment Overview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  <div>
                    <Label>Overall Risk Score</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={analysis.riskScore} className="h-3 w-full" />
                      <span className="text-sm font-bold">{analysis.riskScore}%</span>
                    </div>
                  </div>
                  <div>
                    <Label>Data Quality Score</Label>
                     <div className="flex items-center gap-2">
                        <Progress value={analysis.dataQuality?.score} className="h-3 w-full" />
                        <span className="text-sm font-bold">{analysis.dataQuality?.score}%</span>
                    </div>
                  </div>
                  {analysis.dataQuality?.suggestions?.length > 0 && (
                     <Alert variant="default" className="mt-2">
                        <AlertTitle className="text-sm">Quality Suggestions</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 text-xs">
                           {analysis.dataQuality.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                          </ul>
                        </AlertDescription>
                     </Alert>
                  )}
              </CardContent>
            </Card>

             {/* Next Steps & Vitals */}
            <Card>
              <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  <div>
                    <Label>Next Steps</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">{analysis.nextSteps}</p>
                  </div>
                  <div>
                    <Label>Vitals to Monitor</Label>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {analysis.vitalsToMonitor?.map(vital => <Badge key={vital} variant="secondary">{vital}</Badge>)}
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
          
           {/* Biomarker Analysis */}
          {analysis.biomarkerAnalysis && analysis.biomarkerAnalysis.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Biomarkers from Report</h3>
                <div className="space-y-4">
                    {analysis.biomarkerAnalysis.map((biomarker, index) => {
                        const [valStr, normalStr] = [biomarker.value, biomarker.normalRange];
                        const val = parseFloat(valStr);
                        const [min, max] = normalStr.split('-').map(parseFloat);
                        const isNormal = val >= min && val <= max;

                        const chartData = [{
                            name: biomarker.name,
                            value: val,
                            normalMin: min,
                            normalMax: max
                        }];

                        return (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-lg">{biomarker.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-1 space-y-1">
                                        <p className="text-xs text-muted-foreground">Your Value</p>
                                        <p className={`text-3xl font-bold ${!isNormal ? 'text-destructive' : ''}`}>{biomarker.value} <span className="text-lg font-normal text-muted-foreground">{biomarker.unit}</span></p>
                                        <p className="text-xs text-muted-foreground">Normal Range: {biomarker.normalRange} {biomarker.unit}</p>
                                    </div>
                                    <div className="md:col-span-2 h-24">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis type="number" domain={[min * 0.8, max * 1.2]} hide />
                                                <YAxis type="category" dataKey="name" hide />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                                    <p className="text-sm">{`${payload[0].value} ${biomarker.unit}`}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar dataKey="normalMax" stackId="a" fill="hsl(var(--secondary))" radius={[5, 5, 5, 5]} barSize={15} background={{ fill: '#eee', radius: 5 }} />
                                                <Bar dataKey="value" stackId="b" fill={isNormal ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} barSize={15} radius={[5, 5, 5, 5]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="md:col-span-3">
                                         <p className="text-sm pt-2 text-muted-foreground">{biomarker.explanation}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
          )}


          {/* Ranked Diagnostic Analysis */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Ranked Diagnostic Analysis</h3>
            <Accordion type="single" collapsible defaultValue="item-0">
              {analysis.conditions?.map((condition, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-lg">{condition.name}</span>
                        <Badge variant={condition.likelihood === 'High' ? 'destructive' : condition.likelihood === 'Medium' ? 'default' : 'outline'}>
                            {condition.likelihood} Likelihood
                        </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold">Explanation</h4>
                      <p className="text-sm text-muted-foreground">{condition.explanation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Evidence</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {condition.evidence.map((e, i) => <li key={i}>{e}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Common Medications</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {condition.medications.map(med => <Badge key={med} variant="outline">{med}</Badge>)}
                      </div>
                       <p className="text-xs text-muted-foreground mt-2">Disclaimer: Consult a doctor before taking any medication.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Differential Diagnoses</h4>
                       <p className="text-sm text-muted-foreground">{condition.differentialDiagnoses.join(', ')}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>{analysis.disclaimer}</AlertDescription>
          </Alert>

        </motion.div>
      )}
    </div>
  );
}

    