
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeCardProps {
  hasReadings: boolean;
  selectedYear: number;
}

export function WelcomeCard({ hasReadings, selectedYear }: WelcomeCardProps) {
  const navigate = useNavigate();

  const handleAddReading = () => {
    navigate("/add-reading");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to UtilityFlow</CardTitle>
        <CardDescription>
          Get started by adding your first utility reading
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-10">
        <div className="text-center mb-6">
          <p className="text-muted-foreground mb-4">
            {hasReadings 
              ? `No readings found for ${selectedYear}. Try selecting a different year or add new readings.` 
              : "You haven't added any readings yet. Add your first reading to start tracking your utility usage."}
          </p>
          <Button 
            onClick={handleAddReading}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{hasReadings ? "Add New Reading" : "Add Your First Reading"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
