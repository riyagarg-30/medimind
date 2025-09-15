
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileText, Stethoscope } from "lucide-react";

// This is mock data. In a real application, you would fetch this from a database.
const MOCK_HISTORY = [
    {
        id: 1,
        date: "2024-07-28",
        inputType: "Symptoms",
        input: "Fever, cough, and headache.",
        result: "Possible viral infection, such as the common cold or flu.",
    },
    {
        id: 2,
        date: "2024-07-20",
        inputType: "Report",
        input: "Uploaded blood_test_results.pdf",
        result: "Analysis suggested slightly elevated white blood cell count.",
    },
    {
        id: 3,
        date: "2024-07-15",
        inputType: "Symptoms",
        input: "Sore throat and fatigue for two days.",
        result: "Common cold or mild pharyngitis suggested. Recommended rest and fluids.",
    },
];


export default function HistoryPage() {
  return (
    <div className="p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>
                    Here is a record of your past symptom analyses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {MOCK_HISTORY.length > 0 ? (
                    <ul className="space-y-4">
                        {MOCK_HISTORY.map((item) => (
                            <li key={item.id} className="p-4 bg-secondary/30 rounded-lg flex items-start gap-4">
                                <div className="p-3 bg-secondary rounded-full">
                                    {item.inputType === 'Symptoms' ? <Stethoscope className="text-primary" /> : <FileText className="text-primary" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{item.inputType}</p>
                                        <p className="text-sm text-muted-foreground">{item.date}</p>
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
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No history</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't performed any analyses yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
