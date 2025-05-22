
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, FileTextIcon, BarChart2, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  handleAddProject: () => void;
  toggleAnalytics: () => void;
  toggleAISupport: () => void;
  showAnalytics: boolean;
  showAISupport: boolean;
  openImportDialog: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  handleAddProject, 
  toggleAnalytics, 
  showAnalytics, 
  openImportDialog,
  toggleAISupport,
  showAISupport
}) => {
  return (
    <div className="sticky top-0 z-30 bg-background pt-4 pb-2 shadow-sm">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-olive-dark">Project Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Track and manage your side projects</p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
          <Button 
            onClick={handleAddProject}
            className="bg-olive hover:bg-olive-dark flex items-center gap-2 order-first"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleAnalytics}
          >
            <BarChart2 className="h-4 w-4" />
            {showAnalytics ? 'Hide' : 'Show'} Insights
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleAISupport}
          >
            <Sparkles className="h-4 w-4" />
            {showAISupport ? 'Hide' : 'AI'} Support
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={openImportDialog}
          >
            <FileTextIcon className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
