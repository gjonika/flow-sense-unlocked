
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Project, ActivityLogEntry } from '@/lib/supabase';
import { getProgressColor } from '@/lib/projectUtils';
import ActivityLog from './project/ActivityLog';
import { useProjects } from '@/contexts/ProjectContext';
import ProjectCardHeader from './project/ProjectCardHeader';
import ProjectCardContent from './project/ProjectCardContent';
import TaskSection from './project/TaskSection';
import MilestonesSection from './project/MilestonesSection';
import ProjectCardActions from './project/ProjectCardActions';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isCompleted?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete, 
  isCompleted = false 
}) => {
  const { editProject } = useProjects();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use existing activity logs or create default ones if none exist
  const initialActivityLogs: ActivityLogEntry[] = project.activityLogs || [
    { text: "Initial survey setup completed", date: project.createdAt },
  ];
  
  const handleTogglePin = async () => {
    try {
      await editProject(project.id, { pinned: !project.pinned });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleUpdateActivityLogs = async (logs: ActivityLogEntry[]) => {
    try {
      await editProject(project.id, { activityLogs: logs });
    } catch (error) {
      console.error('Error updating activity logs:', error);
    }
  };

  const progressColorClass = getProgressColor(project.progress);
  const isProjectCompleted = project.status === 'Completed' || isCompleted;

  const cardClasses = cn(
    "group relative overflow-hidden transition-all duration-300 ease-in-out rounded-xl cursor-pointer",
    "hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.99]",
    "border border-gray-light/50 backdrop-blur-sm",
    progressColorClass,
    {
      "bg-white": !isProjectCompleted,
      "bg-bg-completed text-gray-500 opacity-90": isProjectCompleted,
      "ring-2 ring-amber-400/50 shadow-glow": project.pinned,
    },
    "animate-gentle-scale-in"
  );

  return (
    <Card 
      id={`project-${project.id}`} 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced progress indicator bar with animation */}
      <div 
        className={cn(
          "h-2 transition-all duration-500 ease-out",
          {
            "bg-green-500": project.progress >= 80,
            "bg-amber-500": project.progress >= 50 && project.progress < 80,
            "bg-blue-500": project.progress >= 25 && project.progress < 50,
            "bg-gray-400": project.progress < 25,
          }
        )}
        style={{
          background: `linear-gradient(90deg, hsl(var(--primary)) ${project.progress}%, hsl(var(--muted)) ${project.progress}%)`,
          transform: isHovered ? 'scaleY(1.5)' : 'scaleY(1)',
          transformOrigin: 'bottom'
        }}
      />
      
      {/* Completed badge with enhanced styling */}
      {isProjectCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            "bg-green-100 text-green-800 border border-green-200",
            "animate-gentle-scale-in transition-all duration-300",
            isHovered ? "scale-110" : "scale-100"
          )}>
            ✓ Completed
          </span>
        </div>
      )}
      
      {/* Enhanced hover gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-brand-primary/5 via-transparent to-transparent",
        "transition-opacity duration-300 pointer-events-none",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
      
      <CardContent className="p-6 relative">
        <ProjectCardHeader project={project} onTogglePin={handleTogglePin} />
        <ProjectCardContent project={project} />
        
        <div className="mt-6 space-y-4">
          <TaskSection project={project} onUpdateProject={editProject} />
          <MilestonesSection project={project} />
          
          {/* Activity log section with enhanced styling */}
          <div className={cn(
            "border-t border-gray-light/50 pt-4 transition-all duration-300",
            isHovered ? "border-brand-primary/30" : ""
          )}>
            <ActivityLog 
              projectId={project.id}
              initialLogs={initialActivityLogs} 
              onUpdateLogs={handleUpdateActivityLogs}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0">
        <ProjectCardActions project={project} onEdit={onEdit} onDelete={onDelete} />
      </CardFooter>
      
      {/* Enhanced shimmer effect on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
        "-skew-x-12 transition-all duration-700 pointer-events-none",
        isHovered ? "translate-x-full opacity-100" : "-translate-x-full opacity-0"
      )} />
    </Card>
  );
};

export default ProjectCard;
