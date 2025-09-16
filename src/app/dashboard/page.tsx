
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateDetailedDiagnoses } from '@/ai/flows/generate-detailed-diagnoses';
import { GenerateDetailedDiagnosesOutput } from '@/ai/types';
import { Loader2, FileUp, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [report, setReport] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState<GenerateDetailedDiagnosesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setReport(file);
      setFileName(file.name);
    }
  };

  const saveToHistory = (result: GenerateDetailedDiagnosesOutput) => {
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      inputType: report ? "Report" : "Symptoms",
      input: report ? `Uploaded ${report.name}` : symptoms,
      result: result.conditions.length > 0 ? result.conditions[0].name : "No specific condition identified.",
    };

    try {
      const existingHistory = JSON.parse(localStorage.getItem('symptomHistory') || '[]');
      const updatedHistory = [historyItem, ...existingHistory];
      localStorage.setItem('symptomHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history to local storage:", e);
    }
  };

  const handleSubmit = async () => {
    if (!symptoms && !report) return;

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    const performAnalysis = async (reportDataUri: string | null) => {
      try {
        const result = await generateDetailedDiagnoses({
          symptoms,
          reportDataUri: reportDataUri || undefined
        });

        setAnalysis(result);

        if (result && result.conditions && result.conditions.length > 0) {
          saveToHistory(result);
        }

      } catch (err) {
        console.error("Analysis failed:", err);
        setError("An unexpected error occurred while performing the analysis. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (report) {
      const reader = new FileReader();
      reader.readAsDataURL(report);
      reader.onload = () => performAnalysis(reader.result as string);
      reader.onerror = () => {
        console.error("Could not read file.");
        setError("There was an error reading your uploaded file. Please check the file and try again.");
        setIsLoading(false);
      }
    } else {
      performAnalysis(null);
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
            <CardTitle>Symptom Checker</CardTitle>
            <CardDescription>
              Describe your symptoms or upload a medical report for a detailed analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                placeholder="e.g., 'For the last 3 days, I've had a persistent dry cough, a fever of 101°F, and muscle aches all over my body.'"
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-32"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="report">Upload Report (PDF, PNG, JPG)</Label>
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" className="relative cursor-pointer">
                  <label htmlFor="report-upload">
                    <FileUp className="mr-2" />
                    Choose File
                  </label>
                </Button>
                <input id="report-upload" type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleReportUpload} />
                {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading || (!symptoms && !report)}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Detailed Analysis
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Analysis in Progress</CardTitle>
              <CardDescription>Our AI is analyzing your information. This may take a moment, especially with PDF files.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing symptoms and reports...</p>
            </CardContent>
          </Card>
        </motion.div>
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

      {analysis && (!analysis.conditions || analysis.conditions.length === 0) && !isLoading && (
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mt-8"
        >
            <Card>
                 <CardHeader>
                    <CardTitle>Analysis Not Available</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{analysis.nextSteps || "The AI could not provide an analysis for the given input."}</p>
                </CardContent>
            </Card>
        </motion.div>
      )}

      {analysis && analysis.conditions && analysis.conditions.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mt-8"
        >
          <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Detailed Diagnostic Analysis</CardTitle>
              <CardDescription>
                This is a preliminary AI-generated analysis. Always consult a qualified medical professional for a definitive diagnosis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RiskChart riskScore={analysis.riskScore} />
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">Recommended Next Steps</h3>
                    <p className="text-sm text-primary">{analysis.nextSteps}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Vitals to Monitor</h3>
                    <ul className="list-disc list-inside text-sm">
                      {analysis.vitalsToMonitor.map((vital, i) => <li key={i}>{vital}</li>)}
                    </ul>
                  </div>
                </div>
              </div>


              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Possible Conditions</h3>
                <ul className="space-y-4">
                  {analysis.conditions.map((condition, index) => (
                    <li key={index} className="p-4 bg-secondary/50 rounded-lg transition-transform hover:scale-[1.02]">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg text-primary">{condition.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${condition.likelihood === 'High' ? 'bg-destructive/80 text-destructive-foreground' :
                          condition.likelihood === 'Medium' ? 'bg-yellow-500/80 text-white' :
                            'bg-green-500/80 text-white'
                          }`}>
                          {condition.likelihood} Likelihood
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{condition.explanation}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <h5 className="font-semibold mb-1">Differential Diagnoses</h5>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {condition.differentialDiagnoses.map(diag => <li key={diag}>{diag}</li>)}
                          </ul>
                        </div>
                        <div>
                           <h5 className="font-semibold mb-1">Suggested Medications</h5>
                           <ul className="list-disc list-inside text-muted-foreground">
                            {condition.medications.map(med => <li key={med}>{med}</li>)}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Alert variant="destructive">
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  {analysis.disclaimer}
                </AlertDescription>
              </Alert>

            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

const RiskChart = ({ riskScore }: { riskScore: number }) => {
    const chartData = [{ name: 'risk', value: riskScore }, { name: 'remaining', value: 100 - riskScore }];
    const chartConfig: ChartConfig = {
      risk: { label: 'Risk' },
    };
    const riskColor = riskScore > 75 ? 'hsl(var(--destructive))' : riskScore > 40 ? 'hsl(var(--primary))' : 'hsl(var(--chart-2))';

    return (
        <Card className="flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-semibold mb-2">Overall Risk Score</h3>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full max-h-[200px]">
                <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} startAngle={90} endAngle={450}>
                    <Cell fill={riskColor} />
                    <Cell fill="hsl(var(--muted))" />
                </Pie>
                </PieChart>
            </ChartContainer>
            <p className="text-4xl font-bold mt-[-2.5rem] mb-2" style={{ color: riskColor }}>{riskScore}</p>
            <p className="text-sm text-muted-foreground">out of 100</p>
        </Card>
    )
}
