
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useThemeStore, applyThemeColor } from "@/lib/theme";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { UtilityCardsSection } from "@/components/dashboard/UtilityCardsSection";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { toast } = useToast();
  const { getColor } = useThemeStore();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { isLoading, hasReadings, monthlyData, utilityCards } = useDashboardData(selectedYear);

  useEffect(() => {
    // Apply default theme
    applyThemeColor(getColor('default'));

    // Welcome toast on first load
    toast({
      title: "Welcome to UtilityFlow",
      description: "Track and analyze your utility usage over time.",
    });
  }, [toast, getColor]);

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader 
        hasReadings={hasReadings} 
        selectedYear={selectedYear} 
        setSelectedYear={setSelectedYear} 
      />

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center p-12">
            <p>Loading...</p>
          </CardContent>
        </Card>
      ) : hasReadings && utilityCards.length > 0 && monthlyData.length > 0 ? (
        <>
          <UtilityCardsSection utilityCards={utilityCards} />
          <DashboardCharts monthlyData={monthlyData} selectedYear={selectedYear} />
        </>
      ) : (
        <WelcomeCard hasReadings={hasReadings} selectedYear={selectedYear} />
      )}
    </div>
  );
};

export default Dashboard;
