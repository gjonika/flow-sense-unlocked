
import React from 'react';
import { Project } from '@/lib/supabase';
import VisualCompare from '../advanced-analytics/VisualCompare';

interface AnalyticsVisualCompareTabProps {
  projects: Project[];
}

const AnalyticsVisualCompareTab: React.FC<AnalyticsVisualCompareTabProps> = ({ projects = [] }) => {
  // Ensure projects is always an array and filter out any undefined values
  const safeProjects = Array.isArray(projects) ? projects.filter(Boolean) : [];
  
  return (
    <div className="space-y-6">
      <VisualCompare projects={safeProjects} />
    </div>
  );
};

export default AnalyticsVisualCompareTab;
