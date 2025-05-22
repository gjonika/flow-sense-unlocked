
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Project } from '@/lib/supabase';

interface ProjectAnalyticsProps {
  projects: Project[];
}

const COLORS = ['#588157', '#A3B18A', '#DAD7CD', '#3A5A40'];

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ projects }) => {
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    
    projects.forEach((project) => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);
  
  const typesData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    
    projects.forEach((project) => {
      typeCounts[project.type] = (typeCounts[project.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);
  
  const completionRate = useMemo(() => {
    if (projects.length === 0) return 0;
    const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(totalProgress / projects.length);
  }, [projects]);
  
  const monetizedCount = useMemo(() => {
    return projects.filter((project) => project.isMonetized).length;
  }, [projects]);

  const customLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Projects by Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 h-[250px]">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={customLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Projects by Type</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 h-[250px]">
          {typesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={customLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Completion</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center h-24">
            <div className="text-4xl font-bold text-olive">{completionRate}%</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monetized Projects</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-center h-24">
            <div className="text-4xl font-bold text-amber-500">{monetizedCount} / {projects.length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectAnalytics;
