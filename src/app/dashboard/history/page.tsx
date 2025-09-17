
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileText, Stethoscope } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type HistoryItem = {
    id: number;
    date: string;
    inputType: "Symptoms" | "Report";
    input: string;
    result: string;
};

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        setIsClient(true);
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const currentUser = JSON.parse(userStr);
                setCurrentUserId(currentUser.id);
                const historyKey = `symptomHistory_${currentUser.id}`;
                const savedHistory = localStorage.getItem(historyKey);
                if (savedHistory) {
                    setHistory(JSON.parse(savedHistory));
                }
            }
        } catch (error) {
            console.error("Could not load history from local storage:", error);
        }
    }, []);

    const clearHistory = () => {
        if (!currentUserId) return;
        try {
            const historyKey = `symptomHistory_${currentUserId}`;
            localStorage.removeItem(historyKey);
            setHistory([]);
        } catch (error) {
            console.error("Could not clear history from local storage:", error);
        }
    };


  return (
    <div className="p-4 md:p-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Analysis History</CardTitle>
                    <CardDescription>
                        Here is a record of your past symptom analyses.
                    </CardDescription>
                </div>
                 {isClient && history.length > 0 && (
                    <Button variant="outline" onClick={clearHistory}>Clear History</Button>
                )}
            </CardHeader>
            <CardContent>
                {isClient && history.length > 0 ? (
                    <ul className="space-y-4">
                        {history.map((item) => (
                            <li key={item.id} className="p-4 bg-secondary/30 rounded-lg flex items-start gap-4">
                                <div className="p-3 bg-secondary rounded-full">
                                    {item.inputType === 'Symptoms' ? <Stethoscope className="text-primary" /> : <FileText className="text-primary" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{item.inputType}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        <span className="font-medium text-foreground">Input: </span>{item.input}
                                    </p>
                                     <p className="text-sm text-muted-foreground mt-1">
                                        <span className="font-medium text-foreground">Result: </span>{item.result}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                         <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-sm font-semibold">No History Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Perform an analysis in the Symptom Checker to see your history.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
