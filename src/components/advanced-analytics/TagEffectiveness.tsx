
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Project } from '@/lib/supabase';
import EmptyChartState from '../charts/EmptyChartState';
import { chartColors, getChartColor } from '@/utils/chartStyles';

interface TagEffectivenessProps {
  projects: Project[];
}

const TagEffectiveness: React.FC<TagEffectivenessProps> = ({ projects }) => {
  const data = useMemo(() => {
    // Extract all unique tags
    const allTags = new Set<string>();
    projects.forEach(project => {
      project.tags?.forEach(tag => allTags.add(tag));
    });
    
    // Calculate average progress for each tag
    const tagData: Record<string, { count: number, totalProgress: number }> = {};
    
    allTags.forEach(tag => {
      tagData[tag] = { count: 0, totalProgress: 0 };
    });
    
    projects.forEach(project => {
      project.tags?.forEach(tag => {
        tagData[tag].count += 1;
        tagData[tag].totalProgress += project.progress;
      });
    });
    
    // Convert to array format for the chart
    return Object.entries(tagData)
      .map(([tag, data]) => ({
        tag,
        avgProgress: data.count > 0 ? Math.round(data.totalProgress / data.count) : 0,
        count: data.count,
        // Color based on performance
        color: data.count > 0 ? 
          (data.totalProgress / data.count) >= 75 ? chartColors.success :
          (data.totalProgress / data.count) >= 50 ? chartColors.warning :
          chartColors.error : chartColors.muted
      }))
      .sort((a, b) => b.avgProgress - a.avgProgress)
      .slice(0, 10); // Take top 10 tags by average progress
  }, [projects]);

  if (data.length === 0) {
    return <EmptyChartState message="No tag data available" />;
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="tag" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}
            height={80}
            label={{ value: 'Tags', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            label={{ value: 'Avg Progress %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [
              `${value}% (${props.payload.count} projects)`, 
              'Avg. Progress'
            ]} 
            labelFormatter={(tag) => `Tag: ${tag}`}
          />
          <Bar dataKey="avgProgress" name="Avg. Progress" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TagEffectiveness;
