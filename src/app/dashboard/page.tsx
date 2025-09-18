
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { qnaChatbot } from '@/ai/flows/qna-chatbot';
import { generateDetailedDiagnoses } from '@/ai/flows/generate-detailed-diagnoses';
import type { QnaChatbotOutput, GenerateDetailedDiagnosesOutput } from '@/ai/types';
import { Loader2, ArrowRight, Bot, UploadCloud, FileCheck2, AlertCircle, TrendingUp, FlaskConical, BarChart3, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import type { Part } from 'genkit/cohere';
import { ClinicianDashboard } from '@/components/clinician-dashboard';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Message = {
    role: 'user' | 'model';
    parts: Part[];
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

type Condition = {
    name: string;
    confidenceScore: number;
}

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportDataUri, setReportDataUri] = useState<string | null>(null);
  
  const [history, setHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QnaChatbotOutput | null>(null);
  const [qnaAnalysis, setQnaAnalysis] = useState<{ conditions: Condition[] } | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<GenerateDetailedDiagnosesOutput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'qna' | 'analysis'>('input');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: "File too large", description: "Please upload a file smaller than 4MB.", variant: "destructive" });
        return;
      }
      setReportFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReportDataUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
        setReportFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setReportDataUri(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const startQnaAnalysis = async () => {
    if (!symptoms.trim()) {
      setError("Please enter your primary symptoms.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setStep('qna');
    
    const initialHistory: Message[] = [{ role: 'user', parts: [{ text: `My symptoms are: ${symptoms}` }] }];
    setHistory(initialHistory);

    try {
      const result = await qnaChatbot({ history: initialHistory });
      setCurrentQuestion(result);
    } catch (err: any) {
      setError(err.message || "An error occurred starting the analysis.");
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const startDetailedAnalysis = async () => {
    if (!reportDataUri) {
        setError("Please upload a medical report.");
        return;
    }
    setError(null);
    setIsLoading(true);
    setStep('analysis');
    setDetailedAnalysis(null);

    try {
        const result = await generateDetailedDiagnoses({ 
            reportDataUri,
            symptoms,
            description
        });
        setDetailedAnalysis(result);
        if (result.conditions && result.conditions.length > 0 && currentUser) {
            const historyKey = `symptomHistory_${currentUser.id}`;
            const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
            const newHistoryItem = {
                id: Date.now(),
                date: new Date().toISOString(),
                inputType: "Report",
                input: `Report: ${reportFile?.name}`,
                result: result.conditions[0].name
            };
            localStorage.setItem(historyKey, JSON.stringify([newHistoryItem, ...savedHistory]));
        }
    } catch (err: any) {
        console.error("Detailed analysis failed:", err);
        setError(err.message || "An error occurred during the detailed analysis. The AI model may have returned an invalid response.");
        setStep('input');
    } finally {
        setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    setIsLoading(true);
    const newHistory: Message[] = [
        ...history,
        { role: 'model', parts: [{ text: currentQuestion?.question || '' }] },
        { role: 'user', parts: [{ text: answer }] }
    ];
    setHistory(newHistory);
    setCurrentQuestion(null);

    try {
        const result = await qnaChatbot({ history: newHistory });
        if (result.isFinal) {
            const finalDiagnosisText = result.question;
            const parsedConditions = parseDiagnosis(finalDiagnosisText);
            setQnaAnalysis({ conditions: parsedConditions });
            setStep('analysis');
            if (parsedConditions.length > 0 && currentUser) {
                const historyKey = `symptomHistory_${currentUser.id}`;
                const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
                const newHistoryItem = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    inputType: "Symptoms",
                    input: symptoms,
                    result: parsedConditions[0].name
                };
                localStorage.setItem(historyKey, JSON.stringify([newHistoryItem, ...savedHistory]));
            }
        } else {
            setCurrentQuestion(result);
        }
    } catch (err: any) {
        setError(err.message || "An error occurred during the analysis.");
    } finally {
        setIsLoading(false);
    }
  };

  const parseDiagnosis = (diagnosisText: string): Condition[] => {
      const conditionRegex = /- (.*?): (\d+)%/g;
      let match;
      const conditions: Condition[] = [];
      while ((match = conditionRegex.exec(diagnosisText)) !== null) {
          conditions.push({ name: match[1], confidenceScore: parseInt(match[2]) });
      }
      if (conditions.length === 0) return [{ name: 'Could not determine', confidenceScore: 0 }];
      return conditions;
  };

  const handleReset = () => {
    setSymptoms('');
    setDescription('');
    setReportFile(null);
    setReportDataUri(null);
    setHistory([]);
    setCurrentQuestion(null);
    setQnaAnalysis(null);
    setDetailedAnalysis(null);
    setError(null);
    setStep('input');
    setIsLoading(false);
  };
  
  if (!isClient) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (isClient && currentUser?.role === 'clinician') {
    return <ClinicianDashboard />;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8 min-h-[calc(100vh-10rem)]">
        
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <h1 className="text-4xl font-bold text-foreground text-center mb-8">Symptom Checker</h1>
            <Tabs defaultValue="symptoms" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
                <TabsTrigger value="report">Report Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="symptoms">
                <Card>
                  <CardHeader>
                    <CardTitle>How are you feeling?</CardTitle>
                    <CardDescription>Describe your main symptoms to begin the interactive analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="e.g., 'Headache, fever, and a runny nose'"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      disabled={isLoading}
                      className="h-12 text-lg"
                    />
                    {error && <p className="text-destructive text-sm">{error}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={startQnaAnalysis} disabled={isLoading || !symptoms.trim()} size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
                      Start AI Q&A
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="report">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Medical Report</CardTitle>
                    <CardDescription>Upload a photo or PDF of your medical report for a detailed analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label 
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        htmlFor="report-upload"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {reportFile ? (
                                <>
                                    <FileCheck2 className="w-10 h-10 mb-3 text-primary" />
                                    <p className="mb-2 text-sm text-foreground"><span className="font-semibold">File selected:</span> {reportFile.name}</p>
                                    <p className="text-xs text-muted-foreground">Click or drag to change</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 4MB)</p>
                                </>
                            )}
                        </div>
                        <Input id="report-upload" ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf"/>
                    </label>
                    <Textarea 
                        placeholder="Optionally, add your key symptoms or a brief description for more context."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && <p className="text-destructive text-sm">{error}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={startDetailedAnalysis} disabled={isLoading || !reportFile} size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
                      Generate Detailed Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {step === 'qna' && (
          <motion.div
              key="qna"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl"
          >
              <Card className="p-6">
                  {isLoading && !currentQuestion ? (
                      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                          <p className="text-muted-foreground">AI is thinking...</p>
                      </div>
                  ) : currentQuestion && (
                      <div className="text-center">
                          <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
                          <div className="flex flex-wrap justify-center gap-4">
                              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                                  currentQuestion.options.map((option, index) => (
                                      <Button key={index} onClick={() => handleAnswer(option)} variant="outline" size="lg">
                                          {option}
                                      </Button>
                                  ))
                              ) : (
                                  <form onSubmit={(e) => { e.preventDefault(); handleAnswer(e.currentTarget.answer.value); }} className="flex gap-2 w-full max-w-md mx-auto">
                                      <Input name="answer" placeholder="Type your answer..." required className="h-11"/>
                                      <Button type="submit" size="icon" className="h-11 w-11"><ArrowRight /></Button>
                                  </form>
                              )}
                          </div>
                      </div>
                  )}
                   {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
              </Card>
          </motion.div>
        )}
        
        {step === 'analysis' && (qnaAnalysis || detailedAnalysis) && (
            <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Analysis Results</h1>
                    <Button onClick={handleReset} variant="outline">Start Over</Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Generating detailed report...</p>
                    </div>
                ) : qnaAnalysis ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Diagnostic Confidence</CardTitle>
                            <CardDescription>Based on your answers, here are the most likely conditions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="w-full h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={qnaAnalysis.conditions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                        <XAxis type="number" domain={[0, 100]} unit="%" />
                                        <YAxis dataKey="name" type="category" width={120} />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--accent))' }}
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                            <p className="font-bold">{label}</p>
                                                            <p className="text-sm text-primary">{`Confidence: ${payload[0].value}%`}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="confidenceScore" name="Confidence" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                         <CardFooter className="flex-col items-start gap-4">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">Disclaimer:</span> This is an AI-generated analysis and not a substitute for professional medical advice. Please consult a qualified healthcare provider.
                            </p>
                        </CardFooter>
                    </Card>
                ) : detailedAnalysis && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {detailedAnalysis.redFlags.length > 0 && (
                                <Card className="border-destructive">
                                    <CardHeader className="flex flex-row items-center gap-3">
                                        <AlertCircle className="w-8 h-8 text-destructive" />
                                        <div>
                                            <CardTitle>Red Flag Findings</CardTitle>
                                            <CardDescription>Urgent issues detected that require immediate attention.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {detailedAnalysis.redFlags.map((flag, i) => (
                                                <li key={i} className="p-3 bg-destructive/10 rounded-md">
                                                    <p className="font-semibold text-destructive">{flag.finding}</p>
                                                    <p className="text-sm text-destructive/90">{flag.reasoning}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><BarChart3/> Ranked Diagnostic Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                    {detailedAnalysis.conditions.map((condition, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>
                                                <div className="flex justify-between w-full pr-4 items-center">
                                                    <span className="font-semibold">{index + 1}. {condition.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">{condition.confidenceScore}%</span>
                                                        <Progress value={condition.confidenceScore} className="w-24 h-2" />
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-3 text-muted-foreground">
                                                <p><span className="font-semibold text-foreground">Explanation:</span> {condition.explanation}</p>
                                                <p><span className="font-semibold text-foreground">Evidence:</span> {condition.evidence.join(', ')}</p>
                                                <p><span className="font-semibold text-foreground">Common Medications:</span> {condition.medications.join(', ')}</p>
                                                <p><span className="font-semibold text-foreground">Differential Diagnoses:</span> {condition.differentialDiagnoses.join(', ')}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    </Accordion>
                                </CardContent>
                            </Card>

                            {detailedAnalysis.biomarkerAnalysis && detailedAnalysis.biomarkerAnalysis.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><FlaskConical/> Key Biomarker Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {detailedAnalysis.biomarkerAnalysis.map((biomarker, i) => (
                                                <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                                                    <p className="text-sm text-muted-foreground">{biomarker.name}</p>
                                                    <p className="text-2xl font-bold">{biomarker.value}</p>
                                                    <p className="text-xs text-muted-foreground">{biomarker.unit}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">Range: {biomarker.normalRange}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><ListChecks/> Summary & Next Steps</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <h4 className="font-semibold">Overall Assessment</h4>
                                        <p className="text-sm text-muted-foreground">{detailedAnalysis.summaryReport}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Recommended Next Steps</h4>
                                        <p className="text-sm text-muted-foreground">{detailedAnalysis.nextSteps}</p>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2"><TrendingUp/> Vitals to Monitor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                   <div className="flex flex-wrap gap-2">
                                        {detailedAnalysis.vitalsToMonitor.map((vital, i) => (
                                            <Badge key={i} variant="secondary">{vital}</Badge>
                                        ))}
                                   </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle>Report Quality</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Progress value={detailedAnalysis.dataQuality.score} className="w-24 h-3" />
                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground">{detailedAnalysis.dataQuality.score}%</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{detailedAnalysis.dataQuality.suggestions.join(" ")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card className="bg-secondary/30">
                                <CardContent className="pt-6">
                                     <p className="text-sm text-muted-foreground">
                                        <span className="font-bold text-foreground">Disclaimer:</span> {detailedAnalysis.disclaimer}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                {error && (
                    <Card className="mt-6 border-destructive">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-destructive" />
                            <div>
                                <CardTitle>Analysis Failed</CardTitle>
                                <CardDescription className="text-destructive/90">{error}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
