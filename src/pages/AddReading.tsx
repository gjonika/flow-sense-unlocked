
import { useState } from "react";
import { ReadingForm } from "@/components/reading/ReadingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MonthlyReadingsForm } from "@/components/reading/MonthlyReadingsForm";

const AddReading = () => {
  // Using this blank useState to satisfy the imports for now
  const [activeTab] = useState("single");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#808355]">Add Utility Reading</h1>
        <p className="text-muted-foreground">
          Enter your latest utility readings or monthly payments
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList>
          <TabsTrigger value="single">Single Reading</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Readings</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card className="p-6">
            <ReadingForm />
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card className="p-6">
            <MonthlyReadingsForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddReading;
