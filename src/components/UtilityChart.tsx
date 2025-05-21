
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  month: string;
  electricity?: number;
  water?: number;
  gas?: number;
  internet?: number;
  hotWater?: number;
  phone?: number;
  renovation?: number;
  interest?: number;
  insurance?: number;
  waste?: number;
  housing?: number;
  loan?: number;
}

interface UtilityChartProps {
  data: ChartData[];
}

// Utility colors mapping
const utilityColors: Record<string, string> = {
  electricity: "#3b82f6",
  water: "#0ea5e9",
  gas: "#ef4444",
  internet: "#8b5cf6",
  hotWater: "#f97316",
  phone: "#10b981",
  renovation: "#6366f1",
  interest: "#ec4899",
  insurance: "#14b8a6",
  waste: "#a855f7",
  housing: "#f59e0b",
  loan: "#84cc16",
};

export function UtilityChart({ data }: UtilityChartProps) {
  // Ensure we have at least 3 data points for a meaningful chart
  const paddedData = data.length < 3 ? [...Array(3 - data.length).fill({}).map((_, i) => ({
    month: `Prev ${i + 1}`,
  })), ...data] : data;
  
  // Get active utility types from the data
  const getActiveUtilityTypes = () => {
    const types = new Set<string>();
    
    data.forEach(month => {
      Object.keys(month).forEach(key => {
        if (key !== "month" && month[key] !== null && month[key] !== undefined) {
          types.add(key);
        }
      });
    });
    
    return Array.from(types);
  };
  
  const activeUtilityTypes = getActiveUtilityTypes();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={paddedData}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          
          {activeUtilityTypes.map((type, index) => (
            <Area
              key={type}
              type="monotone"
              dataKey={type}
              name={type.charAt(0).toUpperCase() + type.slice(1)}
              stackId={`${index + 1}`}
              stroke={utilityColors[type] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
              fill={utilityColors[type] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
