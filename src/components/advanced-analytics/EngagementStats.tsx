
import React, { useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Project } from '@/lib/supabase';

interface EngagementStatsProps {
  projects: Project[];
}

const EngagementStats: React.FC<EngagementStatsProps> = ({ projects }) => {
  const { mostUpdated, leastUpdated } = useMemo(() => {
    if (!projects || projects.length === 0) {
      return { mostUpdated: [], leastUpdated: [] };
    }

    // Sort by last updated timestamp (most recent first)
    const sortedByUpdated = [...projects].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );

    return {
      mostUpdated: sortedByUpdated.slice(0, 3), // Top 3 most recently updated
      leastUpdated: sortedByUpdated.slice(-3).reverse(), // Bottom 3 least recently updated
    };
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-4">
        No project data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm mb-2">Most Recently Updated</h4>
        <div className="space-y-2">
          {mostUpdated.map((project) => (
            <div key={project.id} className="bg-muted/40 p-2 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                </span>
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                Progress: {project.progress}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm mb-2">Least Recently Updated</h4>
        <div className="space-y-2">
          {leastUpdated.map((project) => (
            <div key={project.id} className="bg-muted/40 p-2 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                </span>
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                Last update: {format(new Date(project.lastUpdated), 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementStats;
