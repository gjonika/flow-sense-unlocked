
import React from 'react';
import { Project } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface CompletedProjectsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const CompletedProjects: React.FC<CompletedProjectsProps> = ({ projects, onSelect }) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <Card className="shadow-soft-lg border-gray-light/50 bg-bg-completed backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-section-title flex items-center text-gray-text">
            <Icon icon={CheckCircle} size={24} className="text-green-600 mr-3" />
            Completed Surveys
            <span className="ml-3 inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-200">
              {projects.length}
            </span>
          </CardTitle>
          <p className="text-body-sm text-muted-foreground mt-1">
            Surveys you've successfully completed and submitted
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-auto max-h-[320px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <Card 
                  key={project.id} 
                  className="group transition-all duration-300 cursor-pointer border-gray-light/30 hover:border-green-300/50 hover:shadow-soft hover:scale-[1.01] bg-white/60 backdrop-blur-sm"
                  onClick={() => onSelect(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-card-title font-medium text-gray-text line-clamp-1 pr-2">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {project.isMonetized && (
                          <span className="text-amber-500 text-lg" title="Monetized">💰</span>
                        )}
                        <Icon icon={CheckCircle} size={16} className="text-green-600" />
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-body-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    {/* Progress bar showing 100% */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium text-green-600">100%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-full transition-all duration-300" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 px-3 hover:bg-green-50 hover:text-green-700 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(project);
                        }}
                      >
                        View Details
                      </Button>
                      
                      {project.websiteUrl && (
                        <a 
                          href={project.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-xs text-green-600 hover:text-green-700 transition-all duration-300 group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Visit</span>
                          <Icon 
                            icon={ExternalLink} 
                            size={12} 
                            className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200" 
                          />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedProjects;
