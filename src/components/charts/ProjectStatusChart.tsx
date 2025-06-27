
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, ProjectStatus } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBalticColor } from '@/lib/utils';
import EmptyChartState from './EmptyChartState';
import ChartExportButtons from './ChartExportButtons';

interface ProjectStatusChartProps {
  projects: Project[];
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ projects }) => {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    if (!projects || projects.length === 0) {
      return [];
    }
    
    projects.forEach(project => {
      if (project.status) {
        counts[project.status] = (counts[project.status] || 0) + 1;
      }
    });
    
    // Sort by status progression
    const statusOrder: ProjectStatus[] = [
      'Idea', 'Planning', 'In Progress', 'Build', 'Launch', 'Completed', 'Abandoned'
    ];
    
    return statusOrder
      .filter(status => counts[status] > 0)
      .map(status => ({
        name: status,
        count: counts[status]
      }));
  }, [projects]);
  
  // Convert data for export
  const exportData = useMemo(() => {
    return statusCounts.map(({ name, count }) => ({ Status: name, Count: count }));
  }, [statusCounts]);

  if (!projects || projects.length === 0) {
    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Project Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <EmptyChartState message="No projects available" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Project Status</CardTitle>
        <ChartExportButtons 
          chartId="status-chart"
          data={exportData}
          filename="project-status"
        />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[250px]" id="status-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusCounts}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill={getBalticColor(0)} name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;
