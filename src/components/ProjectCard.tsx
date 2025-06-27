
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

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { editProject } = useProjects();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use existing activity logs or create default ones if none exist
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
  const isCompleted = project.status === 'Completed';

  return (
    <Card 
      id={`project-${project.id}`} 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-in-out
        hover-lift hover:shadow-soft-lg hover:scale-[1.02]
        glass-enhanced rounded-xl 
        ${progressColorClass} 
        ${project.pinned ? 'ring-2 ring-amber-400/50 shadow-glow' : ''} 
        ${isCompleted ? 'completed-project' : ''}
        animate-gentle-scale-in
        cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced progress indicator bar with animation */}
      <div 
        className={`h-2 transition-all duration-500 ease-out ${
          project.progress >= 80 ? 'bg-green-500' :
          project.progress >= 50 ? 'bg-amber-500' :
          project.progress >= 25 ? 'bg-blue-500' : 'bg-gray-400'
        }`}
        style={{
          background: `linear-gradient(90deg, hsl(var(--primary)) ${project.progress}%, hsl(var(--muted)) ${project.progress}%)`,
          transform: isHovered ? 'scaleY(1.5)' : 'scaleY(1)',
          transformOrigin: 'bottom'
        }}
      />
      
      {/* Completed badge with enhanced styling */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`completed-badge animate-gentle-scale-in transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}>
            ✓ Completed
          </span>
        </div>
      )}
      
      {/* Enhanced hover gradient overlay */}
      <div className={`
        absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent 
        transition-opacity duration-300 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
      
      <CardContent className="p-6 relative">
        <ProjectCardHeader project={project} onTogglePin={handleTogglePin} />
        <ProjectCardContent project={project} />
        
        <div className="mt-6 space-y-4">
          <TaskSection project={project} onUpdateProject={editProject} />
          <MilestonesSection project={project} />
          
          {/* Activity log section with enhanced styling */}
          <div className={`
            border-t border-border/50 pt-4 transition-all duration-300
            ${isHovered ? 'border-primary/30' : ''}
          `}>
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
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
        -skew-x-12 transition-all duration-700 pointer-events-none
        ${isHovered ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'}
      `} />
    </Card>
  );
};

export default ProjectCard;
