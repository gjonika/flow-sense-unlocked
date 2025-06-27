
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';
import { 
  Plus, 
  BarChart3, 
  Brain, 
  Star, 
  Upload,
  Download
} from 'lucide-react';

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
    <div className="hidden lg:flex items-center gap-2">
      <Button
        onClick={handleAddProject}
        className="bg-brand-primary hover:bg-green-700 transition-all duration-300 hover:scale-[1.02]"
        size="sm"
      >
        <Icon icon={Plus} size={16} />
        Add Survey
      </Button>
      
      <Button
        onClick={toggleAnalytics}
        variant={showAnalytics ? "default" : "outline"}
        size="sm"
        className={`transition-all duration-300 hover:scale-[1.02] ${
          showAnalytics ? 'bg-brand-secondary hover:bg-cyan-700' : ''
        }`}
      >
        <Icon icon={BarChart3} size={16} />
        Analytics
      </Button>
      
      <Button
        onClick={togglePriorities}
        variant={showPriorities ? "default" : "outline"}
        size="sm"
        className={`transition-all duration-300 hover:scale-[1.02] ${
          showPriorities ? 'bg-brand-secondary hover:bg-cyan-700' : ''
        }`}
      >
        <Icon icon={Star} size={16} />
        Priorities
      </Button>
      
      <Button
        onClick={toggleAISupport}
        variant={showAISupport ? "default" : "outline"}
        size="sm"
        className={`transition-all duration-300 hover:scale-[1.02] ${
          showAISupport ? 'bg-brand-secondary hover:bg-cyan-700' : ''
        }`}
      >
        <Icon icon={Brain} size={16} />
        AI Support
      </Button>
      
      <Button
        onClick={openImportDialog}
        variant="outline"
        size="sm"
        className="transition-all duration-300 hover:scale-[1.02]"
      >
        <Icon icon={Upload} size={16} />
        Import
      </Button>
      
      <Button
        onClick={handleExportCSV}
        variant="outline"
        size="sm"
        className="transition-all duration-300 hover:scale-[1.02]"
      >
        <Icon icon={Download} size={16} />
        Export
      </Button>
    </div>
  );
};

export default DesktopControls;
