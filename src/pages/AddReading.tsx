
import { useState } from "react";
import { ReadingForm } from "@/components/reading/ReadingForm";
import { Card } from "@/components/ui/card";

const AddReading = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#808355]">Add Utility Reading</h1>
        <p className="text-muted-foreground">
          Enter your latest utility readings
        </p>
      </div>

      <Card className="p-6">
        <ReadingForm />
      </Card>
    </div>
  );
};

export default AddReading;
