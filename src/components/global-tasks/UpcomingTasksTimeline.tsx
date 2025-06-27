
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, Target, Calendar } from 'lucide-react';
import { format, addDays, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

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

interface UpcomingTasksTimelineProps {
  events: CalendarEvent[];
  timelineDays?: number;
}

const UpcomingTasksTimeline: React.FC<UpcomingTasksTimelineProps> = ({
  events,
  timelineDays = 30
}) => {
  // Filter and organize upcoming events
  const upcomingAnalysis = useMemo(() => {
    const today = startOfDay(new Date());
    const futureDate = addDays(today, timelineDays);
    
    // Get upcoming events (not completed, within timeline)
    const upcomingEvents = events.filter(event => {
      const isUpcoming = isAfter(event.date, today) && isBefore(event.date, futureDate);
      const isNotCompleted = !event.completed && event.status !== 'completed';
      return isUpcoming && isNotCompleted;
    });

    // Group by week
    const weeklyDistribution: Record<string, CalendarEvent[]> = {};
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    upcomingEvents.forEach(event => {
      const daysFromNow = differenceInDays(event.date, today);
      const weekIndex = Math.floor(daysFromNow / 7);
      const weekKey = weeks[Math.min(weekIndex, 3)] || 'Week 4+';
      
      if (!weeklyDistribution[weekKey]) {
        weeklyDistribution[weekKey] = [];
      }
      weeklyDistribution[weekKey].push(event);
    });

    // Find collision dates (multiple events same day)
    const collisions: { date: Date; events: CalendarEvent[] }[] = [];
    const eventsByDate: Record<string, CalendarEvent[]> = {};
    
    upcomingEvents.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });

    Object.entries(eventsByDate).forEach(([dateKey, dayEvents]) => {
      if (dayEvents.length > 1) {
        collisions.push({
          date: new Date(dateKey),
          events: dayEvents
        });
      }
    });

    // Priority distribution
    const priorityStats = {
      high: upcomingEvents.filter(e => e.priority === 'high').length,
      medium: upcomingEvents.filter(e => e.priority === 'medium').length,
      low: upcomingEvents.filter(e => e.priority === 'low').length,
    };

    return {
      upcomingEvents,
      weeklyDistribution,
      collisions,
      priorityStats,
      total: upcomingEvents.length
    };
  }, [events, timelineDays]);

  const maxWeeklyCount = Math.max(
    ...Object.values(upcomingAnalysis.weeklyDistribution).map(events => events.length),
    1
  );

  return (
    <div className="space-y-4">
      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Next {timelineDays} Days Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {upcomingAnalysis.total} upcoming deadlines
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weekly Distribution */}
          <div>
            <h4 className="text-sm font-medium mb-3">Weekly Distribution</h4>
            <div className="space-y-2">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => {
                const weekEvents = upcomingAnalysis.weeklyDistribution[week] || [];
                const percentage = (weekEvents.length / maxWeeklyCount) * 100;
                
                return (
                  <div key={week} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{week}</span>
                      <span className="text-muted-foreground">
                        {weekEvents.length} {weekEvents.length === 1 ? 'deadline' : 'deadlines'}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-3">Priority Breakdown</h4>
            <div className="flex gap-2 flex-wrap">
              {upcomingAnalysis.priorityStats.high > 0 && (
                <Badge variant="destructive" className="text-xs">
                  High: {upcomingAnalysis.priorityStats.high}
                </Badge>
              )}
              {upcomingAnalysis.priorityStats.medium > 0 && (
                <Badge variant="default" className="text-xs">
                  Medium: {upcomingAnalysis.priorityStats.medium}
                </Badge>
              )}
              {upcomingAnalysis.priorityStats.low > 0 && (
                <Badge variant="outline" className="text-xs">
                  Low: {upcomingAnalysis.priorityStats.low}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collision Warnings */}
      {upcomingAnalysis.collisions.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <AlertCircle className="h-5 w-5" />
              Deadline Collisions
            </CardTitle>
            <p className="text-sm text-amber-700">
              Multiple deadlines on the same day
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAnalysis.collisions.map((collision, index) => (
                <div key={index} className="p-3 bg-amber-50 rounded-lg">
                  <div className="font-medium text-sm text-amber-800 mb-2">
                    {format(collision.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="space-y-1">
                    {collision.events.map(event => (
                      <div key={event.id} className="flex items-center gap-2 text-sm">
                        {event.type === 'task' ? (
                          <Clock className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Target className="h-3 w-3 text-purple-500" />
                        )}
                        <span className="font-medium">{event.title}</span>
                        <span className="text-muted-foreground">({event.projectName})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpcomingTasksTimeline;
