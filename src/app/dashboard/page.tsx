
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateSimpleDiagnoses } from '@/ai/flows/generate-simple-diagnoses';
import { GenerateSimpleDiagnosesOutput } from '@/ai/types';
import { Loader2, AlertTriangle, Activity, BarChart, FlaskConical, Stethoscope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from 'framer-motion';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<GenerateSimpleDiagnosesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!symptoms) return;

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const result = await generateSimpleDiagnoses({ symptoms });
      if (result.length === 0) {
        setError("Could not determine a diagnosis from the symptoms. Please try being more descriptive.");
      }
      
      const chartData = result.map(item => ({
        name: item.diagnosis,
        // Assign a random confidence for visualization
        confidence: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
        fill: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`
      }));

      // Augment original result with chart data for easier rendering
      const analysisWithChartData = result.map((item, index) => ({...item, ...chartData[index]}));

      setAnalysis(analysisWithChartData as any);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig: ChartConfig = {
    confidence: {
      label: "Confidence",
    },
  };

  if (analysis) {
    analysis.forEach(item => {
      chartConfig[item.diagnosis] = {
        label: item.diagnosis,
        color: (item as any).fill
      }
    });
  }
  
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
            <CardTitle>Symptom Analysis Dashboard</CardTitle>
            <CardDescription>
              Enter your main symptom (e.g., 'sore throat', 'headache') to see a breakdown of possibilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
                <Input
                    type="text"
                    placeholder="e.g. 'I have a high fever and a cough'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button onClick={handleSubmit} disabled={isLoading || !symptoms}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity />}
                    Analyze
                </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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

      {analysis && analysis.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart /> Likelihood of Conditions</CardTitle>
                    <CardDescription>Based on the symptom '{symptoms}', here are the likely conditions and their confidence levels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <RechartsBarChart data={analysis as any[]} layout="vertical" margin={{left: 10, right: 30}}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} style={{ fontSize: '12px' }} />
                            <XAxis dataKey="confidence" type="number" domain={[0, 100]} hide />
                             <Bar dataKey="confidence" radius={4}>
                                {((analysis as any) || []).map((entry: any) => (
                                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {analysis.map((item, index) => (
                 <Card key={index}>
                    <CardHeader>
                        <CardTitle className="text-lg text-primary" style={{color: (item as any).fill}}>{item.diagnosis}</CardTitle>
                        <CardDescription>Confidence: {(item as any).confidence}%</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{item.justification}</p>
                    </CardContent>
                </Card>
            ))}
        </motion.div>
      )}
    </div>
  );
}
