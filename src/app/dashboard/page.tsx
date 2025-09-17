
"use client";

import { useState, useRef, DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateDetailedDiagnoses } from '@/ai/flows/generate-detailed-diagnoses';
import { GenerateDetailedDiagnosesOutput } from '@/ai/types';
import { Loader2, AlertTriangle, Activity, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GenerateDetailedDiagnosesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onload = (e) => {
        setReportDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!symptoms && !reportDataUri && !description) {
      setError("Please enter your symptoms, a description, or upload a report to get an analysis.");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await generateDetailedDiagnoses({ 
        symptoms,
        description,
        ...(reportDataUri && { reportDataUri }),
       });
      setAnalysis(result);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>AI-Powered Diagnostic Analysis</CardTitle>
            <CardDescription>
              Enter symptoms, a detailed description, and/or upload a medical report for a comprehensive analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            
            <div className="space-y-2">
              <Label>Upload Medical Report (Optional)</Label>
              <div 
                className={cn(
                  "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
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
                    accept="image/png, image/jpeg, image/webp"
                  />
                {reportDataUri ? (
                  <div className="relative group">
                    <Image src={reportDataUri} alt="Report preview" width={128} height={128} className="rounded-md object-cover h-32 w-32" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportDataUri(null);
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
                    <p className="text-xs">PNG, JPG or WEBP</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading || (!symptoms && !reportDataUri && !description)}>
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
                    <Progress value={analysis.riskScore} className="h-3" />
                    <p className="text-sm font-bold text-right">{analysis.riskScore}%</p>
                  </div>
                  <div>
                    <Label>Data Quality Score</Label>
                    <Progress value={analysis.dataQuality?.score} className="h-3" />
                     <p className="text-sm font-bold text-right">{analysis.dataQuality?.score}%</p>
                  </div>
                  {analysis.dataQuality?.suggestions?.length > 0 && (
                     <Alert variant="default" className="mt-2">
                        <AlertTitle>Quality Suggestions</AlertTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.biomarkerAnalysis.map((biomarker, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="text-primary"/>
                        {biomarker.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{biomarker.value}</span>
                        <span className="text-muted-foreground">{biomarker.unit}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Normal Range: {biomarker.normalRange}
                      </div>
                      <p className="text-sm pt-2">{biomarker.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
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

    