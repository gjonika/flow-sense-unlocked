
import React from 'react';
import { differenceInDays, format, parseISO, addDays } from 'date-fns';
import { AlertTriangle, Clock } from 'lucide-react';
import { Milestone } from './ProjectMilestones';
import { Badge } from '@/components/ui/badge';

interface DeadlineWarningProps {
  milestones?: Milestone[];
  compact?: boolean;
}

const DeadlineWarning: React.FC<DeadlineWarningProps> = ({ milestones, compact = false }) => {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  // Get upcoming milestones (not completed)
  const upcomingMilestones = milestones.filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (upcomingMilestones.length === 0) {
    return null;
  }

  // Find the nearest upcoming milestone
  const nearestMilestone = upcomingMilestones[0];
  const daysRemaining = differenceInDays(new Date(nearestMilestone.dueDate), new Date());
  
  // Determine warning level
  let warningLevel = 'normal';
  let warningColor = 'bg-green-100 text-green-800';
  
  if (daysRemaining < 0) {
    warningLevel = 'overdue';
    warningColor = 'bg-red-100 text-red-800';
  } else if (daysRemaining <= 3) {
    warningLevel = 'urgent';
    warningColor = 'bg-red-100 text-red-800';
  } else if (daysRemaining <= 7) {
    warningLevel = 'soon';
    warningColor = 'bg-amber-100 text-amber-800';
  }

  if (compact) {
    return (
      <div className="mt-2">
        {warningLevel !== 'normal' && (
          <Badge variant="outline" className={`${warningColor} text-xs font-medium`}>
            {warningLevel === 'overdue' ? (
              <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
              <Clock className="h-3 w-3 mr-1" />
            )}
            {warningLevel === 'overdue' ? 
              'Overdue' : 
              warningLevel === 'urgent' ? 
                'Due soon' : 
                'Coming up'}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={`mt-2 p-2 rounded-md ${warningColor} flex items-center gap-2`}>
      {warningLevel === 'overdue' ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span className="text-xs">
        {warningLevel === 'overdue' 
          ? `Milestone "${nearestMilestone.title}" is overdue (${Math.abs(daysRemaining)} days past due)`
          : `Milestone "${nearestMilestone.title}" is due in ${daysRemaining} days (${format(new Date(nearestMilestone.dueDate), 'MMM d, yyyy')})`}
      </span>
    </div>
  );
};

export default DeadlineWarning;
