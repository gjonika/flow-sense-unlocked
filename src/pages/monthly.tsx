
import { AccordionReadingForm } from "../components/reading/AccordionReadingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonthlyReadingsPage() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#808355]">Monthly Readings</h1>
        <p className="text-muted-foreground">
          Enter multiple utility readings for the current month
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Monthly Readings</CardTitle>
          <CardDescription>
            Select a utility supplier to enter your reading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccordionReadingForm />
        </CardContent>
      </Card>
    </div>
  );
}
