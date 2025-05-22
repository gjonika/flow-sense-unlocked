
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGridIcon, LayoutListIcon } from 'lucide-react';

interface ProjectViewControlsProps {
  viewMode: 'cards' | 'table';
  toggleViewMode: () => void;
  projectCount: number;
  setSortBy: (sortBy: string) => void;
  isMobile: boolean;
}

const ProjectViewControls: React.FC<ProjectViewControlsProps> = ({
  viewMode,
  toggleViewMode,
  projectCount,
  setSortBy,
  isMobile,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
      <div className="text-sm text-muted-foreground">
        Showing {projectCount} projects
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="text-sm flex items-center gap-1"
          onClick={toggleViewMode}
        >
          {viewMode === 'cards' ? (
            <>
              <LayoutListIcon className="h-4 w-4" />
              <span>Table View</span>
            </>
          ) : (
            <>
              <LayoutGridIcon className="h-4 w-4" />
              <span>Card View</span>
            </>
          )}
        </Button>
        
        <div className="flex flex-wrap gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortBy('name')}
            className="text-sm"
          >
            Name
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortBy('status')}
            className="text-sm"
          >
            Status
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortBy('usefulness')}
            className="text-sm"
          >
            Usefulness
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortBy('progress')}
            className="text-sm"
          >
            Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewControls;
