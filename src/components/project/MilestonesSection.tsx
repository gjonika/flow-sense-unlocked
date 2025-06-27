
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Project } from '@/lib/supabase';
import ProjectMilestones from './ProjectMilestones';

interface MilestonesSectionProps {
  project: Project;
}

const MilestonesSection: React.FC<MilestonesSectionProps> = ({ project }) => {
  const [showMilestones, setShowMilestones] = useState(false);
  const hasMilestones = project.milestones && project.milestones.length > 0;

  if (!hasMilestones) return null;

  return (
    <div className="mt-4 border-t border-baltic-sand/50 pt-3">
      <button 
        onClick={() => setShowMilestones(!showMilestones)}
        className="flex items-center justify-between w-full text-sm text-left text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="font-medium">Milestones</span>
        {showMilestones ? 
          <ChevronUpIcon size={16} /> : 
          <ChevronDownIcon size={16} />
        }
      </button>
      
      {showMilestones && (
        <div className="mt-2">
          <ProjectMilestones milestones={project.milestones!} />
        </div>
      )}
    </div>
  );
};

export default MilestonesSection;
