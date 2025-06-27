
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { LucideIcon } from 'lucide-react';

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

interface CalendarEventsListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventTypeIcon: (type: string) => LucideIcon;
  getEventTypeBadge: (event: CalendarEvent) => React.ReactNode;
}

const CalendarEventsList: React.FC<CalendarEventsListProps> = ({
  events,
  onEventClick,
  getEventTypeIcon,
  getEventTypeBadge
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">No deadlines on this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const Icon = getEventTypeIcon(event.type);
        
        return (
          <div
            key={event.id}
            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onEventClick(event)}
          >
            <div className="flex items-start gap-3">
              <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getEventTypeBadge(event)}
                </div>
                <h4 className="font-medium text-sm leading-tight mb-1">
                  {event.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {event.projectName}
                </p>
                {event.type === 'task' && event.completed && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Completed
                  </Badge>
                )}
                {event.type === 'milestone' && event.status === 'completed' && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarEventsList;
