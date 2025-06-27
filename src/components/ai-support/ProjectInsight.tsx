
import React from 'react';
import { Project } from '@/lib/supabase';

export interface AIInsight {
  summary: string;
  suggestion: string;
  motivation: string;
}

export interface ProjectInsight extends AIInsight {
  projectId: string;
  projectName: string;
}

interface ProjectInsightProps {
  insight: ProjectInsight;
  projects: Project[];
  onSelectProject?: (projectId: string) => void;
}

const ProjectInsight: React.FC<ProjectInsightProps> = ({ insight, projects, onSelectProject }) => {
  const project = projects.find(p => p.id === insight.projectId);
  
  // Function to get priority based on project usefulness and progress
  const getProjectPriority = (project?: Project) => {
    if (!project) return null;
    
    if (project.usefulness >= 4 && project.progress > 50) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">⭐ High Potential</span>;
    } else if (project.progress > 75) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">🚀 Launch Ready</span>;
    } else if (project.usefulness >= 4) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">💡 Promising</span>;
    }
    
    return null;
  };

  const priorityBadge = getProjectPriority(project);
  
  const handleProjectClick = () => {
    if (onSelectProject && project) {
      onSelectProject(project.id);
    }
  };

  return (
    <div 
      key={insight.projectId} 
      className="border rounded-lg p-4 bg-card shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={handleProjectClick}
      style={{
        boxShadow: "0 0 0 1px rgba(88, 129, 87, 0.1), 0 4px 12px rgba(88, 129, 87, 0.08)"
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-base">{insight.projectName}</h3>
        {priorityBadge}
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-semibold text-xs text-muted-foreground mb-1">🧠 PROJECT SUMMARY</p>
          <p>{insight.summary}</p>
        </div>
        
        <div>
          <p className="font-semibold text-xs text-muted-foreground mb-1">✅ NEXT STEPS & SUGGESTIONS</p>
          <p>{insight.suggestion}</p>
        </div>
        
        <div>
          <p className="font-semibold text-xs text-muted-foreground mb-1">🔥 MOTIVATIONAL BOOST</p>
          <p className="italic">{insight.motivation}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInsight;
