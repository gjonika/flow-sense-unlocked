
import React from 'react';
import { Project, ProjectGroupBy } from '@/lib/supabase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProjectCard from '@/components/ProjectCard';

interface ProjectGroupProps {
  categoryTitle: string;
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  defaultOpen?: boolean;
  isPinned?: boolean;
}

const ProjectCardGroup: React.FC<ProjectGroupProps> = ({ 
  categoryTitle, 
  projects, 
  onEditProject, 
  onDeleteProject,
  defaultOpen = false,
  isPinned = false
}) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <AccordionItem value={categoryTitle} className="border-baltic-sea/20">
      <AccordionTrigger className={`px-6 py-4 text-lg font-semibold text-baltic-deep hover:text-baltic-sea bg-gradient-to-r from-baltic-sand/20 to-baltic-fog/30 hover:from-baltic-sand/30 hover:to-baltic-fog/40 rounded-lg backdrop-filter backdrop-blur-sm transition-all duration-200 group ${isPinned ? 'bg-gradient-to-r from-amber-50/60 to-amber-100/40 border border-amber-200/50 shadow-sm' : ''}`}>
        <div className="flex items-center gap-3">
          {isPinned && <span className="text-amber-600 text-xl">📌</span>}
          <span className="font-medium">{categoryTitle}</span>
          <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-xs font-medium text-baltic-deep/70 bg-baltic-sea/10 rounded-full border border-baltic-sea/20">
            {projects.length}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-2">
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

interface ProjectAccordionProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  groupBy: ProjectGroupBy;
}

const getGroupLabel = (key: string, groupBy: ProjectGroupBy): string => {
  if (!key || key === "null" || key === "undefined") {
    return 'Other';
  }
  return key;
};

const getStatusOrder = (status: string): number => {
  // Custom order: pinned projects first, then regular statuses, abandoned last
  const statusOrder: Record<string, number> = {
    'Idea': 1,
    'Planning': 2,
    'In Progress': 3,
    'Build': 4,
    'Launch': 5,
    'Completed': 6,
    'Other': 7,
    'Abandoned': 8, // Moved to last position
  };
  return statusOrder[status] || 7;
};

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({ 
  projects, 
  onEditProject, 
  onDeleteProject,
  groupBy 
}) => {
  // Separate pinned and regular projects
  const pinnedProjects = projects.filter(p => p.pinned);
  const regularProjects = projects.filter(p => !p.pinned);

  // Group regular projects by the selected field
  const groupedProjects = regularProjects.reduce((acc, project) => {
    const key = project[groupBy] || 'Other';
    const groupKey = key ? key.toString() : 'Other';
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  // Get sorted group names with custom order for status
  let groups = Object.keys(groupedProjects);
  
  if (groupBy === 'status') {
    groups = groups.sort((a, b) => getStatusOrder(a) - getStatusOrder(b));
  } else {
    groups = groups.sort();
  }

  const allGroups = [];
  
  // Add pinned projects first if any exist
  if (pinnedProjects.length > 0) {
    allGroups.push('📌 Pinned Projects');
  }
  
  // Add regular groups
  allGroups.push(...groups);

  return (
    <Accordion type="multiple" defaultValue={allGroups} className="space-y-4">
      {/* Pinned projects section */}
      {pinnedProjects.length > 0 && (
        <ProjectCardGroup
          key="pinned"
          categoryTitle="📌 Pinned Projects"
          projects={pinnedProjects}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
          defaultOpen={true}
          isPinned={true}
        />
      )}
      
      {/* Regular project groups */}
      {groups.map(group => (
        <ProjectCardGroup
          key={group}
          categoryTitle={getGroupLabel(group, groupBy)}
          projects={groupedProjects[group]}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
          defaultOpen={true}
        />
      ))}
    </Accordion>
  );
};

export default ProjectAccordion;
