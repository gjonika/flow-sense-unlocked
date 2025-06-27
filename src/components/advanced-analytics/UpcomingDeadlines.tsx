
import React from 'react';
import { Project } from '@/lib/supabase';
import { format, isBefore, differenceInDays } from 'date-fns';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Milestone } from '@/components/project/ProjectMilestones';
import ChartExportButtons from '../charts/ChartExportButtons';

interface UpcomingDeadlinesProps {
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

interface MilestoneWithProjectInfo extends Milestone {
  projectId: string;
  projectName: string;
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ projects = [], onSelectProject }) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  // Extract milestones from all projects and add project context
  const allMilestones = safeProjects.flatMap(project => {
    if (!project.milestones || !Array.isArray(project.milestones)) {
      return [];
    }
    
    return project.milestones.map(milestone => ({
      ...milestone,
      projectId: project.id,
      projectName: project.name
    }));
  });
  
  // Filter to only show non-completed milestones
  const upcomingMilestones = allMilestones.filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const getTimelineProgress = (milestone: MilestoneWithProjectInfo) => {
    const today = new Date();
    const dueDate = new Date(milestone.dueDate);
    const daysRemaining = differenceInDays(dueDate, today);
    
    if (milestone.status === 'completed') return 100;
    if (isBefore(dueDate, today)) return 0; // Overdue
    
    // Assume 30 days is the typical milestone duration
    const totalDays = 30;
    const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));
    return progress;
  };
  
  const getStatusBadge = (milestone: MilestoneWithProjectInfo) => {
    const today = new Date();
    const dueDate = new Date(milestone.dueDate);
    const daysRemaining = differenceInDays(dueDate, today);
    
    if (milestone.status === 'completed') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (isBefore(dueDate, today)) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue ({Math.abs(daysRemaining)}d)
        </Badge>
      );
    } else if (daysRemaining <= 3) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
          <Clock className="h-3 w-3 mr-1" />
          Due in {daysRemaining}d
        </Badge>
      );
    } else if (daysRemaining <= 7) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          <Clock className="h-3 w-3 mr-1" />
          Due in {daysRemaining}d
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
        <Clock className="h-3 w-3 mr-1" />
        Due in {daysRemaining}d
      </Badge>
    );
  };
  
  const handleClick = (milestone: MilestoneWithProjectInfo) => {
    if (onSelectProject) {
      onSelectProject(milestone.projectId);
    }
  };

  const exportData = upcomingMilestones.map(m => ({
    title: m.title,
    project: m.projectName,
    dueDate: format(new Date(m.dueDate), 'yyyy-MM-dd'),
    status: m.status,
    daysRemaining: differenceInDays(new Date(m.dueDate), new Date())
  }));

  if (upcomingMilestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-6">
          No upcoming deadlines found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          <ChartExportButtons
            chartId="deadlines-list"
            data={exportData}
            filename="upcoming-deadlines"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="deadlines-list">
          {upcomingMilestones.slice(0, 8).map((milestone, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors gap-3"
              onClick={() => handleClick(milestone)}
            >
              <div className="space-y-2 flex-1">
                <div className="font-medium">{milestone.title}</div>
                <div className="text-xs text-muted-foreground">
                  Project: {milestone.projectName} • Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                </div>
                <div className="w-full max-w-xs">
                  <Progress 
                    value={getTimelineProgress(milestone)} 
                    className="h-2"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(milestone)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
