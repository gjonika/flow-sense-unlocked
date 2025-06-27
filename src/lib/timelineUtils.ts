
import { Project } from '@/lib/supabase';
import { addDays, differenceInDays, parseISO } from 'date-fns';

export type TimelineItem = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: string;
  color: string;
};

/**
 * Converts projects to timeline items for visualization
 */
export function projectsToTimelineItems(projects: Project[]): TimelineItem[] {
  return projects.map(project => {
    // Use creation date as start date
    const startDate = parseISO(project.createdAt);
    
    // Calculate duration based on progress
    // Lower progress = longer estimated time
    let durationDays = 90;
    if (project.progress >= 75) {
      durationDays = 30;
    } else if (project.progress >= 50) {
      durationDays = 45;
    } else if (project.progress >= 25) {
      durationDays = 60;
    }
    
    // If completed, use last updated as end date
    const endDate = project.status === 'Completed' 
      ? parseISO(project.lastUpdated)
      : addDays(startDate, durationDays);
    
    return {
      id: project.id,
      name: project.name,
      startDate,
      endDate,
      progress: project.progress,
      status: project.status,
      color: getProjectStatusColor(project.status)
    };
  });
}

/**
 * Returns a color based on project status
 */
export function getProjectStatusColor(status: string): string {
  switch (status) {
    case 'Completed': return '#4ade80'; // green-400
    case 'In Progress': return '#60a5fa'; // blue-400
    case 'Planning': return '#fbbf24'; // amber-400
    case 'Build': return '#a78bfa'; // violet-400
    case 'Launch': return '#f87171'; // red-400
    case 'Idea': return '#c084fc'; // purple-400
    case 'Abandoned': return '#9ca3af'; // gray-400
    default: return '#6b7280'; // gray-500
  }
}

/**
 * Calculate the optimal view range for a set of timeline items
 */
export function calculateTimeRange(items: TimelineItem[]): {start: Date, end: Date} {
  if (items.length === 0) {
    // Default range is today + 3 months
    return {
      start: new Date(),
      end: addDays(new Date(), 90)
    };
  }
  
  // Find earliest start date and latest end date
  const startDates = items.map(item => item.startDate);
  const endDates = items.map(item => item.endDate);
  
  const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
  const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));
  
  // Add padding to the range (10% on each side)
  const rangeDays = differenceInDays(latestEnd, earliestStart);
  const paddingDays = Math.max(Math.floor(rangeDays * 0.1), 7); // At least 7 days padding
  
  return {
    start: addDays(earliestStart, -paddingDays),
    end: addDays(latestEnd, paddingDays)
  };
}
