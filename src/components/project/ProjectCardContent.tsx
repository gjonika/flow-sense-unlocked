import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { Project } from '@/lib/supabase';
import TagBadge from './TagBadge';
import ProjectMilestones from './ProjectMilestones';
import WebsitePreview from './WebsitePreview';
import ProjectLinks from './ProjectLinks';

interface ProjectCardContentProps {
  project: Project;
}

const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ project }) => {
  const hasMilestones = project.milestones && project.milestones.length > 0;
  const hasWebsiteUrl = Boolean(project.websiteUrl && project.websiteUrl.trim() !== '');

  return (
    <>
      {project.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
      )}

      {/* Account Used */}
      {project.accountUsed && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            Account: {project.accountUsed}
          </Badge>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Status tag */}
        <TagBadge tag={project.status} variant="status" />
        
        {/* Type tag */}
        <TagBadge tag={project.type} variant="type" />
        
        {/* Other tags */}
        {project.tags && project.tags.length > 0 && (
          <>
            {project.tags.slice(0, 3).map((tag, index) => (
              <TagBadge key={index} tag={tag} />
            ))}
            
            {project.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-baltic-sand/70 text-baltic-deep">
                +{project.tags.length - 3}
              </span>
            )}
          </>
        )}
      </div>

      {/* Chat Links */}
      {project.chatLinks && project.chatLinks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.chatLinks.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              Chat {index + 1}
              <ExternalLink className="h-2 w-2" />
            </a>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5 bg-baltic-sand/50" />
      </div>

      {/* Display compact milestone if available */}
      {hasMilestones && <ProjectMilestones milestones={project.milestones!} compact={true} />}
      
      {/* Website preview */}
      {hasWebsiteUrl && (
        <WebsitePreview url={project.websiteUrl!} projectName={project.name} />
      )}
      
      {/* Project links section */}
      <ProjectLinks githubUrl={project.githubUrl} websiteUrl={project.websiteUrl} />
      
      {project.nextAction && (
        <div className="mt-3 p-2 bg-baltic-fog/40 backdrop-filter backdrop-blur-sm rounded-md text-xs border border-baltic-sand/30">
          <span className="font-medium">Next:</span> {project.nextAction}
        </div>
      )}
    </>
  );
};

export default ProjectCardContent;
