
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/supabase';
import { getChartColor } from '@/utils/chartStyles';
import ChartExportButtons from './ChartExportButtons';
import EmptyChartState from './EmptyChartState';

interface ProjectTypeChartProps {
  projects: Project[];
}

const ProjectTypeChart: React.FC<ProjectTypeChartProps> = ({ projects }) => {
  const typesData = React.useMemo(() => {
    const typeCounts: Record<string, number> = {};
    
    projects.forEach((project) => {
      typeCounts[project.type] = (typeCounts[project.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value], index) => ({
      name,
      value,
      color: getChartColor(index)
    }));
  }, [projects]);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Projects by Type</CardTitle>
        <ChartExportButtons
          chartId="types-chart"
          data={typesData}
          filename="projects-by-type"
        />
      </CardHeader>
      <CardContent className="pt-0">
        <div id="types-chart" className="h-[250px]">
          {typesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  label={(entry) => String(entry.name)}
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTypeChart;
