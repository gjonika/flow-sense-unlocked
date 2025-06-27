
import React, { memo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Project, ActivityLogEntry } from '@/lib/supabase';
import { getProgressColor } from '@/lib/projectUtils';
import { useProjects } from '@/contexts/ProjectContext';
import ProjectCardHeader from './ProjectCardHeader';
import ProjectCardContent from './ProjectCardContent';
import TaskSection from './TaskSection';
import MilestonesSection from './MilestonesSection';
import ProjectCardActions from './ProjectCardActions';
import ActivityLog from './ActivityLog';

interface OptimizedProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isCompleted?: boolean;
}

const OptimizedProjectCard: React.FC<OptimizedProjectCardProps> = memo(({ 
  project, 
  onEdit, 
  onDelete, 
  isCompleted = false 
}) => {
  const { editProject } = useProjects();
  
  const initialActivityLogs: ActivityLogEntry[] = project.activityLogs || [
    { text: "Initial project setup completed", date: project.createdAt },
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

  return (
    <Card 
      id={`project-${project.id}`} 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-in-out
        hover-lift hover:shadow-soft-lg hover:scale-[1.02]
        glass-enhanced rounded-xl 
        ${progressColorClass} 
        ${project.pinned ? 'ring-2 ring-amber-400/50 shadow-glow' : ''} 
        ${isCompleted ? 'completed-project opacity-80 grayscale-[0.3]' : ''}
        animate-gentle-scale-in
        cursor-pointer
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
      `}
      role="article"
      aria-label={`Project: ${project.name}`}
      tabIndex={0}
    >
      {/* Progress indicator bar */}
      <div 
        className={`h-2 transition-all duration-500 ease-out ${
          project.progress >= 80 ? 'bg-green-500' :
          project.progress >= 50 ? 'bg-amber-500' :
          project.progress >= 25 ? 'bg-blue-500' : 'bg-gray-400'
        }`}
        style={{
          background: `linear-gradient(90deg, hsl(var(--primary)) ${project.progress}%, hsl(var(--muted)) ${project.progress}%)`,
        }}
        role="progressbar"
        aria-valuenow={project.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Project progress: ${project.progress}%`}
      />
      
      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <span className="completed-badge animate-gentle-scale-in">
            ✓ Completed
          </span>
        </div>
      )}
      
      <CardContent className="p-6 relative">
        <ProjectCardHeader project={project} onTogglePin={handleTogglePin} />
        <ProjectCardContent project={project} />
        
        <div className="mt-6 space-y-4">
          <TaskSection project={project} onUpdateProject={editProject} />
          <MilestonesSection project={project} />
          
          <div className="border-t border-border/50 pt-4">
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
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.project.lastUpdated === nextProps.project.lastUpdated &&
    prevProps.project.progress === nextProps.project.progress &&
    prevProps.project.pinned === nextProps.project.pinned &&
    prevProps.isCompleted === nextProps.isCompleted
  );
});

OptimizedProjectCard.displayName = 'OptimizedProjectCard';

export default OptimizedProjectCard;
