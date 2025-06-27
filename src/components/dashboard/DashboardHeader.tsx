
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  BarChart3Icon, 
  BrainIcon, 
  StarIcon, 
  UploadIcon,
  CalendarDays
} from 'lucide-react';
import { Project } from '@/lib/supabase';
import { exportProjectsToCSV, exportProjectsToJSON } from '@/lib/exportUtils';
import { toast } from 'sonner';
import MobileNav from '@/components/ui/mobile-nav';
import DashboardTitle from './DashboardTitle';
import DesktopControls from './DesktopControls';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  handleAddProject: () => void;
  toggleAnalytics: () => void;
  showAnalytics: boolean;
  toggleAISupport: () => void;
  showAISupport: boolean;
  togglePriorities: () => void;
  showPriorities: boolean;
  openImportDialog: () => void;
  projects: Project[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  handleAddProject,
  toggleAnalytics,
  showAnalytics,
  toggleAISupport,
  showAISupport,
  togglePriorities,
  showPriorities,
  openImportDialog,
  projects,
}) => {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    exportProjectsToCSV(projects);
    toast.success('Projects exported as CSV');
  };

  const handleExportJSON = () => {
    exportProjectsToJSON(projects);
    toast.success('Projects exported as JSON');
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-smooth-fade-in">
      <DashboardTitle />
      
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => navigate('/tasks')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Tasks & Deadlines</span>
          <span className="sm:hidden">Tasks</span>
        </Button>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileNav
            onAddProject={handleAddProject}
            onToggleAnalytics={toggleAnalytics}
            onTogglePriorities={togglePriorities}
            onToggleAISupport={toggleAISupport}
            onImport={openImportDialog}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            showAnalytics={showAnalytics}
            showPriorities={showPriorities}
            showAISupport={showAISupport}
          />
        </div>
        
        {/* Desktop controls */}
        <DesktopControls
          handleAddProject={handleAddProject}
          toggleAnalytics={toggleAnalytics}
          showAnalytics={showAnalytics}
          toggleAISupport={toggleAISupport}
          showAISupport={showAISupport}
          togglePriorities={togglePriorities}
          showPriorities={showPriorities}
          openImportDialog={openImportDialog}
          handleExportCSV={handleExportCSV}
          handleExportJSON={handleExportJSON}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
