
import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectTable from '@/components/ProjectTable';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';

interface ProjectContentProps {
  loading: boolean;
  projects: Project[];
  viewMode: 'cards' | 'table';
  handleAddProject: () => void;
  handleEditProject: (project: Project) => void;
  handleDeleteProject: (id: string) => void;
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  loading,
  projects,
  viewMode,
  handleAddProject,
  handleEditProject,
  handleDeleteProject,
}) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 md:p-6 h-48 md:h-64 animate-pulse bg-muted/50"></div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 md:py-16">
        <h3 className="text-lg md:text-xl font-medium text-muted-foreground mb-4">No projects found</h3>
        <Button onClick={handleAddProject} className="bg-olive hover:bg-olive-dark">
          Add Your First Project
        </Button>
      </div>
    );
  }

  return viewMode === 'cards' ? (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      ))}
    </div>
  ) : (
    <div className="overflow-hidden">
      <ProjectTable
        projects={projects}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectContent;
