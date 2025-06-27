
import React, { useState } from 'react';
import { Project } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import ProjectRadarComparison from './ProjectRadarComparison';
import ProjectCohortPieChart from './ProjectCohortPieChart';

interface VisualCompareProps {
  projects: Project[];
}

const VisualCompare: React.FC<VisualCompareProps> = ({ projects = [] }) => {
  // Ensure projects is always an array and filter out any undefined values
  const safeProjects = Array.isArray(projects) ? projects.filter(Boolean) : [];
  
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  
  const handleToggleProject = (projectId: string, isSelected: boolean) => {
    if (isSelected) {
      // Add project to selection (max 5)
      if (selectedProjectIds.length < 5) {
        setSelectedProjectIds([...selectedProjectIds, projectId]);
      }
    } else {
      // Remove project from selection
      setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProjectRadarComparison 
        projects={safeProjects} 
        selectedProjectIds={selectedProjectIds} 
        onSelectProject={handleToggleProject} 
      />
      
      <ProjectCohortPieChart projects={safeProjects} />
    </div>
  );
};

export default VisualCompare;
