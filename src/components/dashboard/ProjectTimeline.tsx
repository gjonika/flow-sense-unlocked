
import React, { useEffect, useState } from 'react';
import { Project } from '@/lib/supabase';
import { 
  addDays, 
  format, 
  parseISO, 
  differenceInDays, 
  isBefore, 
  isAfter, 
  startOfMonth, 
  endOfMonth 
} from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { projectsToTimelineItems, calculateTimeRange } from '@/lib/timelineUtils';
import TagBadge from '../project/TagBadge';

interface ProjectTimelineProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

// Custom tooltip for the timeline bars
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const project = payload[0].payload;
    return (
      <div className="bg-baltic-fog/90 backdrop-filter backdrop-blur-sm border border-baltic-sand/30 p-3 rounded-lg shadow-lg animate-fade-in">
        <p className="font-medium">{project.name}</p>
        <p className="text-sm text-muted-foreground">Status: 
          <TagBadge tag={project.status} variant="status" />
        </p>
        <p className="text-sm text-muted-foreground">Progress: {project.progress}%</p>
        <p className="text-sm text-muted-foreground mt-1">
          {format(project.startDate, 'MMM d, yyyy')} - {format(project.endDate, 'MMM d, yyyy')}
        </p>
      </div>
    );
  }
  return null;
};

// Simple timeline representation using recharts
const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projects, onSelectProject }) => {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<{start: Date, end: Date}>({
    start: new Date(), 
    end: addDays(new Date(), 90)
  });
  
  useEffect(() => {
    if (projects.length === 0) {
      return;
    }
    
    // Convert projects to timeline items
    const timelineItems = projectsToTimelineItems(projects);
    
    // Calculate optimal time range
    const range = calculateTimeRange(timelineItems);
    setTimeRange(range);
    
    // Create data for the chart
    const chartData = timelineItems.map((item, index) => ({
      index,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      duration: differenceInDays(item.endDate, item.startDate),
      progress: item.progress,
      status: item.status,
      color: item.color,
      project: projects.find(p => p.id === item.id)
    }));
    
    setTimelineData(chartData);
  }, [projects]);
  
  // Handle clicking on a timeline bar
  const handleBarClick = (data: any) => {
    if (data.project) {
      onSelectProject(data.project);
    }
  };
  
  if (projects.length === 0) {
    return <div className="text-center py-8">No projects to display in timeline</div>;
  }

  // Get the current date for the reference line
  const today = new Date();
  
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium text-baltic-deep">
          Project Timeline ({format(timeRange.start, 'MMM d, yyyy')} - {format(timeRange.end, 'MMM d, yyyy')})
        </h3>
      </div>
      
      <div className="mt-2" style={{ height: Math.max(250, projects.length * 40) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={timelineData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            barSize={20}
            className="animate-enter"
          >
            <XAxis 
              type="number" 
              dataKey="duration"
              domain={[
                timeRange.start.getTime(), 
                timeRange.end.getTime()
              ]}
              tickFormatter={(tick) => format(new Date(tick), 'MMM d')}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              x={today.getTime()} 
              stroke="#f87171" 
              label={{ value: 'Today', position: 'top', fill: '#f87171' }}
              strokeWidth={2}
              strokeDasharray="3 3" 
            />
            <Bar 
              dataKey="duration" 
              fill="#8884d8"
              onClick={handleBarClick}
              cursor="pointer"
              animationDuration={1000}
              animationBegin={0}
            >
              {timelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <Card className="p-3 mt-6 text-sm text-center text-baltic-deep bg-baltic-fog/50 backdrop-filter backdrop-blur-sm border border-baltic-sand/30">
        This timeline view shows project durations based on creation date and progress. 
        Click on any bar to view or edit project details.
      </Card>
    </div>
  );
};

export default ProjectTimeline;
