
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import DeadlineWarning from './DeadlineWarning';

export interface Milestone {
  title: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface ProjectMilestonesProps {
  milestones: Milestone[];
  compact?: boolean;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-amber-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ milestones, compact = false }) => {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  // Sort milestones by status (pending/in-progress first, then completed)
  // and by due date (earliest first)
  const sortedMilestones = [...milestones].sort((a, b) => {
    // Prioritize non-completed milestones
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    
    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const upcomingMilestone = sortedMilestones.find(m => m.status !== 'completed');
  
  if (compact && upcomingMilestone) {
    return (
      <div className="space-y-1">
        <div className="mt-2 flex items-center gap-2 text-xs">
          <StatusIcon status={upcomingMilestone.status} />
          <span className="font-medium">
            {upcomingMilestone.title} (Due {format(new Date(upcomingMilestone.dueDate), 'MMM d')})
          </span>
          {milestones.length > 1 && (
            <span className="text-muted-foreground ml-1">
              +{milestones.length - 1} more
            </span>
          )}
        </div>
        <DeadlineWarning milestones={milestones} compact={true} />
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium">Milestones</h4>
      <div className="space-y-1.5">
        {sortedMilestones.map((milestone, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <StatusIcon status={milestone.status} />
            <span className={milestone.status === 'completed' ? 'text-muted-foreground line-through' : ''}>
              {milestone.title} - Due {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        ))}
      </div>
      <DeadlineWarning milestones={milestones} />
    </div>
  );
};

export default ProjectMilestones;
