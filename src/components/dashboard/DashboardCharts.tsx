
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtilityChart } from "@/components/UtilityChart";
import { RecentReadingsTable } from "@/components/RecentReadingsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardChartsProps {
  monthlyData: any[];
  selectedYear: number;
}

export function DashboardCharts({ monthlyData, selectedYear }: DashboardChartsProps) {
  if (!monthlyData || monthlyData.length === 0) {
    return null;
  }

  // Add state for utility type filter
  const [selectedUtilityType, setSelectedUtilityType] = useState<string>("all");

  // Get unique utility types from the data
  const getUtilityTypes = () => {
    const utilityTypes = new Set<string>();
    
    monthlyData.forEach(month => {
      Object.keys(month).forEach(key => {
        if (key !== "month" && month[key] !== null) {
          utilityTypes.add(key);
        }
      });
    });
    
    return Array.from(utilityTypes);
  };

  // Filter data for chart based on selected utility type
  const getFilteredData = () => {
    if (selectedUtilityType === "all") {
      return monthlyData;
    }
    
    return monthlyData.map(month => {
      const filteredMonth: any = { month: month.month };
      if (month[selectedUtilityType] !== undefined) {
        filteredMonth[selectedUtilityType] = month[selectedUtilityType];
      }
      return filteredMonth;
    });
  };

  const utilityTypes = getUtilityTypes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-col space-y-1.5 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Consumption Trends</CardTitle>
              <CardDescription>
                Monthly utility consumption for {selectedYear}
              </CardDescription>
            </div>
            <Select value={selectedUtilityType} onValueChange={setSelectedUtilityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select utility type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilities</SelectItem>
                {utilityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <UtilityChart data={getFilteredData()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>
            Your latest submitted utility readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentReadingsTable />
        </CardContent>
      </Card>
    </div>
  );
}
