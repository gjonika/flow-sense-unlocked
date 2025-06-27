
import React from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import UpcomingDeadlines from '@/components/advanced-analytics/UpcomingDeadlines';

const DeadlinesListTab: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  const handleSelectProject = (projectId: string) => {
    navigate('/', { state: { expandProjectId: projectId } });
  };

  return (
    <div className="space-y-6">
      <UpcomingDeadlines projects={projects} onSelectProject={handleSelectProject} />
    </div>
  );
};

export default DeadlinesListTab;
