
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '@/lib/supabase';
import EmptyChartState from '../charts/EmptyChartState';
import { chartColors } from '@/utils/chartStyles';

interface ProgressDistributionProps {
  projects: Project[];
}

const ProgressDistribution: React.FC<ProgressDistributionProps> = ({ projects = [] }) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  const data = useMemo(() => {
    // Initialize distribution buckets
    const distribution = [
      { name: '0-25%', count: 0, color: chartColors.error },
      { name: '25-50%', count: 0, color: chartColors.warning },
      { name: '50-75%', count: 0, color: chartColors.secondary },
      { name: '75-100%', count: 0, color: chartColors.success }
    ];
    
    // Count projects in each progress range
    safeProjects.forEach(project => {
      if (project.progress < 25) {
        distribution[0].count++;
      } else if (project.progress < 50) {
        distribution[1].count++;
      } else if (project.progress < 75) {
        distribution[2].count++;
      } else {
        distribution[3].count++;
      }
    });
    
    return distribution;
  }, [safeProjects]);

  if (safeProjects.length === 0) {
    return <EmptyChartState />;
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            label={{ value: 'Progress Range', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Projects', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => [`${value} projects`, 'Count']}
            labelFormatter={(range) => `Progress Range: ${range}`}
          />
          <Bar 
            dataKey="count" 
            name="Projects" 
            radius={[4, 4, 0, 0]}
            barSize={60}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressDistribution;
