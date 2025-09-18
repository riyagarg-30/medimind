
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { qnaChatbot } from '@/ai/flows/qna-chatbot';
import type { QnaChatbotOutput } from '@/ai/types';
import { Loader2, ArrowRight, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { Part } from 'genkit/cohere';
import { ClinicianDashboard } from '@/components/clinician-dashboard';

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
  const [history, setHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QnaChatbotOutput | null>(null);
  const [analysis, setAnalysis] = useState<{ conditions: Condition[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'symptoms' | 'qna' | 'analysis'>('symptoms');
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

  const startAnalysis = async () => {
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
      setStep('symptoms');
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
            // The diagnosis is in the question field of the final response
            const finalDiagnosisText = result.question;
            const parsedConditions = parseDiagnosis(finalDiagnosisText);
            setAnalysis({ conditions: parsedConditions });
            setStep('analysis');
        } else {
            setCurrentQuestion(result);
        }
    } catch (err: any) {
        setError(err.message || "An error occurred during the analysis.");
    } finally {
        setIsLoading(false);
    }
  };

  // Helper function to parse the final diagnosis text into structured data
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
    setHistory([]);
    setCurrentQuestion(null);
    setAnalysis(null);
    setError(null);
    setStep('symptoms');
    setIsLoading(false);
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
    <div className="flex flex-col items-center gap-8 p-4 md:p-8 min-h-[calc(100vh-10rem)]">
        <h1 className="text-4xl font-bold text-foreground">Symptom Checker</h1>

        <AnimatePresence mode="wait">
            {step === 'symptoms' && (
                <motion.div
                    key="symptoms"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-lg"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>How are you feeling?</CardTitle>
                            <CardDescription>Describe your main symptoms to begin the analysis.</CardDescription>
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
                            <Button onClick={startAnalysis} disabled={isLoading || !symptoms.trim()} size="lg">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
                                Start AI Analysis
                            </Button>
                        </CardFooter>
                    </Card>
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
            
            {step === 'analysis' && analysis && (
                <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Diagnostic Confidence</CardTitle>
                            <CardDescription>Based on your answers, here are the most likely conditions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="w-full h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analysis.conditions} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} layout="vertical">
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
                            <Button onClick={handleReset}>Start Over</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

        </AnimatePresence>

    </div>
  );
}
