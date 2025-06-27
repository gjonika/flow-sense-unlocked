
import React from 'react';
import AISupport from './ai-support/AISupport';
import { Project } from '@/lib/supabase';

interface AISupportContainerProps {
  projects: Project[];
}

const AISupportContainer: React.FC<AISupportContainerProps> = ({ projects }) => {
  const handleSelectProject = (projectId: string) => {
    // Find the project element in the DOM and scroll to it
    const projectElement = document.getElementById(`project-${projectId}`);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: 'smooth' });
      // Add a temporary highlight effect
      projectElement.classList.add('highlight-project');
      setTimeout(() => {
        projectElement.classList.remove('highlight-project');
      }, 2000);
    }
  };

  return <AISupport projects={projects} onSelectProject={handleSelectProject} />;
};

export default AISupportContainer;
