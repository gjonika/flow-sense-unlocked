
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useThemeStore, applyThemeColor } from "@/lib/theme";
import { filterDataByYear, getYearOptions, hasData } from "@/lib/data-utils";
import { PlusCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UtilityData {
  month: string;
  usage: number;
  cost: number;
  reading: string;
}

interface UtilityBreakdown {
  name: string;
  value: number;
}

const Analytics = () => {
  const [utilityType, setUtilityType] = useState("electricity");
  const [chartView, setChartView] = useState("usage");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hasReadings, setHasReadings] = useState(false);
  const [utilityData, setUtilityData] = useState<{
    electricity: UtilityData[];
    water: UtilityData[];
    gas: UtilityData[];
    internet: UtilityData[];
    hotWater: UtilityData[];
    phone: UtilityData[];
  }>({
    electricity: [],
    water: [],
    gas: [],
    internet: [],
    hotWater: [],
    phone: [],
  });
  const [utilityBreakdown, setUtilityBreakdown] = useState<UtilityBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getColor } = useThemeStore();
  const navigate = useNavigate();
  
  const yearOptions = getYearOptions();

  useEffect(() => {
    applyThemeColor(getColor('default'));
    fetchReadingsData();
  }, [getColor, selectedYear]);

  const fetchReadingsData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('utility_entries')
        .select('*')
        .order('readingdate', { ascending: false });
      
      if (error) throw error;
      
      const hasEntries = Array.isArray(data) && data.length > 0;
      setHasReadings(hasEntries);
      
      if (hasEntries) {
        processReadingsData(data);
      } else {
        setUtilityData({
          electricity: [],
          water: [],
          gas: [],
          internet: [],
          hotWater: [],
          phone: [],
        });
        setUtilityBreakdown([]);
      }
    } catch (error) {
      console.error('Error fetching readings:', error);
      setHasReadings(false);
    } finally {
      setIsLoading(false);
    }
  };

  const processReadingsData = (data?: any[]) => {
    if (!data && !hasReadings) return;
    
    // Process utility data by type
    const processedData = transformReadingsByType(data);
    setUtilityData(processedData);
    
    // Process breakdown data
    const breakdown = calculateUtilityBreakdown(data);
    setUtilityBreakdown(breakdown);
  };

  const transformReadingsByType = (data?: any[]): {
    electricity: UtilityData[];
    water: UtilityData[];
    gas: UtilityData[];
    internet: UtilityData[];
    hotWater: UtilityData[];
    phone: UtilityData[];
  } => {
    const result = {
      electricity: [] as UtilityData[],
      water: [] as UtilityData[],
      gas: [] as UtilityData[],
      internet: [] as UtilityData[],
      hotWater: [] as UtilityData[],
      phone: [] as UtilityData[],
    };
    
    if (!data || !data.length) return result;
    
    // Filter by selected year
    const yearData = filterDataByYear(data, selectedYear);
    if (!yearData.length) return result;
    
    // Group by utility type and month
    const utilityTypes = ['electricity', 'water', 'gas', 'internet', 'hotWater', 'phone'];
    
    utilityTypes.forEach(type => {
      const entries = yearData.filter(d => d.utilitytype.toLowerCase() === type.toLowerCase());
      if (!entries.length) return;
      
      // Sort by date
      entries.sort((a, b) => new Date(a.readingdate).getTime() - new Date(b.readingdate).getTime());
      
      // Convert to months
      const monthData: UtilityData[] = entries.map(entry => {
        const date = new Date(entry.readingdate);
        return {
          month: date.toLocaleString('default', { month: 'short' }),
          usage: parseFloat(entry.reading || '0'),
          cost: parseFloat(entry.amount || '0'),
          reading: `${entry.reading || '0'} ${entry.unit || ''}`
        };
      });
      
      result[type as keyof typeof result] = monthData;
    });
    
    return result;
  };

  const calculateUtilityBreakdown = (data?: any[]) => {
    if (!data || !data.length) return [];
    
    // Filter by selected year
    const yearData = filterDataByYear(data, selectedYear);
    if (!yearData.length) return [];
    
    // Sum costs by utility type
    const totalsByType: Record<string, number> = {};
    
    yearData.forEach(entry => {
      const type = entry.utilitytype;
      if (!totalsByType[type]) totalsByType[type] = 0;
      totalsByType[type] += parseFloat(entry.amount || '0');
    });
    
    // Convert to array format for the chart
    return Object.entries(totalsByType).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2))
    }));
  };

  // Determine which data set to use based on utility type
  const getUtilityData = () => {
    return utilityData[utilityType as keyof typeof utilityData] || [];
  };

  // Get utility color based on type or theme
  const getUtilityColor = () => {
    switch (utilityType.toLowerCase()) {
      case "electricity":
        return getColor("electricity") || "#3b82f6";
      case "water":
        return getColor("water") || "#0ea5e9";
      case "gas":
        return getColor("gas") || "#ef4444";
      case "internet":
        return getColor("internet") || "#8b5cf6";
      case "hotwater":
        return getColor("hotWater") || "#f97316";
      case "phone":
        return getColor("phone") || "#10b981";
      default:
        return getColor("default") || "#3b82f6";
    }
  };

  const currentUtilityData = getUtilityData();
  const hasCurrentUtilityData = currentUtilityData && currentUtilityData.length > 0;
  const hasBreakdownData = utilityBreakdown && utilityBreakdown.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize and analyze your utility consumption patterns
          </p>
        </div>
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
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex justify-center items-center p-12">
            <p>Loading...</p>
          </CardContent>
        </Card>
      ) : hasReadings && (hasCurrentUtilityData || hasBreakdownData) ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Utility Analysis</CardTitle>
                  <CardDescription>
                    {chartView === "usage" ? "Monthly usage" : "Monthly cost"} for {selectedYear}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={utilityType} onValueChange={setUtilityType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Select utility" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(utilityData).map(type => (
                        utilityData[type as keyof typeof utilityData].length > 0 && (
                          <SelectItem key={type} value={type}>
                            {type === 'hotWater' ? 'HotWater' : type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                  <Tabs value={chartView} onValueChange={setChartView}>
                    <TabsList>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                      <TabsTrigger value="cost">Cost</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasCurrentUtilityData ? (
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentUtilityData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border p-3 rounded-md shadow-lg">
                              <p className="font-medium">{data.month}</p>
                              <p className="text-sm">Reading: {data.reading}</p>
                              <p className="text-sm">{chartView === "usage" ? `Usage: ${data.usage}` : `Cost: $${data.cost}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Legend />
                      <Bar
                        dataKey={chartView === "usage" ? "usage" : "cost"}
                        name={chartView === "usage" ? "Usage" : "Cost"}
                        fill={getUtilityColor()}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] mt-4">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No data available for {utilityType} in {selectedYear}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                Total expenditure by utility for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasBreakdownData ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={utilityBreakdown}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Cost ($)"
                          stroke={getColor("default") || "#10b981"}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-muted-foreground">Total cost by utility:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {utilityBreakdown.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ 
                              backgroundColor: getColor(item.name.toLowerCase()) || 
                                (item.name.toLowerCase() === "electricity" ? "#3b82f6" : 
                                item.name.toLowerCase() === "water" ? "#0ea5e9" : 
                                item.name.toLowerCase() === "gas" ? "#ef4444" : 
                                item.name.toLowerCase() === "hotwater" ? "#f97316" : 
                                item.name.toLowerCase() === "phone" ? "#10b981" : "#8b5cf6")
                            }}
                          ></span>
                          <span className="text-sm">{item.name}: ${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cost data available for {selectedYear}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Analytics Data</CardTitle>
            <CardDescription>
              {hasReadings 
                ? `No data available for ${selectedYear}. Try selecting a different year or add more readings.` 
                : "Add readings to view analytics and insights"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-4">
                {hasReadings 
                  ? `There is no data to analyze for ${selectedYear}. Try selecting a different year or add more readings.` 
                  : "There is no data to analyze. Add readings to start tracking your utility usage and costs."}
              </p>
              <Button 
                onClick={() => navigate("/add-reading")}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Reading</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
