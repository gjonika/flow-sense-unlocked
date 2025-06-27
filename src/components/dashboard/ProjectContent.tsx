
import React from 'react';
import OptimizedProjectCard from '@/components/project/OptimizedProjectCard';
import ProjectTable from '@/components/ProjectTable';
import ProjectAccordion from '@/components/dashboard/ProjectCardGrouped';
import ProjectTimeline from '@/components/dashboard/ProjectTimeline';
import { Button } from '@/components/ui/button';
import { Project, ProjectGroupBy } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PlusIcon, FolderOpenIcon } from 'lucide-react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

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
      <ErrorBoundary>
        <div className="space-y-6 animate-smooth-fade-in" role="status" aria-label="Loading projects">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-body-sm text-muted-foreground">Loading your projects...</p>
            </div>
          </div>
          
          {/* Skeleton loading cards */}
          <div className="responsive-grid" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-xl animate-skeleton-pulse" />
            ))}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (projects.length === 0) {
    return (
      <ErrorBoundary>
        <div className="animate-smooth-fade-in">
          <EmptyState
            icon={FolderOpenIcon}
            title="No projects found"
            description="Start building something amazing! Create your first project to begin tracking your progress and achievements."
            actionLabel="Add Your First Project"
            onAction={handleAddProject}
            className="py-16"
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Render different views based on the selected view mode
  return (
    <ErrorBoundary>
      <div className="transition-all duration-300 animate-smooth-fade-in">
        {viewMode === 'accordion' ? (
          <ProjectAccordion 
            projects={projects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            groupBy={groupBy}
          />
        ) : viewMode === 'cards' ? (
          <div 
            className="responsive-grid"
            role="list"
            aria-label={`${projects.length} projects in card view`}
          >
            {projects.map((project) => (
              <div key={project.id} role="listitem">
                <OptimizedProjectCard
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              </div>
            ))}
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="mt-6 surface-subtle backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-border/30 overflow-x-auto">
            <ScrollArea className="w-full scrollbar-thin" orientation="horizontal">
              <div className="min-w-[800px]">
                <ProjectTimeline 
                  projects={projects}
                  onSelectProject={handleEditProject}
                />
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl surface-subtle backdrop-blur-sm border border-border/30">
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
    </ErrorBoundary>
  );
};

export default ProjectContent;
