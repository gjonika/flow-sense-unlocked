
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Target } from 'lucide-react';
import { useProjects } from '@/contexts/ProjectContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { TaskWithProject } from '@/hooks/useTaskManagement';
import DeadlineEventModal from './DeadlineEventModal';
import CalendarEventsList from './CalendarEventsList';

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

const DeadlinesCalendarTab: React.FC = () => {
  const { projects } = useProjects();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Convert tasks and milestones to calendar events
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    projects.forEach(project => {
      // Add task deadlines
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.dueDate) {
            events.push({
              id: `task-${task.id}`,
              title: task.title,
              date: parseISO(task.dueDate),
              type: 'task',
              projectName: project.name,
              projectId: project.id,
              priority: task.priority,
              completed: task.completed
            });
          }
        });
      }

      // Add milestone deadlines
      if (project.milestones) {
        project.milestones.forEach((milestone, index) => {
          events.push({
            id: `milestone-${project.id}-${index}`,
            title: milestone.title,
            date: parseISO(milestone.dueDate),
            type: 'milestone',
            projectName: project.name,
            projectId: project.id,
            status: milestone.status
          });
        });
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [projects]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return calendarEvents.filter(event => 
      isSameDay(event.date, selectedDate)
    );
  }, [calendarEvents, selectedDate]);

  // Get dates that have events for calendar highlighting
  const eventDates = useMemo(() => {
    return calendarEvents.map(event => event.date);
  }, [calendarEvents]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const getEventTypeIcon = (type: string) => {
    return type === 'task' ? Clock : Target;
  };

  const getEventTypeBadge = (event: CalendarEvent) => {
    if (event.type === 'task') {
      const variant = event.completed ? 'secondary' : 
                    event.priority === 'high' ? 'destructive' : 
                    event.priority === 'medium' ? 'default' : 'outline';
      return (
        <Badge variant={variant} className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Task
        </Badge>
      );
    } else {
      const variant = event.status === 'completed' ? 'secondary' : 
                    event.status === 'in-progress' ? 'default' : 'outline';
      return (
        <Badge variant={variant} className="text-xs">
          <Target className="h-3 w-3 mr-1" />
          Milestone
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Deadlines Calendar
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View task deadlines and milestone due dates across all projects
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                modifiers={{
                  eventDay: eventDates
                }}
                modifiersStyles={{
                  eventDay: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderRadius: '50%'
                  }
                }}
              />
            </div>

            {/* Events for selected date */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'deadline' : 'deadlines'}
                </p>
              </div>

              <CalendarEventsList
                events={selectedDateEvents}
                onEventClick={handleEventClick}
                getEventTypeIcon={getEventTypeIcon}
                getEventTypeBadge={getEventTypeBadge}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <DeadlineEventModal
        event={selectedEvent}
        onClose={handleCloseModal}
        getEventTypeBadge={getEventTypeBadge}
      />
    </div>
  );
};

export default DeadlinesCalendarTab;
