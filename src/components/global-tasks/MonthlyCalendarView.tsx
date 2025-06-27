
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertCircle, Clock, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay } from 'date-fns';

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

interface MonthlyCalendarViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  events,
  currentMonth,
  onMonthChange,
  onDateSelect,
  selectedDate
}) => {
  // Get all days in the current month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  // Check if date has collisions (multiple events)
  const hasCollisions = (date: Date) => {
    return getEventsForDate(date).length > 1;
  };

  // Get task density color
  const getTaskDensityColor = (eventCount: number) => {
    if (eventCount === 0) return '';
    if (eventCount === 1) return 'bg-blue-100 text-blue-800';
    if (eventCount === 2) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  // Check if date has overdue tasks
  const hasOverdueTasks = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    return isBefore(date, startOfDay(new Date())) && 
           dayEvents.some(event => !event.completed && event.status !== 'completed');
  };

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Month days */}
          {monthDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const eventCount = dayEvents.length;
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const hasCollision = hasCollisions(day);
            const isOverdue = hasOverdueTasks(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  relative p-2 min-h-[60px] border rounded-lg cursor-pointer transition-colors
                  ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}
                  ${isCurrentDay ? 'bg-primary/10 border-primary' : 'border-border'}
                  ${getTaskDensityColor(eventCount)}
                `}
                onClick={() => onDateSelect(day)}
              >
                {/* Date number */}
                <div className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                {/* Event indicators */}
                {eventCount > 0 && (
                  <div className="mt-1 space-y-1">
                    {/* Task/Milestone indicators */}
                    <div className="flex flex-wrap gap-1">
                      {dayEvents.slice(0, 2).map((event, index) => (
                        <div
                          key={event.id}
                          className={`w-2 h-2 rounded-full ${
                            event.type === 'task' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          title={`${event.type}: ${event.title}`}
                        />
                      ))}
                      {eventCount > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{eventCount - 2}
                        </div>
                      )}
                    </div>
                    
                    {/* Collision warning */}
                    {hasCollision && (
                      <AlertCircle className="h-3 w-3 text-amber-500 absolute top-1 right-1" />
                    )}
                    
                    {/* Overdue warning */}
                    {isOverdue && (
                      <AlertCircle className="h-3 w-3 text-red-500 absolute bottom-1 right-1" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Task</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Milestone</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            <span>Multiple deadlines</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span>Overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendarView;
