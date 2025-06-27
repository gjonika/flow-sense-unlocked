
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  FileTextIcon, 
  BrainIcon, 
  ListTodoIcon, 
  DownloadIcon,
  LineChart
} from 'lucide-react';
import { Project } from '@/lib/supabase';

interface DesktopControlsProps {
  handleAddProject: () => void;
  toggleAnalytics: () => void;
  showAnalytics: boolean;
  toggleAISupport: () => void;
  showAISupport: boolean;
  togglePriorities: () => void;
  showPriorities: boolean;
  openImportDialog: () => void;
  handleExportCSV: () => void;
  handleExportJSON: () => void;
}

const DesktopControls: React.FC<DesktopControlsProps> = ({
  handleAddProject,
  toggleAnalytics,
  showAnalytics,
  toggleAISupport,
  showAISupport,
  togglePriorities,
  showPriorities,
  openImportDialog,
  handleExportCSV,
  handleExportJSON,
}) => {
  return (
    <div className="hidden lg:flex flex-wrap gap-3 items-center">
      <Button 
        onClick={handleAddProject}
        className="bg-primary hover:bg-primary/90 text-primary-foreground touch-target hover-lift transition-all duration-200"
        size="default"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        <span>Add Project</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant={showAnalytics ? "default" : "outline"}
          className={`touch-target hover-scale transition-all duration-200 ${
            showAnalytics 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'hover:bg-accent/10 hover:text-accent border-accent/20'
          }`}
          onClick={toggleAnalytics}
        >
          <LineChart className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {showAnalytics ? 'Hide' : 'Show'} Insights
          </span>
          <span className="sm:hidden">Insights</span>
        </Button>
        
        <Button
          variant="outline"
          className={`touch-target hover-scale transition-all duration-200 hover:bg-accent/10 hover:text-accent border-accent/20 ${
            showPriorities ? 'bg-accent/10 text-accent' : ''
          }`}
          onClick={togglePriorities}
        >
          <ListTodoIcon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {showPriorities ? 'Hide' : 'Show'} Priorities
          </span>
          <span className="sm:hidden">Priorities</span>
        </Button>
        
        <Button
          variant="outline"
          className={`touch-target hover-scale transition-all duration-200 hover:bg-accent/10 hover:text-accent border-accent/20 ${
            showAISupport ? 'bg-accent/10 text-accent' : ''
          }`}
          onClick={toggleAISupport}
        >
          <BrainIcon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {showAISupport ? 'Hide' : 'Show'} AI Support
          </span>
          <span className="sm:hidden">AI</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 border-l pl-3 border-border/50">
        <Button 
          variant="outline"
          className="touch-target hover-scale transition-all duration-200 hover:bg-muted/50"
          onClick={openImportDialog}
        >
          <FileTextIcon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Import CSV</span>
          <span className="sm:hidden">Import</span>
        </Button>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="touch-target hover-scale transition-all duration-200 hover:bg-muted/50"
            onClick={handleExportCSV}
          >
            <DownloadIcon className="h-3.5 w-3.5 mr-1" />
            <span>CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="touch-target hover-scale transition-all duration-200 hover:bg-muted/50"
            onClick={handleExportJSON}
          >
            <DownloadIcon className="h-3.5 w-3.5 mr-1" />
            <span>JSON</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopControls;
