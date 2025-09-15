import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, SlidersHorizontal } from 'lucide-react';

export function ValidationNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            Clinician Validation & Audit
        </CardTitle>
        <CardDescription>
          Review AI outputs and provide validation notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="clinician-notes">Review Notes</Label>
          <Textarea
            placeholder="Enter your validation notes, concurrences, or disagreements here..."
            id="clinician-notes"
            className="min-h-24"
          />
        </div>
         <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                System Robustness Checks
            </h4>
            <div className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
                <p>✓ Synthetic stress testing: <span className="text-foreground">Passed (99.8% accuracy)</span></p>
                <p>✓ Explainability trace audit: <span className="text-foreground">Completed</span></p>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto bg-accent hover:bg-accent/90">Submit Review</Button>
      </CardFooter>
    </Card>
  );
}
