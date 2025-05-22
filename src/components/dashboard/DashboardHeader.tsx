
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  BarChart, 
  FileSpreadsheet, 
  BrainCircuit,
  Lightbulb
} from 'lucide-react';

interface DashboardHeaderProps {
  handleAddProject: () => void;
  toggleAnalytics: () => void;
  toggleAISupport: () => void;
  toggleAIInsights: () => void;
  showAnalytics: boolean;
  showAISupport: boolean;
  showAIInsights: boolean;
  openImportDialog: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  handleAddProject,
  toggleAnalytics,
  toggleAISupport,
  toggleAIInsights,
  showAnalytics,
  showAISupport,
  showAIInsights,
  openImportDialog,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-olive-dark">Project Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track and manage your side projects</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Button 
            variant="default" 
            className="bg-olive hover:bg-olive-dark flex items-center gap-1"
            onClick={handleAddProject}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </Button>
          
          <Button 
            variant={showAnalytics ? "secondary" : "outline"} 
            className="flex items-center gap-1"
            onClick={toggleAnalytics}
          >
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Show Insights</span>
            <span className="sm:hidden">Insights</span>
          </Button>
          
          <Button 
            variant={showAISupport ? "secondary" : "outline"} 
            className="flex items-center gap-1"
            onClick={toggleAISupport}
          >
            <BrainCircuit className="h-4 w-4" />
            <span className="hidden sm:inline">AI Support</span>
            <span className="sm:hidden">AI</span>
          </Button>

          <Button 
            variant={showAIInsights ? "secondary" : "outline"} 
            className="flex items-center gap-1"
            onClick={toggleAIInsights}
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">AI Insights</span>
            <span className="sm:hidden">Insights</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={openImportDialog}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Import CSV</span>
            <span className="sm:hidden">Import</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
