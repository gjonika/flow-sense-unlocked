
import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectTable from '@/components/ProjectTable';
import ProjectAccordion from '@/components/dashboard/ProjectCardGrouped';
import ProjectTimeline from '@/components/dashboard/ProjectTimeline';
import { Button } from '@/components/ui/button';
import { Project, ProjectGroupBy } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Icon } from '@/components/ui/Icon';
import { Plus, FolderOpen, FileText } from 'lucide-react';

interface ProjectContentProps {
  loading: boolean;
  projects: Project[];
  viewMode: 'cards' | 'table' | 'accordion' | 'timeline';
  handleAddProject: () => void;
  handleEditProject: (project: Project) => void;
  handleDeleteProject: (id: string) => void;
  useAccordion?: boolean;
  groupBy: ProjectGroupBy;
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  loading,
  projects,
  viewMode,
  handleAddProject,
  handleEditProject,
  handleDeleteProject,
  useAccordion = true,
  groupBy = 'status',
}) => {
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-body-sm text-muted-foreground">Loading your surveys...</p>
          </div>
        </div>
        
        {/* Skeleton loading cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-64 bg-gray-200 rounded-xl animate-skeleton-pulse" 
            />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={FileText}
          title="No Surveys Found"
          description="Start your first cruise ship interior assessment! Create a survey to begin tracking compliance and planning refits."
          actionLabel="Create First Survey"
          onAction={handleAddProject}
          className="py-16"
        />
      </div>
    );
  }

  // Render different views based on the selected view mode
  return (
    <div className="transition-all duration-300 animate-fade-in">
      {viewMode === 'accordion' ? (
        <ProjectAccordion 
          projects={projects}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          groupBy={groupBy}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="mt-6 bg-bg-light backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-light/30 overflow-x-auto">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="min-w-[800px]">
              <ProjectTimeline 
                projects={projects}
                onSelectProject={handleEditProject}
              />
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-bg-light backdrop-blur-sm border border-gray-light/30">
          <div className="min-w-[800px]">
            <ProjectTable
              projects={projects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContent;
