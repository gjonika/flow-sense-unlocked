import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Project, ActivityLog } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { TrashIcon, EditIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon, LinkIcon, GithubIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useProjects } from '@/contexts/ProjectContext';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  // Helper to determine badge color based on tag content
  const getBadgeColor = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('progress')) return 'bg-blue-100 text-blue-800';
    if (tagLower === 'build') return 'bg-indigo-100 text-indigo-800';
    if (tagLower === 'idea') return 'bg-amber-100 text-amber-800';
    if (tagLower === 'planning') return 'bg-green-100 text-green-800';
    if (tagLower === 'live' || tagLower === 'launched') return 'bg-emerald-100 text-emerald-800';
    if (tagLower === 'abandoned') return 'bg-yellow-100 text-yellow-800';
    if (tagLower === 'market') return 'bg-orange-100 text-orange-800';
    if (tagLower === 'personal') return 'bg-purple-100 text-purple-800';
    if (tagLower === 'for sale') return 'bg-rose-100 text-rose-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(tag)}`}>
      {tag}
    </span>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { editProject } = useProjects();
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityText, setActivityText] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    // Initialize from project.activityLogs if it exists, otherwise create default entries
    if (project.activityLogs && Array.isArray(project.activityLogs)) {
      return project.activityLogs.map((log: any) => ({
        text: log.text,
        date: log.date
      }));
    }
    
    return [
      { text: "Initial project setup completed", date: project.createdAt },
    ];
  });
  
  const isMobile = useIsMobile();

  const toggleActivityLog = () => {
    setShowActivityLog(!showActivityLog);
  };

  const handleAddActivity = async () => {
    if (activityText.trim()) {
      const newDate = new Date().toISOString();
      const newEntry: ActivityLog = { 
        text: activityText, 
        date: newDate
      };
      
      const updatedLogs = [newEntry, ...activityLogs];
      
      // Update local state
      setActivityLogs(updatedLogs);
      setActivityText('');
      
      // Persist to database by updating the project
      try {
        await editProject(project.id, {
          activityLogs: updatedLogs
        });
      } catch (error) {
        console.error('Failed to save activity log:', error);
      }
    }
  };

  return (
    <Card className="overflow-hidden border-olive/20 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-olive-dark">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {project.isMonetized && (
                <span className="text-amber-500" title="Monetized">
                  💰
                </span>
              )}
              {/* Display usefulness rating with stars */}
              <div className="flex items-center" title={`Usefulness: ${project.usefulness}/5`}>
                <span className="text-sm font-medium text-rose-500">
                  {project.usefulness === 5 ? "⭐⭐⭐⭐⭐" : 
                   project.usefulness === 4 ? "⭐⭐⭐⭐" : 
                   project.usefulness === 3 ? "⭐⭐⭐" : 
                   project.usefulness === 2 ? "⭐⭐" : "⭐"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {/* Status tag */}
          <TagBadge tag={project.status} />
          
          {/* Type tag */}
          <TagBadge tag={project.type} />
          
          {/* Other tags */}
          {project.tags.slice(0, 3).map((tag, index) => (
            <TagBadge key={index} tag={tag} />
          ))}
          
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>
        
        {/* Project links section */}
        {(project.githubUrl || project.websiteUrl) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-gray-700"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
              </a>
            )}
            {project.websiteUrl && (
              <a 
                href={project.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 text-gray-700"
              >
                <LinkIcon size={14} />
                <span>Website</span>
              </a>
            )}
          </div>
        )}
        
        {project.nextAction && (
          <div className="mt-3 p-2 bg-muted rounded-sm text-xs">
            <span className="font-medium">Next:</span> {project.nextAction}
          </div>
        )}
        
        {/* Activity log section - Fixed to make Add button functional and add dates */}
        <Collapsible
          open={showActivityLog}
          onOpenChange={setShowActivityLog}
          className="mt-4 border-t pt-3"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-left text-muted-foreground hover:text-foreground">
            <span className="font-medium">Activity Log</span>
            {showActivityLog ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
                placeholder="What did you accomplish?"
                className="w-full text-xs p-2 border border-input rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="self-end" 
                onClick={handleAddActivity}
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="mt-2 space-y-1.5">
              {activityLogs.map((entry, index) => (
                <div key={index} className="text-xs p-2 bg-muted/50 rounded-sm">
                  <div className="flex flex-col">
                    <span>{entry.text}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {format(new Date(entry.date), 'MMM d, yyyy - h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between border-t border-border/50 bg-muted/30">
        <div className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(project.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(project)}>
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
