
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getYearOptions } from "@/lib/data-utils";

interface DashboardHeaderProps {
  hasReadings: boolean;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

export function DashboardHeader({ hasReadings, selectedYear, setSelectedYear }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const yearOptions = getYearOptions();

  const handleAddReading = () => {
    navigate("/add-reading");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your utility consumption and costs
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {hasReadings && (
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button 
          onClick={handleAddReading}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{hasReadings ? "Add New Reading" : "Add Reading"}</span>
        </Button>
      </div>
    </div>
  );
}
