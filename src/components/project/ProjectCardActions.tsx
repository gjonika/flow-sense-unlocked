
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon, EditIcon } from 'lucide-react';
import { Project } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardActionsProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCardActions: React.FC<ProjectCardActionsProps> = ({ project, onEdit, onDelete }) => {
  return (
    <div className="p-4 pt-2 flex justify-between border-t border-baltic-sand/30 bg-baltic-fog/30 backdrop-filter backdrop-blur-sm">
      <div className="text-xs text-muted-foreground">
        Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-baltic-sand/30 transition-colors" onClick={() => onDelete(project.id)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-baltic-sand/30 transition-colors" onClick={() => onEdit(project)}>
          <EditIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCardActions;
