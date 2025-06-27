
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGridIcon, LayoutListIcon, Layers, Calendar } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ProjectGroupBy } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectViewControlsProps {
  viewMode: 'cards' | 'table' | 'accordion' | 'timeline';
  toggleViewMode: (mode?: 'cards' | 'table' | 'accordion' | 'timeline') => void;
  projectCount: number;
  setSortBy: (sortBy: string) => void;
  isMobile: boolean;
  groupBy: ProjectGroupBy;
  setGroupBy: (groupBy: ProjectGroupBy) => void;
}

const ProjectViewControls: React.FC<ProjectViewControlsProps> = ({
  viewMode,
  toggleViewMode,
  projectCount,
  setSortBy,
  isMobile,
  groupBy,
  setGroupBy,
}) => {
  const groupByOptions: { value: ProjectGroupBy; label: string }[] = [
    { value: 'status', label: 'Status' },
    { value: 'type', label: 'Type' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
      <div className="text-sm text-muted-foreground">
        Showing {projectCount} projects
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
          if (value) toggleViewMode(value as any);
        }} className="bg-baltic-fog/40 p-1 rounded-lg border border-baltic-sand/30">
          <ToggleGroupItem value="cards" aria-label="Cards View" className="data-[state=on]:bg-baltic-sand/40 data-[state=on]:text-baltic-deep">
            <LayoutGridIcon className="h-4 w-4 mr-1" />
            {!isMobile && <span>Cards</span>}
          </ToggleGroupItem>
          
          <ToggleGroupItem value="table" aria-label="Table View" className="data-[state=on]:bg-baltic-sand/40 data-[state=on]:text-baltic-deep">
            <LayoutListIcon className="h-4 w-4 mr-1" />
            {!isMobile && <span>Table</span>}
          </ToggleGroupItem>
          
          <ToggleGroupItem value="accordion" aria-label="Accordion View" className="data-[state=on]:bg-baltic-sand/40 data-[state=on]:text-baltic-deep">
            <Layers className="h-4 w-4 mr-1" />
            {!isMobile && <span>Groups</span>}
          </ToggleGroupItem>
          
          <ToggleGroupItem value="timeline" aria-label="Timeline View" className="data-[state=on]:bg-baltic-sand/40 data-[state=on]:text-baltic-deep">
            <Calendar className="h-4 w-4 mr-1" />
            {!isMobile && <span>Timeline</span>}
          </ToggleGroupItem>
        </ToggleGroup>
        
        {viewMode === 'accordion' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2">
                  <Select value={groupBy} onValueChange={(value) => setGroupBy(value as ProjectGroupBy)}>
                    <SelectTrigger className="w-[130px] bg-baltic-fog/40 border-baltic-sand/30">
                      <SelectValue placeholder="Group by" />
                    </SelectTrigger>
                    <SelectContent>
                      {groupByOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          Group by {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose how projects are grouped in accordion view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
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
