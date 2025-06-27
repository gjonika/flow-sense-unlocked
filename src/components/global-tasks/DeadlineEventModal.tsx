
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ExternalLink, Calendar, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'milestone';
  projectName: string;
  projectId: string;
  priority?: string;
  status?: string;
  completed?: boolean;
}

interface DeadlineEventModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  getEventTypeBadge: (event: CalendarEvent) => React.ReactNode;
}

const DeadlineEventModal: React.FC<DeadlineEventModalProps> = ({
  event,
  onClose,
  getEventTypeBadge
}) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleGoToProject = () => {
    navigate('/', { state: { expandProjectId: event.projectId } });
    onClose();
  };

  const getStatusDescription = () => {
    if (event.type === 'task') {
      return event.completed ? 'This task has been completed' : 'This task is pending';
    } else {
      return event.status === 'completed' ? 'This milestone has been completed' : 
             event.status === 'in-progress' ? 'This milestone is in progress' : 
             'This milestone is pending';
    }
  };

  const getPriorityDescription = () => {
    if (event.type === 'task' && event.priority) {
      return `Priority: ${event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}`;
    }
    return null;
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.type === 'task' ? (
              <Clock className="h-5 w-5" />
            ) : (
              <Target className="h-5 w-5" />
            )}
            Deadline Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Type Badge */}
          <div className="flex justify-start">
            {getEventTypeBadge(event)}
          </div>

          {/* Event Title */}
          <div>
            <h3 className="font-semibold text-lg leading-tight">
              {event.title}
            </h3>
          </div>

          {/* Project Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span>Project: {event.projectName}</span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Due: {format(event.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          {/* Status */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {getStatusDescription()}
            </p>
            {getPriorityDescription() && (
              <p className="text-sm text-muted-foreground mt-1">
                {getPriorityDescription()}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleGoToProject} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeadlineEventModal;
