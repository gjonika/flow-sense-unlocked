
import React from 'react';
import { Project } from '@/lib/supabase';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine 
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import EmptyChartState from '../charts/EmptyChartState';
import { chartColors, getChartColor } from '@/utils/chartStyles';

interface EnhancedProgressChartProps {
  projects: Project[];
}

const EnhancedProgressChart: React.FC<EnhancedProgressChartProps> = ({ projects = [] }) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  // Generate data for the chart (since we don't have historical data)
  const generateProgressData = () => {
    // Filter out completed projects and take top 5 by progress
    const topProjects = [...safeProjects]
      .filter(p => p.status !== 'Completed')
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
    
    // Generate data points for each project
    const today = new Date();
    const data = [];
    
    // Create data points for the last 30 days (simulated progress)
    for (let i = 30; i >= 0; i--) {
      const date = subDays(today, i);
      const dataPoint: any = {
        date: format(date, 'MMM dd'),
        fullDate: date,
      };
      
      topProjects.forEach(project => {
        // Simulate historical progress - gradually increasing
        // More recent projects have steeper growth curves
        const daysFromCreation = Math.max(0, 
          Math.floor((date.getTime() - parseISO(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        );
        
        // Calculate simulated progress
        const progressRate = project.progress / 90; // Assume max 90 days to reach current progress
        const historicalProgress = Math.min(
          project.progress,
          Math.floor(Math.max(0, progressRate * daysFromCreation))
        );
        
        dataPoint[project.name] = historicalProgress;
      });
      
      data.push(dataPoint);
    }
    
    return { data, projects: topProjects };
  };

  const { data, projects: chartProjects } = generateProgressData();

  // No data case
  if (data.length === 0 || chartProjects.length === 0) {
    return <EmptyChartState message="No active projects to display progress" />;
  }

  const chartConfig = chartProjects.reduce((acc, project, idx) => ({
    ...acc,
    [project.name]: {
      label: project.name,
      theme: {
        light: getChartColor(idx),
        dark: getChartColor(idx),
      },
    }
  }), {});

  return (
    <ChartContainer config={chartConfig} className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {chartProjects.map((project, idx) => (
              <linearGradient key={project.id} id={`gradient-${project.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getChartColor(idx)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getChartColor(idx)} stopOpacity={0.2}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={5}
            minTickGap={5}
          />
          <YAxis 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12 }}
            label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <ReferenceLine 
            y={75} 
            stroke={chartColors.success} 
            strokeDasharray="5 5" 
            label={{ 
              value: 'Launch Ready', 
              position: 'insideBottomLeft', 
              fill: chartColors.success, 
              fontSize: 12 
            }} 
          />
          
          {chartProjects.map((project, idx) => (
            <Area 
              key={project.id}
              type="monotone"
              dataKey={project.name}
              stroke={getChartColor(idx)}
              fillOpacity={1}
              fill={`url(#gradient-${project.id})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EnhancedProgressChart;
