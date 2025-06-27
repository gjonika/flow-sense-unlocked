
import React from 'react';
import { Project } from '@/lib/supabase';
import UpcomingDeadlines from '../advanced-analytics/UpcomingDeadlines';

interface AnalyticsDeadlinesTabProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const AnalyticsDeadlinesTab: React.FC<AnalyticsDeadlinesTabProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="space-y-6">
      <UpcomingDeadlines projects={projects} onSelectProject={onSelectProject} />
    </div>
  );
};

export default AnalyticsDeadlinesTab;
