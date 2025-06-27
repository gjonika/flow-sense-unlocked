
import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Project } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getBalticColor } from '@/lib/utils';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface ProjectCohortPieChartProps {
  projects: Project[];
}

type InnerRingType = 'monetized' | 'usefulness';
type OuterRingType = 'status' | 'type';

const ProjectCohortPieChart: React.FC<ProjectCohortPieChartProps> = ({ projects = [] }) => {
  const [innerRingType, setInnerRingType] = useState<InnerRingType>('monetized');
  const [outerRingType, setOuterRingType] = useState<OuterRingType>('status');
  
  // Generate data for outer ring (status or type)
  const outerRingData = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    const groupByField = outerRingType === 'status' ? 'status' : 'type';
    const groupedData: Record<string, Project[]> = {};
    
    projects.forEach(project => {
      const key = project[groupByField as keyof Project] as string || 'Unknown';
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(project);
    });
    
    return Object.entries(groupedData).map(([name, items], index) => ({
      name,
      value: items.length,
      items,
      color: getBalticColor(index),
      itemCount: items.length,
    }));
  }, [projects, outerRingType]);
  
  // Generate data for inner ring (monetized or usefulness)
  const innerRingData = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    if (innerRingType === 'monetized') {
      const monetizedCount = projects.filter(p => p.isMonetized).length;
      const freeCount = projects.length - monetizedCount;
      
      return [
        { name: 'Monetized', value: monetizedCount, color: '#4B6C64' },
        { name: 'Free', value: freeCount, color: '#DAD8C4' }
      ].filter(item => item.value > 0); // Don't show segments with zero value
    } else {
      // Group by usefulness (1-5)
      const usefulnessGroups: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      projects.forEach(project => {
        usefulnessGroups[project.usefulness] = (usefulnessGroups[project.usefulness] || 0) + 1;
      });
      
      return Object.entries(usefulnessGroups).map(([rating, count]) => ({
        name: `${rating} Star${parseInt(rating) > 1 ? 's' : ''}`,
        value: count,
        color: getBalticColor(parseInt(rating) - 1)
      })).filter(item => item.value > 0);
    }
  }, [projects, innerRingType]);

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {data.value} projects ({((data.value / (projects?.length || 1)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Check if we have data to show
  const hasOuterData = outerRingData && outerRingData.length > 0;
  const hasInnerData = innerRingData && innerRingData.length > 0;
  
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Project Cohorts</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium block mb-1">Outer Ring</label>
            <Select 
              value={outerRingType} 
              onValueChange={(value) => setOuterRingType(value as OuterRingType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="text-sm font-medium block mb-1">Inner Ring</label>
            <Select 
              value={innerRingType} 
              onValueChange={(value) => setInnerRingType(value as InnerRingType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monetized">Monetized vs Free</SelectItem>
                <SelectItem value="usefulness">Usefulness Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {hasOuterData && hasInnerData ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Outer ring - Status/Type */}
                <Pie
                  data={outerRingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={80}
                  paddingAngle={1}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {outerRingData.map((entry, index) => (
                    <Cell 
                      key={`outer-cell-${index}`} 
                      fill={entry.color} 
                    />
                  ))}
                </Pie>
                
                {/* Inner ring - Monetized/Usefulness */}
                <Pie
                  data={innerRingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={30}
                  paddingAngle={2}
                >
                  {innerRingData.map((entry, index) => (
                    <Cell 
                      key={`inner-cell-${index}`} 
                      fill={entry.color} 
                    />
                  ))}
                </Pie>
                
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Not enough project data to generate chart
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCohortPieChart;
