
import React, { memo } from 'react';
import { Project } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Trophy, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface EnhancedCompletedProjectsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const EnhancedCompletedProjects: React.FC<EnhancedCompletedProjectsProps> = memo(({ 
  projects, 
  onSelect 
}) => {
  if (projects.length === 0) {
    return null;
  }

  const totalCompleted = projects.length;
  const monetizedProjects = projects.filter(p => p.isMonetized).length;
  const recentlyCompleted = projects.filter(p => {
    const updatedDate = new Date(p.lastUpdated);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updatedDate > weekAgo;
  }).length;

  return (
    <ErrorBoundary>
      <section 
        className="animate-smooth-fade-in"
        aria-labelledby="completed-projects-title"
      >
        <Card className="shadow-soft-lg border-border/50 completed-surface backdrop-blur-sm bg-gradient-to-r from-green-50/50 to-emerald-50/50">
          <CardHeader className="pb-4">
            <CardTitle 
              id="completed-projects-title"
              className="text-section-title flex items-center text-foreground"
            >
              <Trophy className="h-6 w-6 text-green-600 mr-3" aria-hidden="true" />
              Completed Projects
              <span 
                className="ml-3 inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-200"
                aria-label={`${totalCompleted} completed projects`}
              >
                {totalCompleted}
              </span>
            </CardTitle>
            
            {/* Success metrics */}
            <div className="flex flex-wrap gap-4 mt-3 text-body-sm">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                <span>{totalCompleted} Total</span>
              </div>
              {monetizedProjects > 0 && (
                <div className="flex items-center gap-2 text-amber-700">
                  <span>💰</span>
                  <span>{monetizedProjects} Monetized</span>
                </div>
              )}
              {recentlyCompleted > 0 && (
                <div className="flex items-center gap-2 text-blue-700">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>{recentlyCompleted} This Week</span>
                </div>
              )}
            </div>
            
            <p className="text-body-sm text-muted-foreground mt-2">
              Celebrate your achievements and track your successful project completions
            </p>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-auto max-h-[400px]">
              <div 
                className="responsive-grid"
                role="list"
                aria-label="Completed projects list"
              >
                {projects.map(project => (
                  <Card 
                    key={project.id} 
                    className="group completed-project hover-lift transition-all duration-200 cursor-pointer border-border/30 hover:border-green-300/50 hover:shadow-soft focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2"
                    onClick={() => onSelect(project)}
                    role="listitem"
                    tabIndex={0}
                    aria-label={`Completed project: ${project.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(project);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-card-title font-medium text-foreground line-clamp-1 pr-2">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {project.isMonetized && (
                            <span 
                              className="text-amber-500 text-lg" 
                              title="Monetized project"
                              aria-label="This project generates revenue"
                            >
                              💰
                            </span>
                          )}
                          <CheckCircle 
                            className="h-4 w-4 text-green-600" 
                            aria-label="Completed"
                          />
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className="text-body-sm text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Progress bar showing 100% */}
                      <div className="mb-3" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-green-600">100%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-full transition-all duration-300" />
                        </div>
                      </div>
                      
                      {/* Completion date */}
                      <div className="text-xs text-muted-foreground mb-3">
                        Completed {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-8 px-3 hover:bg-green-50 hover:text-green-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(project);
                          }}
                          aria-label={`View details for ${project.name}`}
                        >
                          View Details
                        </Button>
                        
                        {project.websiteUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-xs h-8 px-3 text-green-600 hover:text-green-700 transition-colors group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a 
                              href={project.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              aria-label={`Visit ${project.name} website (opens in new tab)`}
                            >
                              <span>Visit</span>
                              <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </ErrorBoundary>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.projects.every((project, index) => 
      project.id === nextProps.projects[index]?.id &&
      project.lastUpdated === nextProps.projects[index]?.lastUpdated
    )
  );
});

EnhancedCompletedProjects.displayName = 'EnhancedCompletedProjects';

export default EnhancedCompletedProjects;
