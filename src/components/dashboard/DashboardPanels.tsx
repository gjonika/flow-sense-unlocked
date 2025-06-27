
import React from 'react';
import ProjectAnalytics from '@/components/ProjectAnalytics';
import AISupport from '@/components/ai-support/AISupport';
import AIPriorities from '@/components/AIPriorities';
import { Project } from '@/lib/supabase';

interface DashboardPanelsProps {
  showAnalytics: boolean;
  showAISupport: boolean;
  showPriorities: boolean;
  activeProjects: Project[];
  onSelectProject: (projectId: string) => void;
}

const DashboardPanels: React.FC<DashboardPanelsProps> = ({
  showAnalytics,
  showAISupport,
  showPriorities,
  activeProjects,
  onSelectProject,
}) => {
  // Get all projects (including completed) for analytics, but pass all projects to AI Support
  // AI Support will filter out abandoned projects internally
  return (
    <>
      {showAnalytics && (
        <div className="mb-6 overflow-hidden">
          <ProjectAnalytics projects={activeProjects} />
        </div>
      )}
      
      {showAISupport && (
        <div className="mb-6">
          <AISupport projects={activeProjects} onSelectProject={onSelectProject} />
        </div>
      )}

      {showPriorities && (
        <div className="mb-6">
          <AIPriorities projects={activeProjects} onSelectProject={onSelectProject} />
        </div>
      )}
    </>
  );
};

export default DashboardPanels;
