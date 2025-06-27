
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin } from 'lucide-react';
import { Project } from '@/lib/supabase';

interface ProjectCardHeaderProps {
  project: Project;
  onTogglePin: () => void;
}

const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ project, onTogglePin }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-baltic-deep">{project.name}</h3>
          {project.pinned && (
            <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {project.isMonetized && (
            <span className="text-amber-500" title="Monetized">
              💰
            </span>
          )}
          <div className="flex items-center" title={`Usefulness: ${project.usefulness}/5`}>
            <span className="text-sm font-medium text-baltic-sea">
              {project.usefulness === 5 ? "⭐⭐⭐⭐⭐" : 
               project.usefulness === 4 ? "⭐⭐⭐⭐" : 
               project.usefulness === 3 ? "⭐⭐⭐" : 
               project.usefulness === 2 ? "⭐⭐" : "⭐"}
            </span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hover:bg-baltic-sand/30 transition-colors"
        onClick={onTogglePin}
        title={project.pinned ? "Unpin project" : "Pin project"}
      >
        <Pin className={`h-4 w-4 ${project.pinned ? 'text-amber-500 fill-amber-500' : 'text-baltic-sea/60'}`} />
      </Button>
    </div>
  );
};

export default ProjectCardHeader;
